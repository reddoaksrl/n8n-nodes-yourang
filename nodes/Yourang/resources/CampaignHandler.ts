import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

export class CampaignHandler extends BaseResourceHandler {
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'getAll':
				return this.getAll(itemIndex);
			case 'get':
				return this.get(itemIndex);
			case 'getStats':
				return this.getStats(itemIndex);
			case 'pause':
				return this.pause(itemIndex);
			case 'resume':
				return this.resume(itemIndex);
			case 'start':
				return this.start(itemIndex);
			case 'stop':
				return this.stop(itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	private async getAll(itemIndex: number): Promise<any> {
		const { returnAll, limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('filters', itemIndex, {});

		if (returnAll) {
			const qs = this.buildQueryParams({
				search: filters.search,
				status: filters.status,
			});
			return this.httpRequestAll({ url: `${this.baseUrl}/campaigns`, qs, pageSize: 100 });
		}

		const qs = this.buildQueryParams({
			search: filters.search,
			status: filters.status,
			limit,
			offset: 0,
		});

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/campaigns`,
			qs,
		});
	}

	private async get(itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/campaigns/${campaignId}`,
		});
	}

	private async getStats(itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/campaigns/${campaignId}/stats`,
		});
	}

	private async pause(itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(itemIndex);

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/campaigns/${campaignId}/pause`,
		});
	}

	private async resume(itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(itemIndex);

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/campaigns/${campaignId}/resume`,
		});
	}

	private async start(itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(itemIndex);

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/campaigns/${campaignId}/start`,
		});
	}

	private async stop(itemIndex: number): Promise<any> {
		const campaignId = this.getCampaignId(itemIndex);

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/campaigns/${campaignId}/stop`,
		});
	}

	private getCampaignId(itemIndex: number): string {
		const campaignId = this.getParameter<string>('campaignId', itemIndex);

		if (!campaignId || !campaignId.trim()) {
			throw new Error('Campaign ID is required');
		}

		return campaignId;
	}
}
