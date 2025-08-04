# Changelog

All notable changes to My Vault will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-08-04

### Fixed
- **Critical PIN Authentication Bug**: Fixed race condition where 6th digit was not captured during PIN entry
  - Issue: React state update was not completing before auto-submit triggered
  - Solution: Pass the complete PIN directly to submit function instead of relying on state
- **Admin PIN Validation**: Fixed incorrect admin PIN check in biometric service
  - Changed from hardcoded "445566" to correct "999999" as documented
- **Docker Build Caching**: Added cache busting to ensure fresh builds
  - Added ARG CACHEBUST to Dockerfile to force rebuilds when needed
- **Windows Docker Compatibility**: Fixed line ending issues preventing container startup
  - Replaced external shell script with inline Docker entrypoint

### Changed
- Improved PIN input handling logic for better reliability
- Enhanced error messages for biometric setup failures

### Security
- Fixed potential security issue where admin PIN was incorrectly validated

## [1.0.0] - 2025-08-04

### Added
- Initial release of My Vault
- Secure PIN authentication (default: 445566)
- Biometric authentication support (fingerprint/face)
- Admin PIN for biometric setup (999999)
- Manage Applications, API Keys, and Bookmarks
- Import/Export functionality (JSON, CSV, Markdown)
- Progressive Web App (PWA) support
- Docker containerization
- Beautiful glass morphism UI with pink glow theme
- All data stored locally with encryption