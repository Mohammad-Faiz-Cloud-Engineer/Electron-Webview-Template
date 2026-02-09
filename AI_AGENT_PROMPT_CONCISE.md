# Build Electron Webview Template

## Goal
Production-ready Electron template for wrapping web apps. Developers customize by editing one config file and replacing icons. Complete branding removal - zero Electron references anywhere.

## Requirements
Custom app name must appear in:
- Window titles
- Task Manager / Activity Monitor (process name)
- System tray
- Desktop shortcuts
- Start menu / Application launcher
- Installers
- All system metadata

## Project Structure
```
electron-webview-template/
├── config/
│   └── app.config.js          # SINGLE source of truth for all metadata
├── build/
│   └── icons/
│       ├── icon.icns         # macOS
│       ├── icon.ico          # Windows  
│       └── png/              # Linux (16,32,64,128,256,512)
├── src/
│   ├── main/
│   │   ├── main.js           # Main process with proper app.setName()
│   │   ├── menu.js           # App menu with custom name
│   │   └── tray.js           # Optional system tray
│   ├── preload/
│   │   └── preload.js        # Security bridge
│   └── renderer/
│       ├── index.html        # UI
│       ├── styles.css
│       └── renderer.js
├── scripts/
│   └── generate-icons.js     # Auto-generate icons from PNG
├── package.json              # With complete electron-builder config
├── electron-builder.yml      # Detailed build settings
├── .env.example             # Code signing template
├── README.md                # User-facing guide
├── CUSTOMIZATION.md         # Step-by-step customization
└── LICENSE
```

## Central Configuration (config/app.config.js)
```javascript
module.exports = {
  name: 'myapp',                    // File/folder name (no spaces)
  productName: 'My Application',    // Display name  
  description: 'Desktop app',
  version: '1.0.0',
  appId: 'com.company.app',        // Unique ID (reverse domain)
  executableName: 'myapp',          // Task Manager process name
  
  author: {
    name: 'Company Name',
    email: 'support@company.com',
    url: 'https://company.com'
  },
  
  copyright: 'Copyright © 2024 Company',
  
  window: {
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600
  },
  
  urls: {
    main: 'https://example.com',    // Webview URL
    fallback: 'file://...'          // Offline fallback
  }
};
```

## Main Process (src/main/main.js)

Critical branding code:
```javascript
const { app, BrowserWindow } = require('electron');
const config = require('../../config/app.config');

// MUST set name BEFORE app.whenReady()
app.setName(config.productName);
app.setPath('userData', path.join(app.getPath('appData'), config.name));

// Windows: Set App User Model ID for proper Task Manager naming
if (process.platform === 'win32') {
  app.setAppUserModelId(config.appId);
}

function createWindow() {
  const win = new BrowserWindow({
    title: config.productName,  // Window title
    icon: getIconPath(),        // Platform-specific icon
    show: false,                // Performance: show when ready
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });
  
  win.loadURL(config.urls.main);
  win.once('ready-to-show', () => win.show());
}

function getIconPath() {
  if (process.platform === 'darwin') return './build/icons/icon.icns';
  if (process.platform === 'win32') return './build/icons/icon.ico';
  return './build/icons/png/512x512.png';
}
```

## Package.json Build Config

Key sections for branding:
```json
{
  "name": "${config.name}",
  "productName": "${config.productName}",
  "version": "${config.version}",
  
  "build": {
    "appId": "${config.appId}",
    "productName": "${config.productName}",
    "executableName": "${config.executableName}",
    
    "mac": {
      "category": "public.app-category.productivity",
      "icon": "build/icons/icon.icns",
      "target": ["dmg", "zip"],
      "hardenedRuntime": true
    },
    
    "win": {
      "icon": "build/icons/icon.ico",
      "target": ["nsis", "portable"],
      "certificateSubjectName": "${env.WIN_CERT_SUBJECT_NAME}",
      "signingHashAlgorithms": ["sha256"]
    },
    
    "linux": {
      "icon": "build/icons/png",
      "category": "Utility",
      "target": ["AppImage", "deb", "rpm"]
    },
    
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "shortcutName": "${config.productName}"  // Start menu name
    }
  }
}
```

## Performance Optimizations

Startup:
- V8 code caching: `require('v8-compile-cache')`  
- Lazy load modules
- Use `show: false` + `ready-to-show` event
- Defer non-critical initialization

Memory:
- Clean up event listeners
- No memory leaks in IPC
- Proper garbage collection

Rendering:
- Hardware acceleration enabled
- requestAnimationFrame for animations
- Virtualize long lists (if applicable)

## Security (Mandatory)

