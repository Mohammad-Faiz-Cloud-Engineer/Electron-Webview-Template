# Build Production-Ready Electron Webview Template

## Overview
Production-ready Electron template that developers customize by changing config values. Complete Electron branding removal at every system level.

## Success Criteria

### Complete Branding Removal
Custom application name must appear in:
- Window title bar
- OS taskbar/dock
- Task Manager (process name and icon)
- Activity Monitor
- System monitors (htop, gnome-system-monitor)
- Application menu (macOS)
- Tray icon
- Installer dialogs
- Desktop shortcuts
- Start menu entries
- Application folder names

### Easy Customization
Developers modify:
- One config file for app metadata
- Icon files in designated folder
- Environment variables for code signing

## Directory Structure
```
electron-webview-template/
├── config/
│   └── app.config.js          # SINGLE SOURCE OF TRUTH for app metadata
├── build/
│   ├── icons/
│   │   ├── icon.icns         # macOS (512x512+)
│   │   ├── icon.ico          # Windows (256x256+)
│   │   └── png/              # Linux icons (16, 32, 64, 128, 256, 512)
│   └── installers/           # Generated installers
├── src/
│   ├── main/
│   │   ├── main.js           # Main process
│   │   ├── menu.js           # Application menu
│   │   └── tray.js           # System tray (optional)
│   ├── preload/
│   │   └── preload.js        # Preload script (security bridge)
│   └── renderer/
│       ├── index.html        # Main UI
│       ├── styles.css        # Styling
│       └── renderer.js       # Renderer process
├── package.json              # Dependencies and build config
├── electron-builder.yml      # Detailed build configuration
├── .env.example             # Code signing template
├── README.md                # Setup and customization guide
└── CUSTOMIZATION.md         # Step-by-step customization guide
```

### Configuration System (config/app.config.js)
```javascript
module.exports = {
  // Application Identity
  name: 'MyApp',                    // Short name (no spaces)
  productName: 'My Application',    // Full display name
  description: 'My amazing desktop application',
  version: '1.0.0',
  
  // Platform Identifiers
  appId: 'com.mycompany.myapp',    // Reverse domain (macOS CFBundleIdentifier, Windows App ID)
  executableName: 'myapp',          // Process name in Task Manager
  
  // Company Information
  author: {
    name: 'My Company',
    email: 'support@mycompany.com',
    url: 'https://mycompany.com'
  },
  
  // Copyright
  copyright: `Copyright © ${new Date().getFullYear()} My Company`,
  
  // Default Window Configuration
  window: {
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    }
  },
  
  // URLs (for webview apps)
  urls: {
    main: 'https://example.com',
    fallback: 'file://' + __dirname + '/../renderer/index.html'
  }
};
```

### Package.json Configuration
Based on search results, configure complete metadata:

```json
{
  "name": "${config.name}",
  "productName": "${config.productName}",
  "version": "${config.version}",
  "description": "${config.description}",
  "author": "${config.author.name} <${config.author.email}>",
  "license": "MIT",
  "main": "src/main/main.js",
  "scripts": {
    "start": "electron .",
    "dev": "cross-env NODE_ENV=development electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder -mwl"
  },
  "build": {
    "appId": "${config.appId}",
    "productName": "${config.productName}",
    "executableName": "${config.executableName}",
    "artifactName": "${productName}-${version}-${os}-${arch}.${ext}",
    "directories": {
      "buildResources": "build",
      "output": "build/installers"
    },
    "files": [
      "src/**/*",
      "config/**/*",
      "package.json"
    ],
    "mac": {
      "category": "public.app-category.productivity",
      "icon": "build/icons/icon.icns",
      "target": ["dmg", "zip"],
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    },
    "win": {
      "icon": "build/icons/icon.ico",
      "target": ["nsis", "portable"],
      "certificateSubjectName": "${env.WIN_CERT_SUBJECT_NAME}",
      "signingHashAlgorithms": ["sha256"],
      "rfc3161TimeStampServer": "http://timestamp.digicert.com"
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
      "createStartMenuShortcut": true,
      "shortcutName": "${config.productName}"
    }
  },
  "dependencies": {
    "electron-store": "^8.1.0"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.0",
    "cross-env": "^7.0.3"
  }
}
```

### Main Process (src/main/main.js)
Must implement proper app naming:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const config = require('../../config/app.config');

