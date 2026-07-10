import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

/**
 * Handler for Catalogue resource operations
 */
export class CatalogueHandler extends BaseResourceHandler {
	/**
	 * Execute a Catalogue operation
	 */
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'create':
				return this.create(itemIndex);
			case 'delete':
				return this.delete(itemIndex);
			case 'get':
				return this.get(itemIndex);
			case 'getAll':
				return this.getAll(itemIndex);
			case 'update':
				return this.update(itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Create a new catalogue
	 */
	private async create(itemIndex: number): Promise<any> {
		const body = this.buildBody([
			{ param: 'name', required: true },
			{ param: 'description' },
		], itemIndex);

		// The json-type field may resolve to a string or, via expressions, to an actual array
		const initialItemsRaw = this.getParameter<string | object>('initialItems', itemIndex, '[]');
		let parsed: any = initialItemsRaw;
		if (typeof initialItemsRaw === 'string') {
			if (!initialItemsRaw.trim() || initialItemsRaw.trim() === '[]') {
				parsed = [];
			} else {
				try {
					parsed = JSON.parse(initialItemsRaw);
				} catch (error) {
					throw new Error('Initial Items must be a valid JSON array of item objects');
				}
			}
		}
		if (Array.isArray(parsed) && parsed.length > 0) {
			body.items = parsed;
		} else if (parsed && !Array.isArray(parsed)) {
			throw new Error('Initial Items must be a valid JSON array of item objects');
		}

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/catalogues`,
			body,
		});
	}

	/**
	 * Get a catalogue by ID
	 */
	private async get(itemIndex: number): Promise<any> {
		const catalogueId = this.getParameter<string>('catalogueId', itemIndex);

		if (!catalogueId || !catalogueId.trim()) {
			throw new Error('Catalogue ID is required');
		}

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/catalogues/${catalogueId}`,
		});
	}

	/**
	 * Get all catalogues with filters and pagination
	 */
	private async getAll(itemIndex: number): Promise<any> {
		const { returnAll, limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('filters', itemIndex, {});

		const qs = this.buildQueryParams({
			search: filters.search,
			sort: filters.sort,
		});

		if (returnAll) {
			return this.httpRequestAll({ url: `${this.baseUrl}/catalogues`, qs, pageSize: 100 });
		}

		if (limit) {
			qs.limit = limit;
		}

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/catalogues`,
			qs,
		});
	}

	/**
	 * Update a catalogue by ID
	 */
	private async update(itemIndex: number): Promise<any> {
		const catalogueId = this.getParameter<string>('catalogueId', itemIndex);

		if (!catalogueId || !catalogueId.trim()) {
			throw new Error('Catalogue ID is required');
		}

		const updateFields = this.getParameter<IDataObject>('updateFields', itemIndex, {});
		const body: IDataObject = {};

		if (updateFields.name !== undefined && updateFields.name !== '') {
			body.name = updateFields.name;
		}

		if (updateFields.description !== undefined && updateFields.description !== '') {
			body.description = updateFields.description;
		}

		return this.httpRequest({
			method: 'PUT',
			url: `${this.baseUrl}/catalogues/${catalogueId}`,
			body,
		});
	}

	/**
	 * Delete a catalogue by ID
	 */
	private async delete(itemIndex: number): Promise<any> {
		const catalogueId = this.getParameter<string>('catalogueId', itemIndex);

		if (!catalogueId || !catalogueId.trim()) {
			throw new Error('Catalogue ID is required');
		}

		const preserveItems = this.getParameter<boolean>('preserveItems', itemIndex, false);
		const qs = this.buildQueryParams({ preserve_items: preserveItems });

		return this.httpRequest({
			method: 'DELETE',
			url: `${this.baseUrl}/catalogues/${catalogueId}`,
			qs,
		});
	}
}
