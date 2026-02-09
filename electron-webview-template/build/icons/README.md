# Application Icons

This directory contains the application icons for all platforms.

## Required Files

### Windows
- `icon.ico` - Windows icon file (256x256 minimum)

### macOS
- `icon.icns` - macOS icon file (512x512 minimum)

### Linux
- `png/` folder containing PNG icons in various sizes:
  - 16x16.png
  - 32x32.png
  - 64x64.png
  - 128x128.png
  - 256x256.png
  - 512x512.png

## Generating Icons

### Option 1: Automatic (Recommended)

1. Create a 1024x1024 PNG source image named `icon-source.png` in the project root
2. Run: `npx electron-icon-builder --input=icon-source.png --output=build/icons`

### Option 2: Using Sharp

1. Install sharp: `npm install sharp --save-dev`
2. Run: `npm run icons`

### Option 3: Manual

Use online converters or design tools to create the required formats:
- Windows (.ico): https://icoconvert.com/
- macOS (.icns): https://cloudconvert.com/png-to-icns
- Linux: Resize PNG to required sizes

## Icon Design Tips

- Keep the design simple and recognizable at small sizes (16x16)
- Use bold colors with good contrast
- Test on both light and dark backgrounds
- Avoid fine details that won't be visible at small sizes
- Use transparency for better appearance
- Square aspect ratio required

## Testing

After adding icons, test by:
1. Running the app: `npm start`
2. Building the app: `npm run build`
3. Checking the installed application icon

The icon should appear in:
- Window title bar
- Taskbar/Dock
- Task Manager/Activity Monitor
- Application switcher
- System tray (if enabled)
