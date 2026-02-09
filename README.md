# Electron Webview Template

Production-ready Electron template for wrapping web applications as native desktop apps. Customize in minutes, not hours.

![Electron](https://img.shields.io/badge/Electron-28.x-47848F?logo=electron&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
[![GitHub](https://img.shields.io/badge/GitHub-Mohammad--Faiz-181717?logo=github)](https://github.com/Mohammad-Faiz-Cloud-Engineer/Electron-Webview-Template)

## Features

- Complete branding control - your app name everywhere, zero Electron references
- Security-first configuration with context isolation and sandboxing
- Cross-platform builds from a single codebase
- Code signing support for Windows and macOS
- Clean fallback UI for offline scenarios

## Quick Start

Clone and install:

```bash
git clone https://github.com/Mohammad-Faiz-Cloud-Engineer/Electron-Webview-Template.git my-app
cd my-app
npm install
```

Edit `config/app.config.js`:

```javascript
module.exports = {
  name: 'myapp',
  productName: 'My Application',
  appId: 'com.mycompany.myapp',
  executableName: 'myapp',
  
  urls: {
    main: 'https://your-webapp.com'
  }
};
```

Replace icons in `build/icons/` (or generate them):

```bash
npx electron-icon-builder --input=icon-source.png --output=build/icons
```

Run it:

```bash
npm start
```

Your custom app name now appears in window titles, Task Manager, Activity Monitor, and system tray.

## Building

```bash
npm run build              # Current platform
npm run build:win          # Windows
npm run build:mac          # macOS
npm run build:linux        # Linux
npm run build:all          # All platforms
```

Installers go to `dist/`.

## Project Structure

```
electron-webview-template/
├── config/
│   └── app.config.js      # Edit: app metadata
├── build/
│   └── icons/             # Replace: your icons
├── src/
│   ├── main/              # Main process
│   ├── preload/           # Security bridge
│   └── renderer/          # UI
├── package.json
└── .env.example           # Code signing
```

## Code Signing

Copy `.env.example` to `.env` and add credentials:

Windows:
```bash
WIN_CSC_LINK=path/to/certificate.p12
WIN_CSC_KEY_PASSWORD=your_password
```

macOS:
```bash
CSC_LINK=path/to/certificate.p12
CSC_KEY_PASSWORD=your_password
APPLE_ID=your@email.com
APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
APPLE_TEAM_ID=TEAM_ID
```

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for details.

## Documentation

- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Full configuration reference
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - Verify your branding

## Security

Follows Electron security best practices:
- Context isolation enabled
- Node integration disabled
- Sandboxed renderer process
- Secure IPC via contextBridge

## License

MIT - use for any project, commercial or personal.

## Author

Mohammad Faiz  
GitHub: [@Mohammad-Faiz-Cloud-Engineer](https://github.com/Mohammad-Faiz-Cloud-Engineer)