```javascript
// In BrowserWindow webPreferences:
{
  contextIsolation: true,        // Required
  nodeIntegration: false,         // Required
  enableRemoteModule: false,      // Required
  sandbox: true                   // Recommended
}
```

Preload script with contextBridge:
```javascript
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('api', {
  // Only expose safe methods
});
```

## Code Signing Support

.env.example:
```bash
# Windows - Standard Cert
WIN_CSC_LINK=path/to/cert.p12
WIN_CSC_KEY_PASSWORD=password

# Windows - EV Cert
WIN_CERT_SUBJECT_NAME="Company Name"

# Windows - Azure Trusted Signing (2025+)
AZURE_TENANT_ID=xxx
AZURE_CLIENT_ID=xxx
AZURE_CLIENT_SECRET=xxx

# macOS
CSC_LINK=path/to/cert.p12
CSC_KEY_PASSWORD=password
APPLE_ID=email@example.com
APPLE_ID_PASSWORD=app-specific-password
APPLE_TEAM_ID=TEAM_ID

# Disable signing (testing)
# CSC_IDENTITY_AUTO_DISCOVERY=false
```

## Scripts (package.json)

```json
{
  "scripts": {
    "start": "electron .",
    "dev": "cross-env NODE_ENV=development electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder -mwl",
    "build:unsigned": "CSC_IDENTITY_AUTO_DISCOVERY=false electron-builder"
  }
}
```

## Icon Generation Script

```javascript
// scripts/generate-icons.js
const icongen = require('icon-gen');

// Generate from 1024x1024 PNG
icongen('./icon-source.png', './build/icons', {
  icns: { sizes: [16,32,64,128,256,512,1024] },
  ico: { sizes: [16,32,48,64,128,256] },
  png: [16,32,64,128,256,512,1024]
});
```

## Documentation Files

README.md:
- Quick start (clone, install, run)
- Template features
- Customization guide link
- Build instructions
- Testing checklist

CUSTOMIZATION.md:
1. Edit config/app.config.js
2. Replace icons (automated script provided)
3. Setup code signing (optional)
4. Test: `npm start`
5. Verify branding in Task Manager
6. Build: `npm run build`
7. Test installed app

TESTING_CHECKLIST.md:
- Windows: Task Manager, shortcuts, installer
- macOS: Activity Monitor, Dock, menu bar
- Linux: system monitor, app launcher

## Platform-Specific Branding

Windows:
- `executableName` → .exe name
- `appId` + `setAppUserModelId()` → Task Manager grouping
- `nsis.shortcutName` → Start Menu display
- Icon must be .ico (256x256+)

macOS:
- `appId` → CFBundleIdentifier
- `productName` → CFBundleName
- `app.setName()` BEFORE app.ready → menu bar name
- Icon must be .icns (512x512+)

Linux:
- Desktop entry Name field
- Icon from PNG folder
- Process name from executable

## Success Criteria

Developer workflow:
1. Clone repo
2. Edit `config/app.config.js`
3. Replace icons in `build/icons/`
4. Run `npm install && npm start`
5. See custom app name (not "Electron") in window title, Task Manager, Activity Monitor, system tray
6. Build with `npm run build`
7. Install and verify no "Electron" anywhere

## Implementation Notes

1. Use electron-builder (most popular, well-documented)
2. Support Electron 28.x+ (latest stable)
3. Follow official Electron security guidelines
4. Implement performance best practices (V8 caching, lazy loading, memory management)
5. Include comments explaining config choices
6. Provide troubleshooting for common issues
7. MIT License

## Key Technical Details

Branding:
- `productName` in package.json preferred over `name`
- Call `app.setName()` early in main process
- Windows needs `setAppUserModelId()` for Task Manager
- macOS menu uses app name from `setName()` call

Icons:
- Windows: .ico with multiple sizes (16-256)
- macOS: .icns (supports .icon on macOS 15+)
- Linux: PNG folder with multiple sizes
- electron-icon-builder auto-generates all formats

Performance:
- V8 snapshots for faster startup
- Code splitting with webpack
- requestIdleCallback for non-critical work
- Virtual scrolling for large lists

Code Signing:
- Windows: Standard, EV, or Azure Trusted Signing
- macOS: Developer ID + notarization required
- electron-builder handles signing automatically if env vars set

## Deliverables

- Complete working template
- All files in proper structure
- README with quick start
- Customization guide
- Testing checklist
- Icon generation script
- .env.example with signing options
- Comments explaining configurations
- MIT License

## Validation

- Clone → Edit config → Run → Custom name visible
- Task Manager shows custom name (Windows)
- Activity Monitor shows custom name (macOS)
- Build creates properly named installers
- Installed app has no "Electron" visible anywhere
- All platforms tested (Win/Mac/Linux)
