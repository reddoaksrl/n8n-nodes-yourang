import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

/**
 * Handler for Action resource operations
 */
export class ActionHandler extends BaseResourceHandler {
	/**
	 * Execute an Action operation
	 */
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'listActions':
				return this.listActions();
			case 'executeSingle':
				return this.executeSingle(itemIndex);
			case 'executeBatchNumbers':
				return this.executeBatchNumbers(itemIndex);
			case 'executeBatchContacts':
				return this.executeBatchContacts(itemIndex);
			case 'getActionHistory':
				return this.getActionHistory(itemIndex);
			case 'getActionHistoryDetails':
				return this.getActionHistoryDetails(itemIndex);
			case 'getBatchHistory':
				return this.getBatchHistory(itemIndex);
			case 'getBatchHistoryDetails':
				return this.getBatchHistoryDetails(itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	/**
	 * List all available action configurations
	 */
	private async listActions(): Promise<any> {
		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/actions/`,
		});
	}

	/**
	 * Execute action with single phone number
	 */
	private async executeSingle(itemIndex: number): Promise<any> {
		const configurationId = this.getParameter<string>('configurationId', itemIndex);
		const toNumber = this.getParameter<string>('to_number', itemIndex);

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/actions/${configurationId}/execute`,
			body: { to_number: toNumber },
		});
	}

	/**
	 * Execute batch action with phone numbers
	 */
	private async executeBatchNumbers(itemIndex: number): Promise<any> {
		const configurationId = this.getParameter<string>('configurationId', itemIndex);
		const toNumbersString = this.getParameter<string>('to_numbers', itemIndex);
		const toNumbers = this.parseMultilineToArray(toNumbersString);

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/actions/${configurationId}/batch/numbers`,
			body: { to_numbers: toNumbers },
		});
	}

	/**
	 * Execute batch action with contact IDs
	 */
	private async executeBatchContacts(itemIndex: number): Promise<any> {
		const configurationId = this.getParameter<string>('configurationId', itemIndex);
		const contactIdsString = this.getParameter<string>('contact_ids', itemIndex);
		const contactIds = this.parseMultilineToArray(contactIdsString);

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/actions/${configurationId}/batch/contacts`,
			body: { contact_ids: contactIds },
		});
	}

	/**
	 * Get action execution history
	 */
	private async getActionHistory(itemIndex: number): Promise<any> {
		const { limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('filters', itemIndex, {});

		const qs = this.buildQueryParams({
			limit,
			configuration_id: filters.configuration_id,
			batch_id: filters.batch_id,
		});

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/actions/history`,
			qs,
		});
	}

	/**
	 * Get details of specific action execution
	 */
	private async getActionHistoryDetails(itemIndex: number): Promise<any> {
		const actionHistoryId = this.getParameter<string>('actionHistoryId', itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/actions/history/${actionHistoryId}`,
		});
	}

	/**
	 * Get batch execution history
	 */
	private async getBatchHistory(itemIndex: number): Promise<any> {
		const { limit } = this.getPaginationParams(itemIndex);

		const qs = this.buildQueryParams({ limit });

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/actions/batch-history`,
			qs,
		});
	}

	/**
	 * Get details of specific batch execution
	 */
	private async getBatchHistoryDetails(itemIndex: number): Promise<any> {
		const batchExecuteId = this.getParameter<string>('batchExecuteId', itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/actions/batch-history/${batchExecuteId}`,
		});
	}
}
