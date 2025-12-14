import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

/**
 * Handler for Call History resource operations
 */
export class CallHistoryHandler extends BaseResourceHandler {
	/**
	 * Execute a Call History operation
	 */
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'get':
				return this.getCall(itemIndex);
			case 'getAll':
				return this.getAllCalls(itemIndex);
			case 'getTranscript':
				return this.getTranscript(itemIndex);
			case 'getSummary':
				return this.getSummary(itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * Get a single call by ID
	 */
	private async getCall(itemIndex: number): Promise<any> {
		const callId = this.getParameter<string>('callId', itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/call-history/${callId}`,
		});
	}

	/**
	 * Get all calls with filters
	 */
	private async getAllCalls(itemIndex: number): Promise<any> {
		const { limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('filters', itemIndex, {});

		const qs = this.buildQueryParams({
			limit,
			sort: filters.sort,
			call_type: filters.call_type,
			call_status: filters.call_status,
			is_outbound: filters.is_outbound,
			phone_number: filters.phone_number,
			contact_id: filters.contact_id,
		});

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/call-history`,
			qs,
		});
	}

	/**
	 * Get call transcript
	 */
	private async getTranscript(itemIndex: number): Promise<any> {
		const callId = this.getParameter<string>('callId', itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/call-history/${callId}/transcript`,
		});
	}

	/**
	 * Get call AI summary
	 */
	private async getSummary(itemIndex: number): Promise<any> {
		const callId = this.getParameter<string>('callId', itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/call-history/${callId}/summary`,
		});
	}
}
