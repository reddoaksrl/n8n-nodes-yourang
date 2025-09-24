# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-09-24

### Added
- **New Call History Features:**
  - Added "Get Transcript" operation to retrieve call transcripts separately
  - Enhanced call history operations with v1.4.0 API support

- **New Events Resource:** Complete event management functionality
  - Get event details by ID
  - Get events grouped by date with optional date range filtering
  - Get events for a specific date with pagination
  - Update event details (client info, dates, status, etc.)
  - Update event status (approve/reject)
  - Delete events

- **Enhanced Contact Operations:**
  - Added phone number-based operations:
    - Get contact by phone number
    - Update contact by phone number
    - Delete contact by phone number
  - Improved existing contact operations

### Changed
- Updated package description to include event management capabilities
- Added "events" and "calendar" keywords to package.json
- Enhanced node description to reflect new capabilities
- Improved API error handling and response structure

### Fixed
- Fixed linting issues with option ordering
- Improved code organization and consistency

## [0.1.1] - 2024-09-22

### Changed
- Updated package version and metadata
- Enhanced README documentation
- Fixed repository URL format

## [0.1.0] - 2024-09-21

### Added
- Initial release with Call History, Contact, and Action resources
- Support for Yourang.ai API v1 basic operations
- Authentication with API key
- Basic CRUD operations for contacts
- Action execution (single and batch)
- Call history retrieval with filtering