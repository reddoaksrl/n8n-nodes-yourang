# n8n-nodes-yourang

This is an n8n community node. It lets you use Yourang.ai in your n8n workflows.

Yourang.ai is a 24/7 AI phone assistant that handles calls, appointments, and customer interactions automatically. It provides intelligent call routing, appointment scheduling, transcription services, and customer data collection.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following operations:

### Call Operations
- **Get Call**: Retrieve details of a specific call by ID
- **Get All Calls**: Retrieve all calls with optional filtering by date range and status
- **Get Call Transcript**: Get the transcript of a specific call

### Appointment Operations
- **Create**: Schedule a new appointment with customer details
- **Update**: Modify an existing appointment
- **Get**: Retrieve details of a specific appointment
- **Get All**: List all appointments
- **Cancel**: Cancel an existing appointment

### Contact Operations
- **Create**: Add a new customer contact
- **Update**: Modify existing contact information
- **Get**: Retrieve details of a specific contact
- **Get All**: List all contacts

### Analytics Operations
- **Get Call Statistics**: Retrieve call metrics and performance data
- **Get Performance Report**: Generate performance reports for specified time periods

## Credentials

To use this node, you need to set up authentication with Yourang.ai:

1. Sign up for a Yourang.ai account at [yourang.ai](https://yourang.ai/)
2. Access your dashboard to generate an API key
3. In n8n, create new credentials for "Yourang API"
4. Enter your API key and base URL (default: https://api.yourang.ai/v1)

The node uses Bearer token authentication for all API requests.

## Compatibility

- **Minimum n8n version**: 0.87.0
- **Tested with**: n8n 1.0.0+

## Usage

### Basic Workflow Examples

1. **Call Monitoring**: Set up automated workflows to process completed calls and sync data to your CRM
2. **Appointment Management**: Automatically create calendar events when new appointments are scheduled
3. **Customer Data Sync**: Keep customer information synchronized between Yourang.ai and other systems
4. **Analytics Reports**: Generate daily/weekly reports on call performance and metrics

### Common Use Cases

- Sync call data to external CRM systems
- Send notifications when important calls are completed
- Automatically schedule follow-up tasks based on call outcomes
- Generate performance dashboards from analytics data

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Yourang.ai website](https://yourang.ai/)
* [Yourang.ai Developer Documentation](https://developers.yourang.ai/)

## License

[MIT](LICENSE.md)
