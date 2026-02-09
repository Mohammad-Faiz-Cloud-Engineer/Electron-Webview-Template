# Customization Guide 🎨

This guide walks you through customizing the Electron Webview Template for your specific application.

## Table of Contents
- [Before You Start](#before-you-start)
- [Step 1: Application Identity](#step-1-application-identity)
- [Step 2: Replace Icons](#step-2-replace-icons)
- [Step 3: Configure Build Settings](#step-3-configure-build-settings)
- [Step 4: Setup Code Signing](#step-4-setup-code-signing)
- [Step 5: Customize UI](#step-5-customize-ui)
- [Step 6: Test Your Branding](#step-6-test-your-branding)
- [Step 7: Build and Distribute](#step-7-build-and-distribute)
- [Advanced Customizations](#advanced-customizations)

---

## Before You Start

### What You'll Need
- [ ] A unique application name
- [ ] A company/developer name
- [ ] A 1024x1024 PNG logo (for icon generation)
- [ ] (Optional) Code signing certificate
- [ ] (Optional) Your web application URL (if creating a webview wrapper)

### Time Required
- Basic customization: **15 minutes**
- With code signing: **30-45 minutes**
- Full customization: **1-2 hours**

---

## Step 1: Application Identity

### 1.1 Edit `config/app.config.js`

Open `config/app.config.js` and update these fields:

```javascript
module.exports = {
  // ===== REQUIRED CHANGES =====
  
  // Short identifier (lowercase, no spaces, used for file names)
  // Example: 'myapp', 'taskmanager', 'notesapp'
  name: 'CHANGE_ME',
  
  // Full display name (what users see)
  // Example: 'My Application', 'Task Manager Pro', 'Notes App'
  productName: 'CHANGE_ME',
  
  // Brief description
  description: 'CHANGE_ME',
  
  // Reverse domain notation (unique identifier)
  // Format: com.company.appname
  // Example: 'com.acme.myapp', 'com.yourname.notes'
  appId: 'com.CHANGE_ME.CHANGE_ME',
  
  // Process name in Task Manager/Activity Monitor
  // (usually same as 'name', but can be different)
  executableName: 'CHANGE_ME',
  
  // ===== COMPANY INFO =====
  author: {
    name: 'CHANGE_ME',
    email: 'CHANGE_ME@example.com',
    url: 'https://CHANGE_ME.com'
  },
  
  // ===== COPYRIGHT =====
  copyright: `Copyright © ${new Date().getFullYear()} CHANGE_ME`,
  
  // ===== WEBVIEW URL (if applicable) =====
  urls: {
    main: 'https://YOUR_WEB_APP_URL.com',  // Your web app
    fallback: 'file://' + __dirname + '/../renderer/index.html'  // Offline page
  }
};
```

### 1.2 Example Configuration

Here's a real-world example:

```javascript
module.exports = {
  name: 'taskflow',
  productName: 'TaskFlow Pro',
  description: 'Professional task management for teams',
  version: '1.0.0',
  appId: 'com.taskflow.desktop',
  executableName: 'taskflow',
  
  author: {
    name: 'TaskFlow Inc',
    email: 'support@taskflow.com',
    url: 'https://taskflow.com'
  },
  
  copyright: 'Copyright © 2024 TaskFlow Inc',
  
  urls: {
    main: 'https://app.taskflow.com',
    fallback: 'file://' + __dirname + '/../renderer/index.html'
  }
};
```

### 1.3 Naming Best Practices

#### `name` (Short identifier)
- ✅ Use: `myapp`, `taskflow`, `notesapp`
- ❌ Avoid: `My App`, `Task Flow`, `Notes_App`
- Keep it lowercase, no spaces
- Used for file/folder names

#### `productName` (Display name)
- ✅ Use: `My Application`, `TaskFlow Pro`, `Notes App`
- Can include spaces and capitals
- This is what users see everywhere

#### `appId` (Unique identifier)
- ✅ Format: `com.company.appname`
- ✅ Examples:
  - `com.acme.myapp`
  - `com.taskflow.desktop`
  - `io.github.username.appname`
- Must be unique globally
- Use reverse domain notation

#### `executableName`
- What appears in Task Manager/Activity Monitor
- Usually same as `name`
- Can be different if you want (e.g., `name: 'myapp'`, `executableName: 'MyApp'`)

---

## Step 2: Replace Icons

### 2.1 Prepare Your Source Icon

Create a **1024x1024 pixel PNG** with:
- Transparent background (recommended)
- Simple, recognizable design
- Works at small sizes (16x16)
- Distinct color scheme

💡 **Tip**: Test how your icon looks at 16x16 before proceeding!

### 2.2 Option A: Automatic Icon Generation (Recommended)

```bash
# Install icon generator globally
npm install -g electron-icon-builder

# Generate all platform icons
electron-icon-builder --input=./your-icon-1024.png --output=./build/icons
```

This creates:
- `build/icons/icon.icns` (macOS)
- `build/icons/icon.ico` (Windows)
- `build/icons/png/` folder (Linux - multiple sizes)

### 2.2 Option B: Manual Icon Creation

If you prefer manual control:

#### Windows (.ico)
1. Use online converter: [CloudConvert](https://cloudconvert.com/png-to-ico)
2. Create multi-resolution .ico (16, 32, 48, 64, 128, 256)
3. Save as `build/icons/icon.ico`

#### macOS (.icns)
1. Use online converter: [CloudConvert](https://cloudconvert.com/png-to-icns)
2. Or use macOS tool: `iconutil` (requires multiple PNGs)
3. Save as `build/icons/icon.icns`

#### Linux (PNG set)
Create folder `build/icons/png/` with these sizes:
- 16x16.png
- 32x32.png
- 64x64.png
- 128x128.png
- 256x256.png
- 512x512.png
- 1024x1024.png (optional)

### 2.3 Verify Icon Placement

Your `build/icons/` structure should look like:

```
build/icons/
├── icon.icns          # macOS
├── icon.ico           # Windows
└── png/               # Linux
    ├── 16x16.png
    ├── 32x32.png
    ├── 64x64.png
    ├── 128x128.png
    ├── 256x256.png
    └── 512x512.png
```

---

## Step 3: Configure Build Settings

### 3.1 Review package.json

The `package.json` file automatically reads from `config/app.config.js`. You typically don't need to edit it, but you can customize:

#### Installer Types

**Windows** - Edit `build.win.target`:
```json
"win": {
  "target": [
    "nsis",      // Setup wizard installer (recommended)
    "portable",  // Portable .exe (no installation)
    "msi",       // Windows Installer format
    "zip"        // Compressed archive
  ]
}
```

**macOS** - Edit `build.mac.target`:
```json
"mac": {
  "target": [
    "dmg",       // Disk image (recommended)
    "zip",       // Compressed archive
    "pkg"        // macOS package installer
  ]
}
```

**Linux** - Edit `build.linux.target`:
```json
"linux": {
  "target": [
    "AppImage",  // Universal Linux format (recommended)
    "deb",       // Debian/Ubuntu
    "rpm",       // RedHat/Fedora
    "snap",      // Snap package
    "tar.gz"     // Compressed archive
  ]
}
```

### 3.2 Customize Installer Options (Windows)

Edit NSIS installer settings in `package.json`:

```json
"nsis": {
  "oneClick": false,                    // Allow installation path choice
  "allowToChangeInstallationDirectory": true,
  "allowElevation": true,               // Allow admin privileges
  "createDesktopShortcut": true,
  "createStartMenuShortcut": true,
  "shortcutName": "${productName}",     // Start menu name
  "installerIcon": "build/icons/icon.ico",
  "uninstallerIcon": "build/icons/icon.ico",
  "installerHeader": "build/installer-header.bmp",  // Optional custom header
  "installerSidebar": "build/installer-sidebar.bmp" // Optional custom sidebar
}
```

### 3.3 macOS App Category

Set the appropriate category for macOS App Store:

```json
"mac": {
  "category": "public.app-category.productivity",  // Change based on your app
}
```

Common categories:
- `public.app-category.productivity`
- `public.app-category.business`
- `public.app-category.developer-tools`
- `public.app-category.utilities`
- `public.app-category.social-networking`
- See [full list](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)

---

## Step 4: Setup Code Signing

Code signing is **optional but highly recommended** for production apps.

### 4.1 Why Code Sign?

- ✅ Removes "Unknown Publisher" warnings
- ✅ Builds user trust
- ✅ Required for auto-updates
- ✅ Prevents security warnings
- ✅ Required for macOS Gatekeeper and Windows SmartScreen

### 4.2 Windows Code Signing

#### Option 1: Standard Certificate (Traditional)

1. **Obtain Certificate**
   - Buy from: DigiCert, Sectigo, GlobalSign, etc.
   - Costs: ~$100-300/year
   - Delivered as .p12 or .pfx file

2. **Configure Environment**
   ```bash
   # Copy template
   cp .env.example .env
   
   # Edit .env
   WIN_CSC_LINK=/path/to/certificate.p12
   WIN_CSC_KEY_PASSWORD=your_certificate_password
   ```

3. **Build**
   ```bash
   npm run build:win
   ```

#### Option 2: EV Certificate (Extended Validation)

1. **Obtain EV Certificate**
   - More expensive (~$300-500/year)
   - Comes on USB hardware token
   - Eliminates SmartScreen warnings immediately

2. **Configure Environment**
   ```bash
   # Edit .env
   WIN_CERT_SUBJECT_NAME="Your Company Name, Inc."
   ```
   
   (The exact name from your certificate)

3. **Build** (with USB token plugged in)
   ```bash
   npm run build:win
   ```

#### Option 3: Azure Trusted Signing (Modern, 2025+)

1. **Setup Azure Account**
   - Follow [Azure Trusted Signing quickstart](https://learn.microsoft.com/azure/trusted-signing/)
   - Create App registration and secret
   - Assign "Trusted Signing Certificate Profile Signer" role

2. **Configure Environment**
   ```bash
   # Edit .env
   AZURE_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   AZURE_CLIENT_SECRET=your-secret
   AZURE_ACCOUNT_NAME=your-signing-account
   AZURE_CERTIFICATE_PROFILE_NAME=your-profile
   ```

3. **Build**
   ```bash
   npm run build:win
   ```

### 4.3 macOS Code Signing

1. **Prerequisites**
   - Apple Developer account ($99/year)
   - Xcode installed
   - Developer ID certificate in Keychain

2. **Obtain Certificate**
   - Log into [Apple Developer Portal](https://developer.apple.com/)
   - Certificates → Create "Developer ID Application"
   - Download and import into Keychain Access

3. **Export Certificate**
   ```bash
   # In Keychain Access:
   # 1. Find "Developer ID Application" certificate
   # 2. Right-click → Export
   # 3. Save as .p12 with password
   ```

4. **Configure Environment**
   ```bash
   # Edit .env
   CSC_LINK=/path/to/certificate.p12
   CSC_KEY_PASSWORD=your_password
   
   # For notarization (required for macOS 10.15+)
   APPLE_ID=your-apple-id@email.com
   APPLE_ID_PASSWORD=app-specific-password
   APPLE_TEAM_ID=YOUR_TEAM_ID
   ```

5. **Generate App-Specific Password**
   - Visit [appleid.apple.com](https://appleid.apple.com/)
   - Sign in → Security → App-Specific Passwords
   - Generate new password
   - Use this for `APPLE_ID_PASSWORD`

6. **Build and Notarize**
   ```bash
   npm run build:mac
   ```

### 4.4 Linux Code Signing

Linux doesn't require code signing, but you can optionally:

1. **GPG Sign Packages** (for .deb/.rpm)
   - Create GPG key
   - Configure in `package.json`
   - Sign during build

2. **Most developers skip this for Linux**

### 4.5 Testing Without Code Signing

To build unsigned (for testing):

```bash
# Disable auto-discovery of certificates
npm run build:unsigned

# Or set environment variable
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run build
```

---

## Step 5: Customize UI

### 5.1 Application Menu

Edit `src/main/menu.js` to customize the menu bar:

```javascript
const { Menu } = require('electron');
const config = require('../../config/app.config');

function setApplicationMenu(appName) {
  const template = [
    {
      label: appName,  // Uses your custom app name
      submenu: [
        { label: `About ${appName}`, role: 'about' },
        { type: 'separator' },
        { label: 'Preferences', accelerator: 'CmdOrCtrl+,', click: () => {} },
        { type: 'separator' },
        { label: `Quit ${appName}`, role: 'quit' }
      ]
    },
    // Add more menu items here
  ];
  
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
```

### 5.2 Renderer UI (HTML/CSS/JS)

If you're not using a webview URL, customize:

- `src/renderer/index.html` - UI structure
- `src/renderer/styles.css` - Styling
- `src/renderer/renderer.js` - UI logic

Example customization:

```html
<!-- src/renderer/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to My Application!</h1>
    <p>Your custom content here</p>
  </div>
  <script src="renderer.js"></script>
</body>
</html>
```

### 5.3 System Tray (Optional)

Edit `src/main/tray.js` to add system tray icon:

```javascript
const { Tray, Menu } = require('electron');
const path = require('path');

let tray = null;

function createTray(appName) {
  const iconPath = path.join(__dirname, '../../build/icons/tray-icon.png');
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: `Open ${appName}`, click: () => {} },
    { type: 'separator' },
    { label: `Quit ${appName}`, role: 'quit' }
  ]);
  
  tray.setToolTip(appName);
  tray.setContextMenu(contextMenu);
}
```

Then enable in `src/main/main.js`:

```javascript
const tray = require('./tray');

app.whenReady().then(() => {
  createWindow();
  tray.createTray(config.productName);  // Add this line
});
```

---

## Step 6: Test Your Branding

### 6.1 Development Testing

```bash
npm start
```

**Verify**:
- [ ] Window title shows your app name
- [ ] Custom icon appears in window/dock/taskbar

### 6.2 Build and Test

```bash
# Build for your platform
npm run build
```

**Install the generated app** and verify:

#### Windows Testing
1. Install from `build/installers/*.exe`
2. **Check Task Manager**:
   - Press `Ctrl+Shift+Esc`
   - Find your app
   - Verify: Process name is YOUR app name (not "Electron")
   - Verify: Icon is YOUR icon
3. **Check Desktop/Start Menu**:
   - Shortcut name correct
   - Icon correct

#### macOS Testing
1. Install from `build/installers/*.dmg`
2. **Check Activity Monitor**:
   - Open Activity Monitor
   - Find your app
   - Verify: Process name is YOUR app name
3. **Check Dock**:
   - Icon correct
   - Right-click → "Options" shows your app name

#### Linux Testing
1. Install from `build/installers/*.AppImage` (or .deb/.rpm)
2. **Check System Monitor**:
   - Open system monitor
   - Find your app
   - Verify process name
3. **Check Application Menu**:
   - Icon correct
   - Name correct

### 6.3 Verification Checklist

Use this comprehensive checklist:

```markdown
## Windows
- [ ] App name in window title
- [ ] Process name in Task Manager (NOT "Electron")
- [ ] Custom icon in Task Manager
- [ ] Desktop shortcut name and icon
- [ ] Start Menu entry
- [ ] Installer window branding
- [ ] Add/Remove Programs listing

## macOS
- [ ] App name in menu bar (top-left)
- [ ] Process name in Activity Monitor
- [ ] Custom icon in Dock
- [ ] About dialog shows app name
- [ ] .dmg volume icon and name
- [ ] Finder .app name

## Linux
- [ ] App name in window title
- [ ] Process name in system monitor
- [ ] Application launcher icon and name
- [ ] .desktop file correct
- [ ] Package metadata correct
```

---

## Step 7: Build and Distribute

### 7.1 Production Build

```bash
# Build signed version for distribution
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux

# Or build all at once (on macOS or Linux only)
npm run build:all
```

Installers appear in: `build/installers/`

### 7.2 File Naming

Installers are automatically named:
```
{productName}-{version}-{os}-{arch}.{ext}

Examples:
MyApp-1.0.0-win-x64.exe
MyApp-1.0.0-mac-arm64.dmg
MyApp-1.0.0-linux-x86_64.AppImage
```

### 7.3 Distribution Checklist

Before releasing:

- [ ] Tested on target operating systems
- [ ] Code signed (removes security warnings)
- [ ] Version number updated in `config/app.config.js`
- [ ] Release notes prepared
- [ ] Icons verified on all platforms
- [ ] No "Electron" branding visible anywhere
- [ ] Privacy policy/terms ready (if applicable)
- [ ] Update mechanism configured (if using auto-update)

### 7.4 Where to Distribute

**Options**:
1. **GitHub Releases**
   - Upload installers as release assets
   - Use release tags for versions

2. **Your Website**
   - Host installers on your domain
   - Create download page

3. **App Stores** (requires additional setup):
   - Microsoft Store (Windows)
   - Mac App Store (macOS)
   - Snap Store (Linux)

---

## Advanced Customizations

### Auto-Updates

Add auto-update capability:

1. **Install electron-updater**
   ```bash
   npm install electron-updater
   ```

2. **Configure in main.js**
   ```javascript
   const { autoUpdater } = require('electron-updater');
   
   autoUpdater.checkForUpdatesAndNotify();
   ```

3. **Setup update server** (GitHub Releases, S3, etc.)

### Deep Links

Register custom URL protocol:

```json
// In package.json
"build": {
  "protocols": [
    {
      "name": "myapp",
      "schemes": ["myapp"]
    }
  ]
}
```

Now users can open links like `myapp://action/param`

### Custom Installer Images (Windows)

Add custom branding to NSIS installer:

1. Create images:
   - `build/installer-header.bmp` (150x57 pixels)
   - `build/installer-sidebar.bmp` (164x314 pixels)

2. Reference in `package.json`:
   ```json
   "nsis": {
     "installerHeader": "build/installer-header.bmp",
     "installerSidebar": "build/installer-sidebar.bmp"
   }
   ```

### Multiple Windows

Create additional windows:

```javascript
// In main.js
function createSecondWindow() {
  const secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,  // Optional: make it a child window
    title: 'Settings',
    // ... other options
  });
  
  secondWindow.loadFile('src/renderer/settings.html');
}
```

### Native Modules

If you need Node.js native modules:

1. **Install electron-rebuild**
   ```bash
   npm install --save-dev electron-rebuild
   ```

2. **Rebuild after installing native modules**
   ```bash
   npx electron-rebuild
   ```

---

## Troubleshooting

### Issue: "Electron" still appears in Task Manager

**Solution**: 
1. Double-check `executableName` in `config/app.config.js`
2. Ensure you've rebuilt the app: `npm run build`
3. Verify `app.setAppUserModelId()` is called (Windows)

### Issue: Icons not showing

**Solution**:
1. Verify icon files exist in `build/icons/`
2. Check icon file sizes (Windows: 256x256+, macOS: 512x512+)
3. Clear system icon cache:
   - Windows: Run `ie4uinit.exe -show` as admin
   - macOS: Delete `~/Library/Caches/com.apple.iconservices.store`

### Issue: Build fails with code signing error

**Solution**:
1. Verify certificate paths in `.env` are correct
2. Check certificate expiration date
3. Test unsigned build first: `npm run build:unsigned`
4. Check logs in terminal for specific error

### Issue: macOS Gatekeeper blocks app

**Solution**:
- App must be code signed AND notarized
- Verify `APPLE_ID` and `APPLE_ID_PASSWORD` are correct
- Check notarization status in terminal output

---

## Next Steps

1. ✅ **Customize** app.config.js
2. ✅ **Replace** icons
3. ✅ **Test** locally
4. ✅ **Setup** code signing (optional)
5. ✅ **Build** for production
6. ✅ **Verify** branding on all platforms
7. ✅ **Distribute** to users

**Need help?** Check the [README](./README.md) or open an issue!

---

**Happy building! 🚀**
