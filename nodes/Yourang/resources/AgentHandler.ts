import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

export class AgentHandler extends BaseResourceHandler {
	async execute(operation: string, itemIndex: number): Promise<any> {
		if (operation === 'getAll') {
			const filters = this.getParameter<IDataObject>('filters', itemIndex, {});
			const agentType = filters.agent_type as string;

			const { returnAll, limit } = this.getPaginationParams(itemIndex);
			const qs = this.buildQueryParams({ agent_type: agentType });

			if (returnAll) {
				return this.httpRequestAll({ url: `${this.baseUrl}/agents`, qs, pageSize: 100 });
			}

			return await this.httpRequest({
				method: 'GET',
				url: `${this.baseUrl}/agents`,
				qs: { ...qs, limit },
			});
		} else if (operation === 'get') {
			const agentId = this.getParameter<string>('agentId', itemIndex);

			return await this.httpRequest({
				method: 'GET',
				url: `${this.baseUrl}/agents/${agentId}`,
			});
		}

		throw new Error(`Unknown operation: ${operation}`);
	}
}
