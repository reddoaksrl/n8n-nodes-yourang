import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

export class WalletHandler extends BaseResourceHandler {
	async execute(operation: string, itemIndex: number): Promise<any> {
		if (operation === 'get') {
			return await this.httpRequest({
				method: 'GET',
				url: `${this.baseUrl}/wallet`,
			});
		} else if (operation === 'getTransactions') {
			const filters = this.getParameter<IDataObject>('filters', itemIndex, {});
			const createdAfter = filters.created_after as string;
			const transactionType = filters.transaction_type as string;

			const { returnAll, limit } = this.getPaginationParams(itemIndex);
			const qs = this.buildQueryParams({
				created_after: createdAfter,
				transaction_type: transactionType,
			});

			if (returnAll) {
				return this.httpRequestAll({ url: `${this.baseUrl}/wallet/transactions`, qs, pageSize: 100 });
			}

			return await this.httpRequest({
				method: 'GET',
				url: `${this.baseUrl}/wallet/transactions`,
				qs: { ...qs, limit },
			});
		}

		throw new Error(`Unknown operation: ${operation}`);
	}
}
