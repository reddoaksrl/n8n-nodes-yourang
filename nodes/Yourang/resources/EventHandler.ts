import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

/**
 * Handler for Event resource operations
 */
export class EventHandler extends BaseResourceHandler {
	/**
	 * Execute an Event operation
	 */
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'get':
				return this.get(itemIndex);
			case 'getAll':
				return this.getAll(itemIndex);
			case 'getByDate':
				return this.getByDate(itemIndex);
			case 'update':
				return this.update(itemIndex);
			case 'updateStatus':
				return this.updateStatus(itemIndex);
			case 'delete':
				return this.delete(itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Get a single event by ID
	 */
	private async get(itemIndex: number): Promise<any> {
		const eventId = this.getParameter<string>('eventId', itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/events/${eventId}`,
		});
	}

	/**
	 * Get all events grouped by date
	 */
	private async getAll(itemIndex: number): Promise<any> {
		const startDate = this.getParameter<string>('startDate', itemIndex, '');
		const endDate = this.getParameter<string>('endDate', itemIndex, '');
		const eventsPerDay = this.getParameter<number>('eventsPerDay', itemIndex, 50);

		const qs = this.buildQueryParams({
			events_per_day: eventsPerDay,
			start_date: startDate ? this.extractDate(startDate) : undefined,
			end_date: endDate ? this.extractDate(endDate) : undefined,
		});

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/events`,
			qs,
		});
	}

	/**
	 * Get events for a specific date
	 */
	private async getByDate(itemIndex: number): Promise<any> {
		const targetDate = this.getParameter<string>('targetDate', itemIndex);
		const { limit } = this.getPaginationParams(itemIndex);

		const qs = this.buildQueryParams({
			target_date: this.extractDate(targetDate),
			limit,
		});

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/events/date`,
			qs,
		});
	}

	/**
	 * Update an event
	 */
	private async update(itemIndex: number): Promise<any> {
		const eventId = this.getParameter<string>('eventId', itemIndex);

		const body = this.buildBody([
			{ param: 'client_full_name' },
			{ param: 'client_email' },
			{ param: 'client_phone_number' },
			{ param: 'details' },
			{ param: 'starting_date' },
			{ param: 'ending_date' },
			{ param: 'status' },
		], itemIndex);

		return this.httpRequest({
			method: 'PUT',
			url: `${this.baseUrl}/events/${eventId}`,
			body,
		});
	}

	/**
	 * Update event status (approve/reject)
	 */
	private async updateStatus(itemIndex: number): Promise<any> {
		const eventId = this.getParameter<string>('eventId', itemIndex);
		const isApproved = this.getParameter<boolean>('isApproved', itemIndex);

		return this.httpRequest({
			method: 'PATCH',
			url: `${this.baseUrl}/events/${eventId}/status`,
			qs: { is_approved: isApproved },
		});
	}

	/**
	 * Delete an event
	 */
	private async delete(itemIndex: number): Promise<any> {
		const eventId = this.getParameter<string>('eventId', itemIndex);

		return this.httpRequest({
			method: 'DELETE',
			url: `${this.baseUrl}/events/${eventId}`,
		});
	}
}
