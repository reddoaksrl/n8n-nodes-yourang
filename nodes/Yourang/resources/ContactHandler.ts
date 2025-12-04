import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

/**
 * Handler for Contact resource operations
 */
export class ContactHandler extends BaseResourceHandler {
	/**
	 * Execute a Contact operation
	 */
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'create':
				return this.create(itemIndex);
			case 'update':
				return this.update(itemIndex);
			case 'get':
				return this.get(itemIndex);
			case 'delete':
				return this.delete(itemIndex);
			case 'getAll':
				return this.getAll(itemIndex);
			case 'getByPhone':
				return this.getByPhone(itemIndex);
			case 'updateByPhone':
				return this.updateByPhone(itemIndex);
			case 'deleteByPhone':
				return this.deleteByPhone(itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Create a new contact
	 */
	private async create(itemIndex: number): Promise<any> {
		const body = this.buildBody([
			{ param: 'first_name', required: true },
			{ param: 'phone_number', required: true },
			{ param: 'last_name' },
			{ param: 'email' },
			{ param: 'address' },
		], itemIndex);

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/contacts`,
			body,
		});
	}

	/**
	 * Update a contact by ID
	 */
	private async update(itemIndex: number): Promise<any> {
		const contactId = this.getParameter<string>('contactId', itemIndex);
		const body = this.buildBody([
			{ param: 'first_name' },
			{ param: 'last_name' },
			{ param: 'phone_number' },
			{ param: 'email' },
			{ param: 'address' },
		], itemIndex);

		return this.httpRequest({
			method: 'PUT',
			url: `${this.baseUrl}/contacts/${contactId}`,
			body,
		});
	}

	/**
	 * Get a contact by ID
	 */
	private async get(itemIndex: number): Promise<any> {
		const contactId = this.getParameter<string>('contactId', itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/contacts/${contactId}`,
		});
	}

	/**
	 * Delete a contact by ID
	 */
	private async delete(itemIndex: number): Promise<any> {
		const contactId = this.getParameter<string>('contactId', itemIndex);

		return this.httpRequest({
			method: 'DELETE',
			url: `${this.baseUrl}/contacts/${contactId}`,
		});
	}

	/**
	 * Get all contacts with filters
	 */
	private async getAll(itemIndex: number): Promise<any> {
		const { limit } = this.getPaginationParams(itemIndex);
		const search = this.getParameter<IDataObject>('search', itemIndex, {});

		// Include advancedFilter in search object
		search.advancedFilter = this.getParameter<string>('advancedFilter', itemIndex, '');

		const qs = this.buildContactSearchParams(search, limit);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/contacts`,
			qs,
		});
	}

	/**
	 * Get contact by phone number
	 */
	private async getByPhone(itemIndex: number): Promise<any> {
		const phoneNumber = this.getParameter<string>('phoneNumberLookup', itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/contacts/by-phone/${encodeURIComponent(phoneNumber)}`,
		});
	}

	/**
	 * Update contact by phone number
	 */
	private async updateByPhone(itemIndex: number): Promise<any> {
		const phoneNumber = this.getParameter<string>('phoneNumberLookup', itemIndex);
		const body = this.buildBody([
			{ param: 'first_name' },
			{ param: 'last_name' },
			{ param: 'phone_number' },
			{ param: 'email' },
			{ param: 'address' },
		], itemIndex);

		return this.httpRequest({
			method: 'PUT',
			url: `${this.baseUrl}/contacts/by-phone/${encodeURIComponent(phoneNumber)}`,
			body,
		});
	}

	/**
	 * Delete contact by phone number
	 */
	private async deleteByPhone(itemIndex: number): Promise<any> {
		const phoneNumber = this.getParameter<string>('phoneNumberLookup', itemIndex);

		return this.httpRequest({
			method: 'DELETE',
			url: `${this.baseUrl}/contacts/by-phone/${encodeURIComponent(phoneNumber)}`,
		});
	}

	/**
	 * Build contact search parameters (column:value format)
	 * Supports advanced filter with OR (|) and AND (&) operators
	 *
	 * @param search - Search parameters object
	 * @param limit - Optional limit for results
	 *
	 * @example
	 * Advanced filter syntax (takes precedence over simple fields):
	 *   - OR operator:  "first_name:John|last_name:Doe"
	 *   - AND operator: "first_name:John&email:john@example.com"
	 *   - Mixed:        "first_name:John&(last_name:Doe|last_name:Smith)"
	 *
	 * Simple filter (fallback if no advancedFilter):
	 *   - Uses combineOperation parameter ('&' or '|') to join field filters
	 *   - Example: {first_name: "John", last_name: "Doe", combineOperation: "&"}
	 *     Results in: "first_name:John&last_name:Doe"
	 */
	private buildContactSearchParams(search: IDataObject, limit?: number): IDataObject {
		const qs: IDataObject = {};

		if (limit) {
			qs.limit = limit;
		}

		// Check for advanced filter query first
		const advancedFilter = search.advancedFilter as string;
		if (advancedFilter && advancedFilter.trim()) {
			// Use advanced filter directly
			qs.filter = advancedFilter.trim();

			// Include sort if present
			if (search.sort) {
				qs.sort = search.sort;
			}

			return qs;
		}

		// Fallback to simple search fields (existing logic)
		const filterArray: string[] = [];
		if (search.first_name) filterArray.push(`first_name:${search.first_name}`);
		if (search.last_name) filterArray.push(`last_name:${search.last_name}`);
		if (search.email) filterArray.push(`email:${search.email}`);
		if (search.phone_number) filterArray.push(`phone_number:${search.phone_number}`);

		if (filterArray.length > 0) {
			// Get the combine operator (default to AND if not specified)
			const combineOperator = (search.combineOperation as string) || '&';
			qs.filter = filterArray.join(combineOperator);
		}

		if (search.sort) {
			qs.sort = search.sort;
		}

		return qs;
	}
}
