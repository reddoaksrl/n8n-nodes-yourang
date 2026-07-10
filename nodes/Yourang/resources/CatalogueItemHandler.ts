import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

/**
 * Handler for Catalogue Item resource operations
 */
export class CatalogueItemHandler extends BaseResourceHandler {
	/**
	 * Execute a Catalogue Item operation
	 */
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'assign':
				return this.assign(itemIndex);
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
	 * Assign items to a catalogue, or unassign them when no catalogue is provided
	 */
	private async assign(itemIndex: number): Promise<any> {
		const itemIdsRaw = this.getParameter<string>('itemIds', itemIndex, '');
		const itemIds = itemIdsRaw
			.split(',')
			.map((id) => id.trim())
			.filter((id) => id.length > 0);

		if (itemIds.length === 0) {
			throw new Error('At least one Item ID is required');
		}

		const catalogueId = this.getParameter<string>('catalogueId', itemIndex, '');
		const body: IDataObject = {
			item_ids: itemIds,
			catalogue_id: catalogueId && catalogueId.trim() ? catalogueId.trim() : null,
		};

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/catalogues/items/assign`,
			body,
		});
	}

	/**
	 * Create a new catalogue item
	 */
	private async create(itemIndex: number): Promise<any> {
		const name = this.getParameter<string>('name', itemIndex, '');

		if (!name || !name.trim()) {
			throw new Error('Name is required');
		}

		const additionalFields = this.getParameter<IDataObject>('additionalFields', itemIndex, {});
		const body: IDataObject = { name };

		const keys = ['catalogue_id', 'category', 'currency', 'description', 'price', 'quantity', 'sku'];
		for (const key of keys) {
			const value = additionalFields[key];
			if (value !== undefined && value !== '') {
				body[key] = value;
			}
		}

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/catalogues/items`,
			body,
		});
	}

	/**
	 * Get a catalogue item by ID
	 */
	private async get(itemIndex: number): Promise<any> {
		const itemId = this.getParameter<string>('itemId', itemIndex);

		if (!itemId || !itemId.trim()) {
			throw new Error('Item ID is required');
		}

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/catalogues/items/${itemId}`,
		});
	}

	/**
	 * Get all catalogue items with filters and pagination
	 */
	private async getAll(itemIndex: number): Promise<any> {
		const { returnAll, limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('filters', itemIndex, {});

		const qs = this.buildQueryParams({
			catalogue_id: filters.catalogue_id,
			search: filters.search,
			sort: filters.sort,
			standalone_only: filters.standalone_only,
		});

		if (returnAll) {
			return this.httpRequestAll({ url: `${this.baseUrl}/catalogues/items`, qs, pageSize: 100 });
		}

		if (limit) {
			qs.limit = limit;
		}

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/catalogues/items`,
			qs,
		});
	}

	/**
	 * Update a catalogue item by ID
	 */
	private async update(itemIndex: number): Promise<any> {
		const itemId = this.getParameter<string>('itemId', itemIndex);

		if (!itemId || !itemId.trim()) {
			throw new Error('Item ID is required');
		}

		const updateFields = this.getParameter<IDataObject>('updateFields', itemIndex, {});
		const body: IDataObject = {};

		const keys = ['category', 'currency', 'description', 'name', 'price', 'quantity', 'sku'];
		for (const key of keys) {
			const value = updateFields[key];
			if (value !== undefined && value !== '') {
				body[key] = value;
			}
		}

		return this.httpRequest({
			method: 'PUT',
			url: `${this.baseUrl}/catalogues/items/${itemId}`,
			body,
		});
	}

	/**
	 * Delete a catalogue item by ID
	 */
	private async delete(itemIndex: number): Promise<any> {
		const itemId = this.getParameter<string>('itemId', itemIndex);

		if (!itemId || !itemId.trim()) {
			throw new Error('Item ID is required');
		}

		return this.httpRequest({
			method: 'DELETE',
			url: `${this.baseUrl}/catalogues/items/${itemId}`,
		});
	}
}
