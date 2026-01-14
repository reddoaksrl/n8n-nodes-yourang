import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

export class AgentHandler extends BaseResourceHandler {
	async execute(operation: string, itemIndex: number): Promise<any> {
		if (operation === 'getAll') {
			const filters = this.getParameter<IDataObject>('filters', itemIndex, {});
			const agentType = filters.agent_type as string;
			const { limit, returnAll } = this.getPaginationParams(itemIndex);

			const qs = this.buildQueryParams({
				agent_type: agentType,
				limit: returnAll ? undefined : limit,
			});

			const response = await this.httpRequest({
				method: 'GET',
				url: `${this.baseUrl}/v1/agents/`,
				qs,
			});

			return response.data;
		} else if (operation === 'get') {
			const agentId = this.getParameter<string>('agentId', itemIndex);

			return await this.httpRequest({
				method: 'GET',
				url: `${this.baseUrl}/v1/agents/${agentId}`,
			}).then((res) => res.data);
		}

		throw new Error(`Unknown operation: ${operation}`);
	}
}
