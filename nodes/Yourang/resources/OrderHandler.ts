import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

/**
 * Handler for Order resource operations
 */
export class OrderHandler extends BaseResourceHandler {
	/**
	 * Execute an Order operation
	 */
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
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
	 * Get a single order by ID
	 */
	private async get(itemIndex: number): Promise<any> {
		const orderId = this.getParameter<string>('orderId', itemIndex);

		if (!orderId || !orderId.trim()) {
			throw new Error('Order ID is required');
		}

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/orders/${orderId}`,
		});
	}

	/**
	 * Get all orders with optional filters
	 */
	private async getAll(itemIndex: number): Promise<any> {
		const { returnAll, limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('filters', itemIndex, {});

		const qs = this.buildQueryParams({
			sort: filters.sort,
			status: filters.status,
			created_after: filters.created_after,
		});

		if (returnAll) {
			return this.httpRequestAll({ url: `${this.baseUrl}/orders`, qs, pageSize: 100 });
		}

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/orders`,
			qs: { ...qs, limit },
		});
	}

	/**
	 * Update an order
	 */
	private async update(itemIndex: number): Promise<any> {
		const orderId = this.getParameter<string>('orderId', itemIndex);

		if (!orderId || !orderId.trim()) {
			throw new Error('Order ID is required');
		}

		const updateFields = this.getParameter<IDataObject>('updateFields', itemIndex, {});

		const notes = typeof updateFields.notes === 'string' ? updateFields.notes.trim() : '';
		const status = typeof updateFields.status === 'string' ? updateFields.status.trim() : '';
		const statusReason =
			typeof updateFields.status_reason === 'string' ? updateFields.status_reason.trim() : '';

		if (status === 'refused' && !statusReason) {
			throw new Error('Status Reason is required when Status is set to Refused');
		}

		const body: IDataObject = {};

		if (notes) {
			body.notes = notes;
		}

		if (status) {
			body.status = status;
		}

		if (statusReason) {
			body.status_reason = statusReason;
		}

		if (Object.keys(body).length === 0) {
			throw new Error('No fields provided to update. Please add at least one value in Update Fields');
		}

		return this.httpRequest({
			method: 'PATCH',
			url: `${this.baseUrl}/orders/${orderId}`,
			body,
		});
	}
}
