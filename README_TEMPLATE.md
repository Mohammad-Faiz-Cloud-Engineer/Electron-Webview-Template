# Electron Webview Template

Production-ready Electron template with complete branding removal. Clone, customize, and ship your desktop app.

[![Electron](https://img.shields.io/badge/Electron-28.x-47848F?logo=electron)](https://www.electronjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/yourusername/electron-webview-template)

## Features

Complete Branding Control:
- Zero "Electron" references in Task Manager, Activity Monitor, or system tray
- Custom app name in window titles, processes, shortcuts, installers
- Custom icons for Windows (.ico), macOS (.icns), Linux (PNG sets)
- Professional installers with code signing support

Security:
- Context isolation enabled
- Node integration disabled in renderer
- Secure IPC with preload script
- CSP headers configured

Performance:
- V8 code caching for faster startup
- Lazy module loading
- Hardware acceleration enabled
- Memory leak prevention

Developer Experience:
- Single config file for app metadata
- Automated icon generation from PNG source
- Cross-platform builds from one codebase
- Code signing ready

## Quick Start

Prerequisites:
- Node.js 18.x or higher
- npm or yarn
- Code signing certificates (optional, for production)

Installation:

```bash
# Clone the repository
git clone https://github.com/yourusername/electron-webview-template.git
cd electron-webview-template

# Install dependencies
npm install
npm start
```

Your app launches with default configuration.

## Customization

Edit `config/app.config.js`:

```javascript
module.exports = {
  name: 'myapp',                      // Short name (no spaces)
  productName: 'My Application',      // Display name
  description: 'My awesome app',
  version: '1.0.0',
  appId: 'com.mycompany.myapp',      // Reverse domain notation
  executableName: 'myapp',            // Process name in Task Manager
  
  author: {
    name: 'My Company',
    email: 'support@mycompany.com'
  },
  
  urls: {
    main: 'https://your-web-app.com',
    fallback: 'file://...'  // Offline fallback
  }
};
```

Replace Icons:

Automated:
```bash
npm install -g electron-icon-builder
electron-icon-builder --input=your-icon.png --output=./build/icons
```

Manual - place in `build/icons/`:
- `icon.icns` - macOS (512x512+)
- `icon.ico` - Windows (256x256 or larger)
- `png/` folder - Linux (16, 32, 64, 128, 256, 512 sizes)

### Step 3: Test Locally

```bash
npm start
```

**Verify branding**:
- ✅ Window title shows your app name
- ✅ Task Manager/Activity Monitor shows your process name (NOT "Electron")
- ✅ Custom icon appears everywhere

### Step 4: Build for Production

```bash
# Build for your current platform
npm run build

# Build for specific platforms
npm run build:win      # Windows
npm run build:mac      # macOS
npm run build:linux    # Linux
npm run build:all      # All platforms
```

Installers will be in `build/installers/`

---

## 🔐 Code Signing Setup

### Why Code Sign?
- Removes "Unknown Publisher" warnings
- Builds user trust
- Required for auto-updates
- Prevents security warnings on modern OS versions

### Windows Code Signing

**Option 1: Standard Certificate**
```bash
# Copy environment template
cp .env.example .env

# Edit .env
WIN_CSC_LINK=path/to/certificate.p12
WIN_CSC_KEY_PASSWORD=your_password
```

**Option 2: Azure Trusted Signing (Recommended, 2025)**
```bash
# In .env
AZURE_TENANT_ID=xxx
AZURE_CLIENT_ID=xxx
AZURE_CLIENT_SECRET=xxx
AZURE_ACCOUNT_NAME=your-account
AZURE_CERTIFICATE_PROFILE_NAME=your-profile
```

Then build:
```bash
npm run build:win:signed
```

### macOS Code Signing

```bash
# In .env
CSC_LINK=path/to/certificate.p12
CSC_KEY_PASSWORD=your_password
APPLE_ID=your@email.com
APPLE_ID_PASSWORD=app-specific-password
APPLE_TEAM_ID=YOUR_TEAM_ID
```

Build and notarize:
```bash
npm run build:mac:signed
```

### Linux
Linux doesn't require code signing, but you can use GPG signing for package authenticity.

---

## 📂 Project Structure

```
electron-webview-template/
├── config/
│   └── app.config.js          # ← Edit this to customize your app
├── build/
│   ├── icons/                 # ← Replace with your icons
│   └── installers/            # Generated installers appear here
├── src/
│   ├── main/
│   │   ├── main.js           # Main process (app lifecycle)
│   │   ├── menu.js           # Application menu
│   │   └── tray.js           # System tray (optional)
│   ├── preload/
│   │   └── preload.js        # Security bridge
│   └── renderer/
│       ├── index.html        # UI (or loads webview)
│       ├── styles.css
│       └── renderer.js
├── package.json
├── electron-builder.yml       # Build configuration
└── .env.example              # Code signing template
```

---

## 🧪 Testing Checklist

Use this checklist to verify your branding is complete:

### Windows
- [ ] Custom name in window title bar
- [ ] Process name in Task Manager (NOT "Electron")
- [ ] Custom icon in Task Manager
- [ ] Desktop shortcut has custom name & icon
- [ ] Start Menu entry correct
- [ ] Installer shows custom branding

### macOS
- [ ] Custom name in menu bar
- [ ] Process in Activity Monitor (NOT "Electron")
- [ ] Custom icon in Dock
- [ ] About dialog shows custom name
- [ ] .dmg installer branded correctly

### Linux
- [ ] Custom name in window title
- [ ] Process name in system monitor
- [ ] Custom icon in app launcher
- [ ] .desktop file configured

---

## ⚙️ Configuration Reference

### app.config.js Options

| Option | Type | Description | Example |
|--------|------|-------------|---------|
| `name` | string | Short identifier (no spaces) | `'myapp'` |
| `productName` | string | Display name | `'My Application'` |
| `appId` | string | Unique identifier (reverse domain) | `'com.company.app'` |
| `executableName` | string | Process name in Task Manager | `'myapp'` |
| `author.name` | string | Developer/company name | `'ACME Corp'` |
| `window.width` | number | Default window width | `1280` |
| `window.height` | number | Default window height | `720` |
| `urls.main` | string | Primary URL to load | `'https://app.com'` |

### Build Configuration (package.json)

The `build` section in package.json controls packaging:

```json
{
  "build": {
    "appId": "com.mycompany.myapp",
    "executableName": "myapp",
    "mac": {
      "category": "public.app-category.productivity",
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "portable"]
    },
    "linux": {
      "target": ["AppImage", "deb", "rpm"]
    }
  }
}
```

---

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start app in development mode |
| `npm run dev` | Development mode with debugging |
| `npm run build` | Build for current platform |
| `npm run build:win` | Build Windows installer |
| `npm run build:mac` | Build macOS .dmg |
| `npm run build:linux` | Build Linux packages |
| `npm run build:all` | Build for all platforms |
| `npm run build:unsigned` | Build without code signing |

---

## 🎯 Performance Tips

### Startup Optimization
- Icons are loaded asynchronously
- Window appears only when fully ready (`ready-to-show` event)
- V8 code caching enabled by default
- Dependencies are lazy-loaded

### Memory Management
- Event listeners cleaned up on window close
- No memory leaks in IPC communication
- BrowserView pooling for multiple windows

### Rendering Performance
- Hardware acceleration enabled
- CSS transforms for smooth animations
- Virtualized lists for large datasets (add as needed)

---

## 🐛 Troubleshooting

### "Electron" still appears in Task Manager
**Problem**: Process shows as "Electron" instead of your app name.

**Solution**:
1. Verify `executableName` in `config/app.config.js`
2. Check `app.setAppUserModelId()` is called in main.js (Windows)
3. Rebuild the application completely

### Icons not showing
**Problem**: Default Electron icon appears.

**Solutions**:
- **Windows**: Ensure `icon.ico` is at least 256x256
- **macOS**: Use `.icns` file, not `.ico`
- **Linux**: Provide PNG folder with multiple sizes
- Clear icon cache (Windows): Run `ie4uinit.exe -show`

### Code signing fails
**Problem**: Build fails during signing step.

**Solutions**:
- Verify certificate paths in `.env` are correct
- Check certificate hasn't expired
- Ensure environment variables are loaded (`dotenv`)
- For macOS: Check Keychain Access for certificate

### App won't launch after building
**Problem**: Built app crashes on startup.

**Solutions**:
1. Check logs: 
   - Windows: `%APPDATA%\yourapp\logs`
   - macOS: `~/Library/Logs/yourapp`
   - Linux: `~/.config/yourapp/logs`
2. Test unsigned build first: `npm run build:unsigned`
3. Verify all paths in config are correct

---

## 🔒 Security Best Practices

This template follows Electron's [security guidelines](https://www.electronjs.org/docs/latest/tutorial/security):

✅ **Context Isolation**: Renderer process isolated from main process  
✅ **No Node Integration**: Renderer can't directly access Node.js APIs  
✅ **Secure Preload**: Limited API surface exposed via contextBridge  
✅ **CSP Headers**: Content Security Policy prevents XSS  
✅ **HTTPS Only**: Remote content loaded over secure connections  
✅ **No eval()**: No dynamic code execution  

### Additional Recommendations
- Keep Electron updated to latest stable version
- Regularly update dependencies (`npm audit fix`)
- Enable auto-updates in production (not included in template)
- Use environment variables for sensitive data (never commit)

---

## 📦 What's Included

- ✅ Complete Electron application structure
- ✅ Security-first configuration
- ✅ Cross-platform build setup
- ✅ Icon generation support
- ✅ Code signing templates
- ✅ Development/production configs
- ✅ Menu bar implementation
- ✅ System tray support (optional)
- ✅ Auto-update ready (configure as needed)
- ✅ Comprehensive documentation

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on all platforms (if possible)
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Free to use for commercial and personal projects.

---

## 🙏 Acknowledgments

Built with:
- [Electron](https://www.electronjs.org/) - Desktop framework
- [electron-builder](https://www.electron.build/) - Build tool
- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder) - Icon generation

Inspired by best practices from:
- Visual Studio Code
- Slack Desktop
- Discord
- Notion

---

## ⭐ Star Us!

If this template helped you, please star ⭐ this repository!

---

**Ready to build your desktop app?** Start by editing `config/app.config.js` and replacing the icons!

```bash
git clone https://github.com/yourusername/electron-webview-template.git
cd electron-webview-template
npm install
npm start
```
