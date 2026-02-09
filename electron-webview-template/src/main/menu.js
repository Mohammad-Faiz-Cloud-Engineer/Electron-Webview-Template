/**
 * Application Menu
 * ================
 * Custom application menu with proper branding.
 * The app name passed to setApplicationMenu() appears in the macOS menu bar.
 */

const { Menu, shell, BrowserWindow } = require('electron');
const path = require('path');
const config = require('../../config/app.config');
const logger = require('./logger');

/**
 * Create a new application window
 */
function createNewWindow() {
    try {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length === 0) {
            logger.warn('Menu', 'No windows available to clone');
            return;
        }

        const sourceWindow = windows[0];
        const bounds = sourceWindow.getBounds();
        const WINDOW_OFFSET = 50;
        
        const windowConfig = {
            width: bounds.width,
            height: bounds.height,
            x: bounds.x + WINDOW_OFFSET,
            y: bounds.y + WINDOW_OFFSET,
            title: config.productName,
            icon: getIconPath(),
            show: false,
            center: false,
            backgroundColor: '#1e1e1e',
            webPreferences: {
                ...config.window.webPreferences,
                preload: path.join(__dirname, '../preload/preload.js')
            }
        };

        const newWindow = new BrowserWindow(windowConfig);

        // Load the same URL
        const url = sourceWindow.webContents.getURL();
        newWindow.loadURL(url).catch(err => {
            logger.error('Menu', 'Failed to load URL in new window', { 
                error: err.message,
                url 
            });
        });

        newWindow.once('ready-to-show', () => {
            newWindow.show();
        });

        // Handle external links
        newWindow.webContents.setWindowOpenHandler(({ url: linkUrl }) => {
            shell.openExternal(linkUrl).catch(err => {
                logger.error('Menu', 'Failed to open external link', { 
                    error: err.message,
                    url: linkUrl 
                });
            });
            return { action: 'deny' };
        });
    } catch (error) {
        logger.error('Menu', 'Error creating new window', { 
            error: error.message,
            stack: error.stack 
        });
    }
}

/**
 * Create and set the application menu
 * @param {string} appName - The application display name
 */
function setApplicationMenu(appName) {
    const isMac = process.platform === 'darwin';

    const template = [
        // App Menu (macOS only)
        ...(isMac ? [{
            label: appName,  // This shows in the macOS menu bar
            submenu: [
                { role: 'about', label: `About ${appName}` },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide', label: `Hide ${appName}` },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit', label: `Quit ${appName}` }
            ]
        }] : []),

        // File Menu
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Window',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => createNewWindow()
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },

        // Edit Menu
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },

        // View Menu
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },

        // Window Menu
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },

        // Help Menu
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org');
                    }
                },
                {
                    label: 'Documentation',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org/docs');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Report Issue',
                    click: async () => {
                        await shell.openExternal('https://github.com/Mohammad-Faiz-Cloud-Engineer/Electron-Webview-Template/issues');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

/**
 * Get the correct icon path for the current platform
 * @returns {string} Path to the platform-specific icon file
 */
function getIconPath() {
    const iconsDir = path.join(__dirname, '../../build/icons');
    const iconPaths = {
        darwin: path.join(iconsDir, 'icon.icns'),
        win32: path.join(iconsDir, 'icon.ico'),
        default: path.join(iconsDir, 'png', '512x512.png')
    };

    return iconPaths[process.platform] || iconPaths.default;
}

module.exports = { setApplicationMenu };
