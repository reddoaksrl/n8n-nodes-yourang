import { IDataObject } from 'n8n-workflow';
import { BaseResourceHandler } from './BaseResourceHandler';

export class AgentToolHandler extends BaseResourceHandler {
	async execute(operation: string, itemIndex: number): Promise<any> {
		if (operation === 'getAll') {
			const agentId = this.getParameter<string>('agentId', itemIndex);

			return await this.httpRequest({
				method: 'GET',
				url: `${this.baseUrl}/agents/${agentId}/tools`,
			});
		} else if (operation === 'get') {
			const agentId = this.getParameter<string>('agentId', itemIndex);
			const toolName = this.getParameter<string>('toolName', itemIndex);

			return await this.httpRequest({
				method: 'GET',
				url: `${this.baseUrl}/agents/${agentId}/tools/${toolName}`,
			});
		} else if (operation === 'update') {
			const agentId = this.getParameter<string>('agentId', itemIndex);
			const toolName = this.getParameter<string>('toolName', itemIndex);

			// Define fields for each tool
			const toolFieldsMap: Record<
				string,
				Array<{ param: string; bodyKey?: string; required?: boolean }>
			> = {
				'make-reservation': [
					{ param: 'is_enabled' },
					{ param: 'send_sms' },
					{ param: 'allow_overlapping_reservations' },
					{ param: 'include_guests' },
					{ param: 'sms_text' },
					{ param: 'reservation_duration_minutes' },
					{ param: 'reservation_hours' },
					{ param: 'default_checkin_time' },
					{ param: 'default_checkout_time' },
				],
				'transfer-to-operator': [
					{ param: 'is_enabled' },
					{ param: 'available_hours' },
					{ param: 'enabled_departments' },
				],
				'transfer-to-phone': [
					{ param: 'is_enabled' },
					{ param: 'phone_destinations' },
					{ param: 'transfer_message' },
				],
			};

			const fields = toolFieldsMap[toolName] || [{ param: 'is_enabled' }];
			const body = this.buildBody(fields, itemIndex);

			// Transform UI structures to API expected format
			if (toolName === 'make-reservation') {
				const scheduleUi = this.getParameter<IDataObject>('reservation_hours_ui', itemIndex, {});
				if (scheduleUi.scheduleValues) {
					body.reservation_hours = this.transformSchedule(scheduleUi.scheduleValues as any[]);
				}
			} else if (toolName === 'transfer-to-operator') {
				const scheduleUi = this.getParameter<IDataObject>('available_hours_ui', itemIndex, {});
				if (scheduleUi.scheduleValues) {
					body.available_hours = this.transformSchedule(scheduleUi.scheduleValues as any[]);
				}
			} else if (toolName === 'transfer-to-phone') {
				const destinationsUi = this.getParameter<IDataObject>(
					'phone_destinations_ui',
					itemIndex,
					{},
				);
				if (destinationsUi.destinationValues) {
					body.phone_destinations = this.transformDestinations(
						destinationsUi.destinationValues as any[],
					);
				}
			}

			return await this.httpRequest({
				method: 'PATCH',
				url: `${this.baseUrl}/agents/${agentId}/tools/${toolName}`,
				body,
			});
		}

		throw new Error(`Unknown operation: ${operation}`);
	}

	/**
	 * Transform n8n schedule collection to API dictionary format
	 * From: [{ day: 'monday', ranges: '09:00-12:00, 14:00-18:00' }]
	 * To: { "monday": ["09:00-12:00", "14:00-18:00"] }
	 */
	private transformSchedule(scheduleItems: any[]): Record<string, string[]> {
		const result: Record<string, string[]> = {};
		for (const item of scheduleItems) {
			if (item.day) {
				const day = item.day as string;
				const mode = (item.mode as string) || 'hours';

				if (mode === 'open') {
					result[day] = ['00:00 - 23:59'];
				} else if (mode === 'closed') {
					result[day] = [];
				} else if (mode === 'hours' && item.ranges) {
					const ranges = (item.ranges as string)
						.split(',')
						.map((r) => r.trim())
						.filter((r) => r.length > 0);
					result[day] = ranges;
				}
			}
		}
		return result;
	}

	/**
	 * Transform n8n destinations collection to API list format
	 */
	private transformDestinations(destinationItems: any[]): any[] {
		return destinationItems.map((item) => {
			const destination: any = {
				name: item.name,
				phone_number: item.phone_number,
				description: item.description,
			};

			if (item.available_hours_ui && item.available_hours_ui.scheduleValues) {
				destination.available_hours = this.transformSchedule(
					item.available_hours_ui.scheduleValues as any[],
				);
			}

			return destination;
		});
	}
}
