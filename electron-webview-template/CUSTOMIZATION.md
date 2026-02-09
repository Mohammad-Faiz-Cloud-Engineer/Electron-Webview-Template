# Customization Guide

How to configure and brand your Electron application.

## Contents

- [Quick Setup](#quick-setup)
- [Configuration Reference](#configuration-reference)
- [Icon Setup](#icon-setup)
- [Code Signing](#code-signing)
- [Platform Notes](#platform-notes)
- [Advanced Options](#advanced-options)

## Quick Setup

### Edit config/app.config.js

```javascript
module.exports = {
  name: 'myapp',
  productName: 'My Application',
  appId: 'com.yourcompany.yourapp',
  
  urls: {
    main: 'https://your-webapp.com'
  },
  
  author: {
    name: 'Your Company',
    email: 'support@yourcompany.com'
  }
};
```

### Update package.json

Match these fields to your config:

```json
{
  "name": "myapp",
  "productName": "My Application",
  "build": {
    "appId": "com.yourcompany.yourapp",
    "executableName": "myapp"
  }
}
```

### Replace Icons

| File | Platform | Min Size |
|------|----------|----------|
| `icon.icns` | macOS | 512x512 |
| `icon.ico` | Windows | 256x256 |
| `png/*.png` | Linux | 16-512 |

### Test

```bash
npm start
```

Check that your app name appears in window titles, Task Manager, and Activity Monitor.

## Configuration Reference

### Complete config/app.config.js

```javascript
module.exports = {
  // Application identity
  name: 'myapp',
  productName: 'My Application',
  description: 'App description',
  version: '1.0.0',
  
  // Platform identifiers
  appId: 'com.company.app',
  executableName: 'myapp',
  
  // Company info
  author: {
    name: 'Company Name',
    email: 'support@company.com',
    url: 'https://company.com'
  },
  copyright: 'Copyright © 2024 Company',
  
  // Window settings
  window: {
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600
  },
  
  // URLs
  urls: {
    main: 'https://your-webapp.com'
  },
  
  // System tray (optional)
  tray: {
    enabled: false,
    tooltip: 'My Application',
    minimizeToTray: false
  },
  
  // Categories
  macCategory: 'public.app-category.productivity',
  linuxCategory: 'Utility'
};
```

## Icon Setup

### Automatic Generation

Create a 1024x1024 PNG and run:

```bash
npx electron-icon-builder --input=icon-source.png --output=build/icons
```

### Manual Creation

Place these in `build/icons/`:

| Platform | File | Sizes |
|----------|------|-------|
| Windows | `icon.ico` | 16-256 |
| macOS | `icon.icns` | 16-1024 |
| Linux | `png/` folder | 16-512 |

Linux PNG structure:
```
build/icons/png/
├── 16x16.png
├── 32x32.png
├── 64x64.png
├── 128x128.png
├── 256x256.png
└── 512x512.png
```

### Icon Design Tips

Keep it simple - icons must work at 16x16. Use bold colors with good contrast. Test on light and dark backgrounds.

## Code Signing

Signing removes security warnings and shows your company name to users. Required for macOS Gatekeeper and recommended for Windows SmartScreen.

### Windows Signing

Standard certificate:
```bash
WIN_CSC_LINK=path/to/certificate.p12
WIN_CSC_KEY_PASSWORD=your_password
```

EV certificate (hardware token):
```bash
WIN_CERT_SUBJECT_NAME="Your Company Name, LLC"
```

Azure Trusted Signing:
```bash
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_ACCOUNT_NAME=your-account
AZURE_CERTIFICATE_PROFILE_NAME=your-profile
```

### macOS Signing

Requires Apple Developer account ($99/year). Generate app-specific password at appleid.apple.com.

```bash
CSC_LINK=path/to/certificate.p12
CSC_KEY_PASSWORD=your_password
APPLE_ID=your@email.com
APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
APPLE_TEAM_ID=TEAM_ID
```

### Testing Without Signing

```bash
npm run build:unsigned
```

## Platform Notes

### Windows

Process name set by `executableName` in package.json. Without code signing, users see SmartScreen warnings. EV certificates provide immediate trust.

### macOS

Menu bar name set by `app.setName()` before `app.whenReady()`. Notarization required for macOS 10.15+ (takes 5-15 minutes per build).

### Linux

Process name based on executable. AppImage auto-creates .desktop entry with correct name.

## Advanced Options

### Window Customization

```javascript
// Frameless window
mainWindow = new BrowserWindow({
  frame: false,
  titleBarStyle: 'hidden'
});

// Always on top
mainWindow.setAlwaysOnTop(true);
```

### System Tray

```javascript
// config/app.config.js
tray: {
  enabled: true,
  minimizeToTray: true
}
```

### Auto-Update

```bash
npm install electron-updater
```

```javascript
// main.js
const { autoUpdater } = require('electron-updater');
app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## Troubleshooting

**"Electron" in Task Manager**: Verify `executableName` in package.json, rebuild app, uninstall old version first.

**macOS menu shows "Electron"**: Ensure `app.setName()` called before `app.whenReady()`. Delete `~/Library/Application Support/Electron`.

**Icons not showing**: Check file formats (.icns for Mac, .ico for Windows) and sizes. Rebuild app.

**Build fails**: Clear cache with `rm -rf node_modules dist && npm install && npm run build`