// CRITICAL: Set app name BEFORE any other operations
app.setName(config.productName);
app.setPath('userData', path.join(app.getPath('appData'), config.name));

// Windows-specific: Set App User Model ID for proper taskbar grouping
if (process.platform === 'win32') {
  app.setAppUserModelId(config.appId);
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    minWidth: config.window.minWidth,
    minHeight: config.window.minHeight,
    title: config.productName,  // Window title
    icon: getIconPath(),         // Application icon
    webPreferences: {
      ...config.window.webPreferences,
      preload: path.join(__dirname, '../preload/preload.js')
    },
    show: false  // Don't show until ready (performance best practice)
  });

  // Load URL or local file
  mainWindow.loadURL(config.urls.main).catch(() => {
    mainWindow.loadFile(config.urls.fallback);
  });

  // Show window when ready (smooth startup)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Set application menu with correct name
  const menu = require('./menu');
  menu.setApplicationMenu(config.productName);
}

function getIconPath() {
  const platform = process.platform;
  if (platform === 'darwin') {
    return path.join(__dirname, '../../build/icons/icon.icns');
  } else if (platform === 'win32') {
    return path.join(__dirname, '../../build/icons/icon.ico');
  } else {
    return path.join(__dirname, '../../build/icons/png/512x512.png');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### Security Best Practices (src/preload/preload.js)
```javascript
const { contextBridge, ipcRenderer } = require('electron');
const config = require('../../config/app.config');

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld('appAPI', {
  getAppName: () => config.productName,
  getVersion: () => config.version,
  // Add other safe methods as needed
});
```

### Performance Optimizations

Based on comprehensive search results, implement:

1. **Startup Optimization**
   - Use `show: false` + `ready-to-show` event
   - Lazy load dependencies
   - Defer non-critical initialization
   - Use V8 code caching

2. **Memory Management**
   - Clean up event listeners
   - Avoid memory leaks
   - Use BrowserView pooling for multiple windows
   - Implement proper garbage collection

3. **Rendering Performance**
   - Enable hardware acceleration
   - Use `requestAnimationFrame` for animations
   - Virtualize long lists
   - Minimize DOM operations
   - Use CSS transforms for smooth animations

4. **Code Splitting**
   - Route-based code splitting
   - Lazy load modules with dynamic imports
   - Bundle optimization with webpack/rollup

5. **V8 Optimization**
   ```bash
   npm install v8-compile-cache --save
   ```
   Then in main.js:
   ```javascript
   require('v8-compile-cache');
   ```

### Icon Generation System

Provide automated icon generation script (scripts/generate-icons.js):

```javascript
// Use electron-icon-builder or similar
// Input: 1024x1024 PNG
// Output: 
//   - icon.icns (macOS)
//   - icon.ico (Windows)
//   - Multiple PNGs for Linux (16, 32, 64, 128, 256, 512)
```

Include instructions:
```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon-source.png --output=./build/icons
```

### Code Signing Configuration

**.env.example**
```bash
# Windows Code Signing (Standard Certificate)
WIN_CSC_LINK=path/to/certificate.p12
WIN_CSC_KEY_PASSWORD=certificate_password

# Windows Code Signing (EV Certificate - Subject Name)
WIN_CERT_SUBJECT_NAME="Your Company Name"

# Windows Azure Trusted Signing (Modern, Recommended)
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_ACCOUNT_NAME=your-trusted-signing-account
AZURE_CERTIFICATE_PROFILE_NAME=your-profile-name

# macOS Code Signing
CSC_LINK=path/to/certificate.p12
CSC_KEY_PASSWORD=certificate_password
APPLE_ID=your-apple-id@email.com
APPLE_ID_PASSWORD=app-specific-password
APPLE_TEAM_ID=your-team-id

# Disable code signing (for testing)
# CSC_IDENTITY_AUTO_DISCOVERY=false
```

### Build Scripts with Code Signing

Update package.json scripts:
```json
{
  "scripts": {
    "build:win:signed": "electron-builder --win --publish never",
    "build:mac:signed": "electron-builder --mac --publish never",
    "build:linux": "electron-builder --linux --publish never",
    "build:unsigned": "CSC_IDENTITY_AUTO_DISCOVERY=false electron-builder"
  }
}
```

### Documentation Files

**README.md** must include:
1. Quick Start (clone → npm install → npm start)
2. What This Template Provides
3. How to Customize (link to CUSTOMIZATION.md)
4. Build Instructions
5. Code Signing Setup
6. Troubleshooting

**CUSTOMIZATION.md** must include:
1. **Step 1: Update App Configuration**
   - Edit config/app.config.js
   - Change all identifiers
   
2. **Step 2: Replace Icons**
   - Generate icons from 1024x1024 PNG
   - Use provided script or manual placement
   
3. **Step 3: Setup Code Signing (Optional)**
   - Copy .env.example to .env
   - Add certificate credentials
   - Platform-specific instructions
   
4. **Step 4: Test Locally**
   - npm start
   - Verify branding in UI and Task Manager
   
5. **Step 5: Build for Production**
   - Build commands for each platform
   - Verify process names in system monitors

### Testing Checklist

Include a TESTING_CHECKLIST.md:
```markdown
# Branding Verification Checklist

## Windows
- [ ] Application name in window title
- [ ] Process name in Task Manager shows custom name (not "Electron")
- [ ] Custom icon in Task Manager
- [ ] Desktop shortcut shows custom name and icon
- [ ] Start menu entry shows custom name and icon
- [ ] Taskbar tooltip shows custom name
- [ ] Installer shows custom name and icon
- [ ] Add/Remove Programs shows custom name

## macOS
- [ ] Application name in menu bar
- [ ] Process name in Activity Monitor shows custom name
- [ ] Custom icon in Dock
- [ ] Custom icon in Activity Monitor
- [ ] About dialog shows custom name
- [ ] .app file named correctly
- [ ] .dmg shows custom name and icon

## Linux
- [ ] Application name in title bar
- [ ] Process name in system monitor shows custom name
- [ ] Custom icon in application menu
- [ ] Desktop entry shows custom name and icon
- [ ] .desktop file configured correctly
```

### Platform-Specific Branding Notes

**Windows**:
- `executableName` in package.json → controls .exe name
- `appId` + `app.setAppUserModelId()` → controls taskbar grouping
- `win.certificateSubjectName` → for Task Manager icon with EV cert
- NSIS `shortcutName` → controls Start Menu display

**macOS**:
- `CFBundleIdentifier` (from appId) → bundle ID
- `CFBundleName` (from productName) → display name
- `app.setName()` in main process → menu bar name
- Must be called BEFORE `app.ready`

**Linux**:
- Desktop entry file must have correct Name field
- Icon theme integration
- Process name from executable

## Performance Targets

Set measurable goals:
- Startup time: < 2 seconds (window visible)
- Memory usage: < 150MB on idle
- Smooth 60fps animations
- CPU usage < 5% on idle

## Security Checklist

- [ ] `contextIsolation: true`
- [ ] `nodeIntegration: false`
- [ ] `enableRemoteModule: false`
- [ ] Preload script uses `contextBridge`
- [ ] No eval() or dangerous functions
- [ ] CSP headers configured
- [ ] HTTPS for remote content

## Deliverables

1. Complete source code with all files mentioned above
2. Working icon generation script
3. Comprehensive README.md
4. Detailed CUSTOMIZATION.md guide
5. TESTING_CHECKLIST.md
6. .env.example with all signing variables
7. GitHub Actions workflow files (optional):
   - Windows build with signing
   - macOS build with signing and notarization
   - Linux build

## Success Validation

The template is successful when:
1. A developer can clone the repo
2. Edit ONLY config/app.config.js
3. Replace icons in build/icons/
4. Run `npm install && npm start`
5. See their custom app name (not Electron) in:
   - Window title
   - Task Manager / Activity Monitor
   - System tray
   - All system locations
6. Run `npm run build:win` (or mac/linux)
7. Get a fully branded installer with no "Electron" visible anywhere

## Additional Notes

- Use electron-builder (most popular, best documented)
- Support latest Electron version (28.x as of writing)
- Include comments explaining WHY each configuration exists
- Provide examples of common customizations
- Include troubleshooting section for each platform
- Reference official Electron security guidelines
- Cite electron-builder documentation for advanced features

## Code Quality Standards

- ESLint configuration included
- Consistent code style
- Comprehensive comments
- Error handling on all async operations
- Logging system for debugging
- Graceful fallbacks for network issues

## License

- Template should be MIT licensed for maximum reusability
- Include LICENSE file
- Clear attribution requirements

---

**FINAL REMINDER**: The template MUST completely eliminate any trace of "Electron" branding from the end user's perspective. This is the primary measure of success.
