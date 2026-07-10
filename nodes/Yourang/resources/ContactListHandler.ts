import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

export class ContactListHandler extends BaseResourceHandler {
	async execute(operation: string, itemIndex: number): Promise<any> {
		switch (operation) {
			case 'getAll':
				return this.getAll(itemIndex);
			case 'get':
				return this.get(itemIndex);
			case 'getContacts':
				return this.getContacts(itemIndex);
			case 'addContacts':
				return this.addContacts(itemIndex);
			case 'removeContacts':
				return this.removeContacts(itemIndex);
			default:
				throw new Error(`Unknown operation: ${operation}`);
		}
	}

	private async getAll(itemIndex: number): Promise<any> {
		const { returnAll, limit } = this.getPaginationParams(itemIndex);
		const filters = this.getParameter<IDataObject>('filters', itemIndex, {});

		if (returnAll) {
			const qs = this.buildQueryParams({ search: filters.search });
			return this.httpRequestAll({ url: `${this.baseUrl}/contact-lists`, qs, pageSize: 100 });
		}

		const qs = this.buildQueryParams({ limit, search: filters.search });
		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/contact-lists`,
			qs,
		});
	}

	private async get(itemIndex: number): Promise<any> {
		const contactListId = this.getContactListId(itemIndex);

		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/contact-lists/${contactListId}`,
		});
	}

	private async getContacts(itemIndex: number): Promise<any> {
		const contactListId = this.getContactListId(itemIndex);
		const { returnAll, limit } = this.getPaginationParams(itemIndex);

		if (returnAll) {
			return this.httpRequestAll({
				url: `${this.baseUrl}/contact-lists/${contactListId}/contacts`,
				pageSize: 100,
			});
		}

		const qs = this.buildQueryParams({ limit });
		return this.httpRequest({
			method: 'GET',
			url: `${this.baseUrl}/contact-lists/${contactListId}/contacts`,
			qs,
		});
	}

	private async addContacts(itemIndex: number): Promise<any> {
		const contactListId = this.getContactListId(itemIndex);
		const body = this.buildMembershipBody(itemIndex);

		const autoCreate = this.getParameter<boolean>('autoCreate', itemIndex, false);
		if (autoCreate) {
			body.auto_create = true;
		}

		return this.httpRequest({
			method: 'POST',
			url: `${this.baseUrl}/contact-lists/${contactListId}/contacts`,
			body,
		});
	}

	private async removeContacts(itemIndex: number): Promise<any> {
		const contactListId = this.getContactListId(itemIndex);
		const body = this.buildMembershipBody(itemIndex);

		return this.httpRequest({
			method: 'DELETE',
			url: `${this.baseUrl}/contact-lists/${contactListId}/contacts`,
			body,
		});
	}

	private getContactListId(itemIndex: number): string {
		const contactListId = this.getParameter<string>('contactListId', itemIndex);

		if (!contactListId || !contactListId.trim()) {
			throw new Error('Contact List ID is required');
		}

		return contactListId.trim();
	}

	private buildMembershipBody(itemIndex: number): IDataObject {
		const contactIds = this.parseCommaSeparatedToArray(
			this.getParameter<string>('contactIds', itemIndex, ''),
		);
		const phoneNumbers = this.parseCommaSeparatedToArray(
			this.getParameter<string>('phoneNumbers', itemIndex, ''),
		);

		if (contactIds.length === 0 && phoneNumbers.length === 0) {
			throw new Error('At least one Contact ID or Phone Number is required');
		}

		if (contactIds.length + phoneNumbers.length > 500) {
			throw new Error('A maximum of 500 entries (contact IDs and phone numbers combined) is allowed per request');
		}

		const body: IDataObject = {};

		if (contactIds.length > 0) {
			body.contact_ids = contactIds;
		}

		if (phoneNumbers.length > 0) {
			body.phone_numbers = phoneNumbers;
		}

		return body;
	}

	private parseCommaSeparatedToArray(input: string): string[] {
		if (!input || typeof input !== 'string') {
			return [];
		}

		return input
			.split(',')
			.map(entry => entry.trim())
			.filter(entry => entry.length > 0);
	}
}
