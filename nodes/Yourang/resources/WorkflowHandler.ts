import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

export class WorkflowHandler extends BaseResourceHandler {
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'getAll':
				return this.getAll(itemIndex);
			case 'get':
				return this.get(itemIndex);
			case 'execute':
				return this.executeWorkflow(itemIndex);
			case 'getExecutions':
				return this.getExecutions(itemIndex);
			case 'getExecutionDetails':
				return this.getExecutionDetails(itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	private async getAll(itemIndex: number): Promise<any> {
		const { limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('filters', itemIndex, {});
		const advancedFilter = this.getParameter<string>('advancedFilter', itemIndex, '');

		const qs = this.buildWorkflowFilters(filters, advancedFilter, limit);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/workflows/`,
			qs,
		});
	}

	private async get(itemIndex: number): Promise<any> {
		const workflowId = this.getParameter<string>('workflowId', itemIndex);

		if (!workflowId || !workflowId.trim()) {
			throw new Error('Workflow ID is required');
		}

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/workflows/${workflowId}`,
		});
	}

	private async executeWorkflow(itemIndex: number): Promise<any> {
		const workflowId = this.getParameter<string>('workflowId', itemIndex);
		const toNumber = this.getParameter<string>('to_number', itemIndex);

		if (!workflowId || !workflowId.trim()) {
			throw new Error('Workflow ID is required');
		}

		if (!toNumber || !toNumber.trim()) {
			throw new Error('To Number is required');
		}

		const body: IDataObject = {
			to_number: toNumber,
		};

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/workflows/${workflowId}/execute`,
			body,
		});
	}

	private async getExecutions(itemIndex: number): Promise<any> {
		const workflowId = this.getParameter<string>('workflowId', itemIndex);
		const { limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('executionFilters', itemIndex, {});

		if (!workflowId || !workflowId.trim()) {
			throw new Error('Workflow ID is required');
		}

		const qs = this.buildQueryParams({
			limit,
			offset: filters.offset,
			sort: filters.sort,
			filter: this.buildExecutionFilter(filters),
		});

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/workflows/${workflowId}/executions`,
			qs,
		});
	}

	private async getExecutionDetails(itemIndex: number): Promise<any> {
		const workflowId = this.getParameter<string>('workflowId', itemIndex);
		const executionId = this.getParameter<string>('executionId', itemIndex);

		if (!workflowId || !workflowId.trim()) {
			throw new Error('Workflow ID is required');
		}

		if (!executionId || !executionId.trim()) {
			throw new Error('Execution ID is required');
		}

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/workflows/${workflowId}/executions/${executionId}`,
		});
	}

	private buildWorkflowFilters(
		filters: IDataObject,
		advancedFilter: string,
		limit?: number,
	): IDataObject {
		const qs: IDataObject = {};

		if (limit) {
			qs.limit = limit;
		}

		// Advanced filter takes precedence
		if (advancedFilter && advancedFilter.trim()) {
			qs.filter = advancedFilter.trim();
			if (filters.sort) {
				qs.sort = filters.sort;
			}
			return qs;
		}

		// Build simple filters
		const filterArray: string[] = [];

		if (filters.display_name) {
			filterArray.push(`display_name:${filters.display_name}`);
		}

		if (filters.is_enabled !== undefined && filters.is_enabled !== null && filters.is_enabled !== '') {
			filterArray.push(`is_enabled:${filters.is_enabled}`);
		}

		if (filterArray.length > 0) {
			qs.filter = filterArray.join('&');
		}

		if (filters.sort) {
			qs.sort = filters.sort;
		}

		return qs;
	}

	private buildExecutionFilter(filters: IDataObject): string {
		const filterArray: string[] = [];

		if (filters.status) {
			filterArray.push(`status:${filters.status}`);
		}

		if (filters.type) {
			filterArray.push(`type:${filters.type}`);
		}

		return filterArray.length > 0 ? filterArray.join('&') : '';
	}
}
