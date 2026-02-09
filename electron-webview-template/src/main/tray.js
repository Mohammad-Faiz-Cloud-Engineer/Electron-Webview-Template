/**
 * System Tray
 * ===========
 * Optional system tray functionality.
 * Enable in config/app.config.js by setting tray.enabled = true
 */

const { app, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');

let tray = null;

/**
 * Create the system tray
 * @param {BrowserWindow} mainWindow - The main application window
 * @param {Object} config - The application configuration
 * @returns {Tray} The created tray instance
 */
function createTray(mainWindow, config) {
    if (!mainWindow || mainWindow.isDestroyed()) {
        console.error('[Tray] Cannot create tray: Invalid window');
        return null;
    }

    try {
        const iconPath = getTrayIconPath();
        const icon = nativeImage.createFromPath(iconPath);

        if (icon.isEmpty()) {
            console.warn('[Tray] Icon not found, using default');
        }

        const TRAY_ICON_SIZE = 16;
        tray = new Tray(icon.resize({ width: TRAY_ICON_SIZE, height: TRAY_ICON_SIZE }));

        // Set tooltip (shown on hover)
        tray.setToolTip(config.tray.tooltip || config.productName);

        // Create context menu
        const contextMenu = Menu.buildFromTemplate([
            {
                label: `Open ${config.productName}`,
                click: () => {
                    if (mainWindow) {
                        mainWindow.show();
                        mainWindow.focus();
                    }
                }
            },
            { type: 'separator' },
            {
                label: 'About',
                click: () => {
                    dialog.showMessageBox({
                        type: 'info',
                        title: `About ${config.productName}`,
                        message: config.productName,
                        detail: `Version ${config.version}\n\n${config.description}\n\n${config.copyright}`
                    });
                }
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    app.isQuitting = true;
                    app.quit();
                }
            }
        ]);

        tray.setContextMenu(contextMenu);

        // Handle click on tray icon
        if (config.tray.showOnClick) {
            tray.on('click', () => {
                if (mainWindow) {
                    if (mainWindow.isVisible()) {
                        mainWindow.focus();
                    } else {
                        mainWindow.show();
                    }
                }
            });
        }

        // Handle minimize to tray
        if (config.tray.minimizeToTray && mainWindow && !mainWindow.isDestroyed()) {
            const handleMinimize = (event) => {
                if (!app.isQuitting && !mainWindow.isDestroyed()) {
                    event.preventDefault();
                    mainWindow.hide();
                }
            };

            const handleClose = (event) => {
                if (!app.isQuitting && !mainWindow.isDestroyed()) {
                    event.preventDefault();
                    mainWindow.hide();
                }
            };

            mainWindow.on('minimize', handleMinimize);
            mainWindow.on('close', handleClose);
        }

        return tray;
    } catch (error) {
        console.error('[Tray] Failed to create tray:', error.message);
        return null;
    }
}

/**
 * Get the tray icon path for the current platform
 * @returns {string} Path to the platform-specific tray icon
 */
function getTrayIconPath() {
    const iconsDir = path.join(__dirname, '../../build/icons');
    const iconPaths = {
        darwin: path.join(iconsDir, 'png', '16x16.png'),
        win32: path.join(iconsDir, 'icon.ico'),
        default: path.join(iconsDir, 'png', '16x16.png')
    };

    return iconPaths[process.platform] || iconPaths.default;
}

/**
 * Destroy the tray
 */
function destroyTray() {
    if (tray) {
        tray.destroy();
        tray = null;
    }
}

module.exports = {
    createTray,
    destroyTray,
    getTray: () => tray
};
