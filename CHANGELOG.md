# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2026-04-02

### Changed
- Wrap HTTP errors in `NodeApiError` for proper status code and response display in n8n UI
- Use `NodeConnectionTypes.Main` instead of string literals for inputs/outputs
- Remove unused `requestDefaults` block (dead code in programmatic-style node)
- Remove `overrides` section from package.json for n8n Cloud compatibility
- Add icon to credential file for consistent branding

### Added
- GitHub Actions publish workflow with npm provenance
- Updated README with full operations reference and improved documentation

## [0.6.0] - 2025-12-10

### Added
- **Workflow Resource:** Execute, get details, list workflows, and track executions

### Fixed
- Fix execute operation

## [0.5.1] - 2025-11-28

### Fixed
- Move n8n from dependencies to devDependencies

## [0.5.0] - 2025-01-14

### Added
- **Agent Resource:** Get and list AI agents
- **Agent Tool Resource:** Get, list, and update agent tool configurations
- Open all day / closed all day scheduling modes for agent tools

## [0.4.0] - 2024-12-05

### Added
- Custom context support for action execution
- Advanced filters for list operations (pagination, sort, status)

### Changed
- Improved error handling across all resources
- Enhanced project structure

## [0.3.0] - 2024-11-15

### Added
- Advanced filtering options for action and contact list operations
- Offset, sort, and status filters

## [0.2.0] - 2024-09-24

### Added
- **Event Resource:** Full CRUD with date range filtering and status management
- **Call History:** Get Transcript operation
- **Contact:** Phone number-based get, update, and delete operations

### Changed
- Updated API support

## [0.1.1] - 2024-09-22

### Changed
- Updated package metadata and README documentation

## [0.1.0] - 2024-09-21

### Added
- Initial release
- Call History resource (get, get many)
- Contact resource (create, get, get many, update, delete)
- Action resource (execute single, execute batch, history)
- Bearer token authentication
