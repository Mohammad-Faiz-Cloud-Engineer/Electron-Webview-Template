# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-10

### Added
- Comprehensive JSDoc comments for all functions
- Constants for magic numbers throughout codebase
- Input validation for all public functions
- Structured logging with additional metadata
- Error recovery mechanisms in critical paths
- Memory leak prevention in event handlers
- README.md in build/icons directory with icon generation instructions

### Improved
- Refactored switch statements to object lookups for better performance
- Enhanced error handling with detailed error information
- Better URL validation with dedicated helper function
- Improved notification system with type validation
- Enhanced tray creation with null checks and error handling
- More robust log rotation with individual file error handling
- Better IPC error handling with try-catch blocks
- Improved window creation with configuration object
- Enhanced security logging with structured data

### Fixed
- Fixed potential JSON.stringify errors in logger
- Fixed missing error handling in external link opening
- Fixed potential memory leaks in notification system
- Fixed missing null checks in tray creation
- Fixed inconsistent error logging format
- Fixed missing validation in renderer status updates

### Removed
- Removed empty .vscode/settings.json file
- Removed placeholder TXT file from icons directory
- Removed commented-out V8 cache code
- Removed redundant switch statements

### Security
- Enhanced IPC channel validation with constants
- Improved error message sanitization
- Better input validation across all modules
- Enhanced navigation security with detailed logging

## [1.0.0] - 2024-02-10

### Added
- Production-grade logging system with file rotation
- Comprehensive error handling throughout the codebase
- Input validation for IPC communication
- Proper notification system replacing alert()
- Accessibility improvements (ARIA labels, semantic HTML)
- ESLint configuration for code quality
- .gitignore for proper version control
- .env.example for environment configuration
- Reduced motion support for animations
- Proper cleanup on app quit
- Enhanced icon generation script with multiple methods

### Fixed
- Critical: Fixed undefined `app` variable in tray.js
- Critical: Fixed "New Window" menu item security vulnerabilities
- Critical: Fixed fallback URL path resolution for packaged apps
- Fixed missing error handling in renderer process
- Fixed navigation security to prevent unauthorized redirects
- Fixed minimize to tray functionality
- Fixed tray cleanup on app quit
- Fixed IPC data validation

### Changed
- Replaced alert() with proper notification system
- Improved error messages with better user feedback
- Enhanced security with stricter URL validation
- Optimized CSS animations with prefers-reduced-motion
- Improved code organization and documentation
- Updated menu.js to use proper window factory pattern

### Removed
- Redundant electron-builder.yml file (config in package.json)
- Unused fallback URL getter in config
- Placeholder showMessage() function

### Security
- Added data serialization validation in preload script
- Enhanced navigation security with try-catch blocks
- Improved window creation security in menu
- Added HTTPS protocol validation
- Prevented unauthorized window creation

## [0.1.0] - Initial Release

### Added
- Initial Electron webview template
- Basic branding configuration
- Cross-platform build support
- System tray functionality
- Fallback UI for offline scenarios
