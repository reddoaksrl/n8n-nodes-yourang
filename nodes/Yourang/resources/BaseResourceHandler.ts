import { IExecuteFunctions, IDataObject, IHttpRequestMethods, NodeApiError, JsonObject } from 'n8n-workflow';

/**
 * Base abstract class for resource handlers
 * Provides common functionality for all Yourang resources
 */
export abstract class BaseResourceHandler {
	protected context: IExecuteFunctions;
	protected baseUrl: string;

	constructor(context: IExecuteFunctions, baseUrl: string) {
		this.context = context;
		this.baseUrl = baseUrl;
	}

	/**
	 * Execute an operation for this resource
	 */
	abstract execute(operation: string, itemIndex: number): Promise<any>;

	/**
	 * Helper: Get a node parameter
	 */
	protected getParameter<T = any>(parameterName: string, itemIndex: number, defaultValue?: T): T {
		return this.context.getNodeParameter(parameterName, itemIndex, defaultValue) as T;
	}

	/**
	 * Helper: Make authenticated HTTP request
	 */
	protected async httpRequest(options: {
		method: IHttpRequestMethods;
		url: string;
		body?: IDataObject;
		qs?: IDataObject;
	}): Promise<any> {
		try {
			return await this.context.helpers.httpRequestWithAuthentication.call(
				this.context,
				'yourangApi',
				{
					method: options.method,
					url: options.url,
					body: options.body,
					qs: options.qs,
				}
			);
		} catch (error) {
			throw new NodeApiError(this.context.getNode(), error as JsonObject);
		}
	}

	/**
	 * Helper: Build request body from parameters (only non-empty values)
	 * Validates that required fields have non-empty values
	 */
	protected buildBody(fields: Array<{ param: string; bodyKey?: string; required?: boolean }>, itemIndex: number): IDataObject {
		const body: IDataObject = {};
		const missingFields: string[] = [];

		for (const field of fields) {
			const value = this.getParameter(field.param, itemIndex, '');
			const key = field.bodyKey || field.param;
			const isEmptyString = typeof value === 'string' && value.trim() === '';

			// Validate required fields
			if (field.required && (!value || isEmptyString)) {
				missingFields.push(field.param);
			}

			// Add to body if value is provided (non-empty)
			if (value && !isEmptyString) {
				body[key] = value;
			}
		}

		// Throw error if required fields are missing
		if (missingFields.length > 0) {
			throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
		}

		return body;
	}

	/**
	 * Helper: Build query string parameters
	 */
	protected buildQueryParams(params: IDataObject): IDataObject {
		const qs: IDataObject = {};

		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null && value !== '') {
				qs[key] = value;
			}
		}

		return qs;
	}

	/**
	 * Helper: Handle pagination (returnAll and limit)
	 */
	protected getPaginationParams(itemIndex: number): { returnAll: boolean; limit?: number } {
		const returnAll = this.getParameter<boolean>('returnAll', itemIndex, false);
		const limit = returnAll ? undefined : this.getParameter<number>('limit', itemIndex, 50);

		return { returnAll, limit };
	}

	/**
	 * Helper: Fetch all pages of a paginated list endpoint.
	 * Loops with increasing offset until exhaustion.
	 * Returns { ok, data: [...all items], meta: { total_items } }.
	 *
	 * Termination strategy:
	 *   - When meta.total_items is provided, stop once accumulated >= total_items.
	 *   - When meta is missing (endpoints outside OpenAPI spec), fall back to
	 *     stopping when a short page arrives (items.length < pageSize).
	 *   - A hard iteration cap prevents infinite loops from a misbehaving API.
	 */
	protected async httpRequestAll(options: {
		url: string;
		qs?: IDataObject;
		pageSize?: number;
		startOffset?: number;
	}): Promise<any> {
		const pageSize = options.pageSize ?? 50;
		const maxIterations = 1000;
		const baseQs = { ...(options.qs ?? {}) };
		const allData: any[] = [];
		let offset = typeof options.startOffset === 'number' && options.startOffset > 0 ? options.startOffset : 0;
		let lastResponse: any;
		let totalItems = 0;
		let hasTotalItems = false;

		for (let iter = 0; iter < maxIterations; iter++) {
			lastResponse = await this.httpRequest({
				method: 'GET',
				url: options.url,
				qs: { ...baseQs, limit: pageSize, offset },
			});

			const items: any[] = Array.isArray(lastResponse?.data) ? lastResponse.data : [];
			allData.push(...items);

			const rawTotal = lastResponse?.meta?.total_items;
			if (typeof rawTotal === 'number' && rawTotal >= 0) {
				totalItems = rawTotal;
				hasTotalItems = true;
			}

			const reachedEnd = hasTotalItems
				? allData.length >= totalItems
				: items.length < pageSize;

			if (items.length === 0 || reachedEnd) {
				return {
					ok: lastResponse?.ok ?? true,
					data: allData,
					meta: { total_items: hasTotalItems ? totalItems : allData.length },
				};
			}

			offset += pageSize;
		}

		// Safety cap hit — return what we have rather than loop forever
		return {
			ok: lastResponse?.ok ?? true,
			data: allData,
			meta: { total_items: hasTotalItems ? totalItems : allData.length },
		};
	}

	/**
	 * Helper: Extract date part from datetime string (YYYY-MM-DD)
	 * Handles ISO 8601 datetime strings and already-formatted dates
	 *
	 * @param dateTime - ISO 8601 datetime string or date string
	 * @returns Date in YYYY-MM-DD format, or empty string if invalid
	 *
	 * @example
	 * extractDate("2024-12-04T10:30:00Z") // "2024-12-04"
	 * extractDate("2024-12-04") // "2024-12-04"
	 * extractDate("") // ""
	 */
	protected extractDate(dateTime: string): string {
		if (!dateTime || typeof dateTime !== 'string') return '';

		// If already in date format (YYYY-MM-DD), return as is
		const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
		if (dateOnlyPattern.test(dateTime.trim())) {
			return dateTime.trim();
		}

		// Extract date part from ISO 8601 datetime
		const parts = dateTime.split('T');
		if (parts.length > 0 && dateOnlyPattern.test(parts[0])) {
			return parts[0];
		}

		// If format is unexpected, return empty string
		return '';
	}

	/**
	 * Helper: Parse multi-line string to array
	 */
	protected parseMultilineToArray(input: string): string[] {
		return input
			.split('\n')
			.map(line => line.trim())
			.filter(line => line.length > 0);
	}

}
