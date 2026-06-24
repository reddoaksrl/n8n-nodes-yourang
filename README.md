# n8n-nodes-yourang

[![npm version](https://img.shields.io/npm/v/n8n-nodes-yourang.svg)](https://www.npmjs.com/package/n8n-nodes-yourang)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

An [n8n](https://n8n.io/) community node to integrate [yourang.ai](https://yourang.ai) into your workflows. Automate call handling, contact management, appointment scheduling, and AI agent configuration directly from n8n.

[yourang.ai](https://yourang.ai) is a 24/7 AI phone assistant that handles inbound and outbound calls, schedules appointments, collects customer data, and manages interactions automatically.

## Installation

Follow the [n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. Open **Settings > Community Nodes** in your n8n instance
2. Enter `n8n-nodes-yourang`
3. Click **Install**

## Credentials

1. Create an account at [app.yourang.ai](https://app.yourang.ai)
2. Generate an API key from your dashboard
3. In n8n, add new **Yourang API** credentials with your API key

The default API base URL is `https://api.yourang.ai/v1`. See the full [API documentation](https://developers.yourang.ai) for details.

## Operations

### Call History

| Operation | Description |
|-----------|-------------|
| Get Call | Retrieve details of a specific call |
| Get Many | List calls with filters (type, status, direction, phone, contact) |
| Get Transcript | Get the transcript for a specific call |
| Get Summary | Get AI-generated summary for a call |

### Contact

| Operation | Description |
|-----------|-------------|
| Create | Add a new contact (name, phone, email, address) |
| Get | Retrieve a contact by ID |
| Get by Phone | Retrieve a contact by phone number |
| Get Many | List contacts with search and sort filters |
| Update | Update a contact by ID |
| Update by Phone | Update a contact by phone number |
| Delete | Remove a contact by ID |
| Delete by Phone | Remove a contact by phone number |

### Event

| Operation | Description |
|-----------|-------------|
| Get | Get details of a specific event |
| Get by Date | Get events for a specific date |
| Get Many | Get events grouped by date range |
| Update | Update an existing event |
| Update Status | Approve or reject an event |
| Delete | Delete an event |

### Agent

| Operation | Description |
|-----------|-------------|
| Get | Get details of a specific AI agent |
| Get Many | List agents for your organization |

### Agent Tool

| Operation | Description |
|-----------|-------------|
| Get | Get configuration for a specific agent tool |
| Get Many | List tools available for a specific agent |
| Update | Update configuration for an agent tool |

### Workflow

| Operation | Description |
|-----------|-------------|
| Get | Get workflow details |
| Get Many | List workflows |
| Execute | Execute a workflow |
| Get Executions | List workflow executions |
| Get Execution Details | Get details of a specific execution |

## Trigger

The **Yourang Trigger** node starts a workflow when yourang emits an event, replacing the
manual `Webhook` + `Code` parsing pattern. Select one or more events and the node receives a
typed, signed payload.

| Event | Fires when |
|-------|------------|
| Call Ended | A call finished and its record was persisted |
| Call Summary Ready | The async summary of a call is ready |
| Appointment Booked | An appointment/event was created (CONFIRMED) |
| Appointment Updated | An appointment was rescheduled/approved/rejected |
| Appointment Cancelled | An appointment was cancelled |
| Contact Created | A new contact (lead) was created |

On activation the node registers a subscription on yourang
(`POST /app/v1/webhooks/subscriptions`) with the workflow's webhook URL and a generated
secret; on deactivation it removes it. Incoming requests are verified against the
`X-Yourang-Signature` (HMAC-SHA256) header and deduplicated by `event_id`.

**Payload envelope**

```json
{
  "event": "call.ended",
  "event_id": "uuid",
  "occurred_at": "ISO-8601",
  "organization_id": "uuid",
  "data": { }
}
```

> Requires the platform outbound-webhook API. Until it ships, turn off **Auto-Register
> Subscription** in the node options to test by POSTing the envelope to the webhook URL
> directly.

## Example Use Cases

- **CRM Sync** -- Push call history and contact data to your CRM after each call
- **Appointment Automation** -- Create, update, and manage events from external calendars
- **Call Analytics** -- Collect transcripts and AI summaries for reporting dashboards
- **Agent Configuration** -- Manage AI agent tools and workflows programmatically

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Node.js**: >= 20.15

## Resources

- [yourang.ai](https://yourang.ai) -- product website
- [Yourang Dashboard](https://app.yourang.ai) -- Manage your account and API keys
- [API Documentation](https://developers.yourang.ai) -- Full API reference
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/) -- n8n docs

## License

[MIT](LICENSE.md)
