/**
 * Main Process
 * ============
 * This is the entry point for the Electron application.
 *
 * CRITICAL BRANDING NOTES:
 * - app.setName() MUST be called BEFORE app.whenReady()
 * - app.setAppUserModelId() is required for Windows Task Manager branding
 * - All branding values come from config/app.config.js
 */

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const config = require('../../config/app.config');
const logger = require('./logger');

// ============================================
// CRITICAL: Set app name BEFORE ANYTHING ELSE
// ============================================
// This ensures the correct name appears in:
// - macOS menu bar
// - macOS Activity Monitor
// - Linux system monitors
app.setName(config.productName);

// Set custom userData path to avoid conflicts
app.setPath('userData', path.join(app.getPath('appData'), config.name));

// ============================================
// WINDOWS-SPECIFIC: Set App User Model ID
// ============================================
// This is CRITICAL for Windows. Without it:
// - Task Manager shows "Electron" instead of your app name
// - Taskbar grouping doesn't work correctly
// - Jump lists don't work properly
if (process.platform === 'win32') {
    app.setAppUserModelId(config.appId);
}

// V8 code caching removed - not needed for production

let mainWindow = null;

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

/**
 * Create the main application window
 * @returns {BrowserWindow} The created window instance
 */
function createWindow() {
    const windowConfig = {
        width: config.window.width,
        height: config.window.height,
        minWidth: config.window.minWidth,
        minHeight: config.window.minHeight,
        title: config.productName,
        icon: getIconPath(),
        show: false,
        center: true,
        backgroundColor: '#1e1e1e',
        webPreferences: {
            ...config.window.webPreferences,
            preload: path.join(__dirname, '../preload/preload.js')
        }
    };

    mainWindow = new BrowserWindow(windowConfig);

    // ============================================
    // LOAD CONTENT
    // ============================================
    loadMainContent();

    // ============================================
    // WINDOW EVENTS
    // ============================================

    // Show window when ready (prevents white flash)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();

        // Focus the window on macOS
        if (process.platform === 'darwin') {
            app.dock.show();
        }
    });

    // Prevent websites from changing the window title
    mainWindow.on('page-title-updated', (event) => {
        event.preventDefault();
    });

    // Handle external links - open in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url).catch(err => {
            logger.error('Main', 'Failed to open external URL', { 
                error: err.message,
                url 
            });
        });
        return { action: 'deny' };
    });

    // Clean up reference on close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // ============================================
    // SET APPLICATION MENU
    // ============================================
    const menu = require('./menu');
    menu.setApplicationMenu(config.productName);

    // ============================================
    // INITIALIZE SYSTEM TRAY (if enabled)
    // ============================================
    if (config.tray.enabled) {
        const tray = require('./tray');
        tray.createTray(mainWindow, config);
    }
}

/**
 * Validate URL protocol and format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidUrl(url) {
    if (typeof url !== 'string' || url.trim().length === 0) {
        return false;
    }

    const ALLOWED_PROTOCOLS = ['https:', 'http:', 'file:'];
    try {
        const parsedUrl = new URL(url);
        return ALLOWED_PROTOCOLS.includes(parsedUrl.protocol);
    } catch {
        return false;
    }
}

/**
 * Load the main content (URL or fallback)
 */
function loadMainContent() {
    const url = config.urls.main;

    if (!isValidUrl(url)) {
        logger.error('Main', `Invalid URL configuration: ${url}`, { 
            reason: 'Invalid protocol or malformed URL',
            allowedProtocols: ['https:', 'http:', 'file:']
        });
        loadFallbackPage();
        return;
    }

    mainWindow.loadURL(url)
        .then(() => {
            logger.info('Main', `Successfully loaded: ${url}`);
        })
        .catch((error) => {
            logger.error('Main', `Failed to load ${url}`, { 
                error: error.message,
                code: error.code,
                stack: error.stack
            });
            loadFallbackPage();
        });
}

/**
 * Load the fallback HTML page
 */
function loadFallbackPage() {
    logger.info('Main', 'Loading fallback page...');
    const fallbackPath = path.join(__dirname, '../renderer/index.html');
    
    mainWindow.loadFile(fallbackPath)
        .then(() => {
            logger.info('Main', 'Fallback page loaded successfully');
        })
        .catch((fallbackError) => {
            logger.error('Main', 'Critical: Fallback page also failed', { error: fallbackError.message });
            // Last resort: show error dialog
            const { dialog } = require('electron');
            dialog.showErrorBox(
                'Application Error',
                `Failed to load application content.\n\nMain URL: ${config.urls.main}\nError: ${fallbackError.message}`
            );
        });
}

// ============================================
// APPLICATION LIFECYCLE
// ============================================

/**
 * Initialize application when Electron is ready
 */
app.whenReady().then(() => {
    logger.initLogger();
    logger.info('App', `Starting ${config.productName} v${config.version}`, {
        platform: process.platform,
        arch: process.arch,
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node
    });
    
    createWindow();

    // macOS: Re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}).catch(error => {
    console.error('[App] Failed to initialize:', error);
    app.quit();
});

/**
 * Quit when all windows are closed (except on macOS)
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        logger.info('App', 'All windows closed, quitting application');
        app.quit();
    }
});

/**
 * Clean up resources before quit
 */
app.on('before-quit', () => {
    app.isQuitting = true;
    
    try {
        // Destroy tray if enabled
        if (config.tray.enabled) {
            const tray = require('./tray');
            tray.destroyTray();
        }
        
        // Clean up main window
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.removeAllListeners();
            mainWindow = null;
        }
        
        logger.info('App', 'Application shutting down gracefully');
    } catch (error) {
        logger.error('App', 'Error during cleanup', { error: error.message });
    }
});

/**
 * Security: Prevent unauthorized navigation and window creation
 */
app.on('web-contents-created', (_event, contents) => {
    // Prevent navigation to different origins
    contents.on('will-navigate', (navEvent, navigationUrl) => {
        try {
            const parsedUrl = new URL(navigationUrl);
            const mainUrl = new URL(config.urls.main);

            if (parsedUrl.origin !== mainUrl.origin) {
                logger.warn('Security', `Blocked navigation to different origin: ${navigationUrl}`, {
                    from: mainUrl.origin,
                    to: parsedUrl.origin
                });
                navEvent.preventDefault();
            }
        } catch (error) {
            logger.error('Security', 'Error parsing navigation URL', { 
                url: navigationUrl,
                error: error.message 
            });
            navEvent.preventDefault();
        }
    });

    // Prevent new window creation from renderer
    contents.setWindowOpenHandler(({ url }) => {
        logger.warn('Security', `Blocked window.open attempt: ${url}`);
        return { action: 'deny' };
    });
});

/**
 * Error handling for uncaught exceptions and unhandled rejections
 */
process.on('uncaughtException', (error) => {
    logger.error('Process', 'Uncaught exception', { 
        error: error.message, 
        stack: error.stack,
        name: error.name
    });
    // Don't exit - let the app continue if possible
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Process', 'Unhandled rejection', { 
        reason: reason instanceof Error ? reason.message : String(reason),
        promise: String(promise)
    });
});
