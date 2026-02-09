# Changelog

## [1.2.0] - Feb 10, 2026

Cleaned up some edge cases and made the config more user-friendly.

### What's New
- Better validation everywhere - URLs, IPC channels, notifications all check for empty strings now
- Added window destruction checks so we don't try to operate on closed windows
- Log rotation is smarter - only processes actual log files instead of everything in the folder
- Config file has way better comments now, should be easier to customize

### Bug Fixes
- Fixed a potential crash when creating new windows from the menu
- IPC methods now properly validate input before doing anything
- Notifications won't accept garbage input anymore
- Status updates actually check if the text is valid

### Improvements
- Removed the redundant `executableName` from package.json - turns out `appId` already handles that
- Dropped the platform-specific clean scripts since they weren't portable anyway
- Build excludes source maps and markdown files now, smaller package size
- Error logs include stack traces for easier debugging

## [1.1.0] - Feb 10, 2026

Big refactoring pass to make everything more robust.

### Added
- JSDoc comments on everything
- Proper constants instead of magic numbers scattered around
- Input validation on all public functions
- Better logging with structured metadata
- Memory leak prevention in event handlers
- Icon generation instructions in the build folder

### Improvements
- Switched from switch statements to object lookups (cleaner and faster)
- URL validation is way more thorough now
- Notification system validates types properly
- Tray creation has better error handling
- Log rotation handles errors per-file instead of bailing on the first issue
- IPC has proper try-catch blocks everywhere

### Bug Fixes
- Logger won't crash on circular JSON anymore
- External links handle errors gracefully
- Notification system cleans up properly
- Tray creation checks for null
- Status updates in renderer are more consistent

### Cleanup
- Deleted empty .vscode/settings.json
- Removed placeholder files from icons folder
- Cleaned up commented-out V8 cache code
- Got rid of redundant switch statements

## [1.0.0] - Feb 10, 2024

First proper release! Took the template from "works on my machine" to production-ready.

### Major Features
- Real logging system with automatic file rotation (keeps last 7 days)
- Error handling everywhere - no more silent failures
- Proper IPC validation for security
- Replaced all alert() calls with a nice notification system
- Full accessibility support (ARIA labels, semantic HTML, keyboard nav)
- ESLint setup for code quality
- Environment variable support via .env

### Security Fixes
- **CRITICAL:** Fixed undefined app variable in tray.js that would crash on startup
- **CRITICAL:** Fixed security hole in "New Window" menu item
- **CRITICAL:** Fixed fallback URL not working in packaged apps
- Navigation security prevents unauthorized redirects now
- IPC data gets validated before use
- Window creation is locked down

### Improvements
- Notification system instead of browser alerts
- Better error messages that actually help
- Stricter URL validation
- CSS animations respect prefers-reduced-motion
- Code is way more organized
- Menu uses proper window factory pattern

### Cleanup
- Removed electron-builder.yml (everything's in package.json now)
- Deleted unused fallback URL getter
- Removed placeholder showMessage() function

## [0.1.0] - Initial Release

Basic Electron webview template. Wraps a website in a desktop app with:
- Configurable branding
- Cross-platform builds (Windows, Mac, Linux)
- System tray support
- Fallback UI when offline
