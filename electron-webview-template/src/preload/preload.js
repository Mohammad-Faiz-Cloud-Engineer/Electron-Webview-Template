/**
 * Preload Script
 * ==============
 * This script runs in a sandboxed environment with access to Node.js APIs.
 * It serves as a secure bridge between the main process and renderer.
 *
 * SECURITY RULES:
 * 1. NEVER expose the entire 'require' function
 * 2. NEVER expose 'ipcRenderer.send' directly
 * 3. Only expose specific, validated methods
 * 4. Always validate input from renderer
 */

const { contextBridge, ipcRenderer } = require('electron');
const config = require('../../config/app.config');

/**
 * Expose safe APIs to the renderer process
 * Access these in renderer via: window.appAPI.methodName()
 */
contextBridge.exposeInMainWorld('appAPI', {
    // ============================================
    // APPLICATION INFO
    // ============================================

    /**
     * Get the application name
     * @returns {string} The product name
     */
    getAppName: () => config.productName,

    /**
     * Get the application version
     * @returns {string} The version string
     */
    getVersion: () => config.version,

    /**
     * Get the application description
     * @returns {string} The description
     */
    getDescription: () => config.description,

    /**
     * Get application info object
     * @returns {Object} Application metadata
     */
    getAppInfo: () => ({
        name: config.productName,
        version: config.version,
        description: config.description,
        author: config.author.name,
        website: config.author.url
    }),

    // ============================================
    // PLATFORM INFO
    // ============================================

    /**
     * Get the current platform
     * @returns {string} 'darwin', 'win32', or 'linux'
     */
    getPlatform: () => process.platform,

    /**
     * Check if running on macOS
     * @returns {boolean}
     */
    isMac: () => process.platform === 'darwin',

    /**
     * Check if running on Windows
     * @returns {boolean}
     */
    isWindows: () => process.platform === 'win32',

    /**
     * Check if running on Linux
     * @returns {boolean}
     */
    isLinux: () => process.platform === 'linux',

    // ============================================
    // SAFE IPC METHODS
    // ============================================

    /**
     * Send a message to the main process (one-way)
     * Only allows whitelisted channels
     * @param {string} channel - IPC channel name
     * @param {*} data - Data to send (must be serializable)
     */
    send: (channel, data) => {
        const VALID_SEND_CHANNELS = ['app:minimize', 'app:maximize', 'app:close', 'app:reload'];
        
        if (typeof channel !== 'string' || !VALID_SEND_CHANNELS.includes(channel)) {
            console.warn(`[Preload] Blocked send to invalid channel: ${channel}`);
            return;
        }
        
        // Validate data is serializable
        if (data !== undefined && data !== null) {
            try {
                JSON.stringify(data);
            } catch (error) {
                console.error('[Preload] Invalid data - not serializable:', error.message);
                return;
            }
        }
        
        ipcRenderer.send(channel, data);
    },

    /**
     * Invoke a main process handler and get a response (two-way)
     * Only allows whitelisted channels
     * @param {string} channel - IPC channel name
     * @param {*} data - Data to send (must be serializable)
     * @returns {Promise<*>} Response from main process
     */
    invoke: async (channel, data) => {
        const VALID_INVOKE_CHANNELS = ['app:getVersion', 'app:getPath', 'dialog:open', 'dialog:save'];
        
        if (typeof channel !== 'string' || !VALID_INVOKE_CHANNELS.includes(channel)) {
            console.warn(`[Preload] Blocked invoke to invalid channel: ${channel}`);
            return null;
        }
        
        // Validate data is serializable
        if (data !== undefined && data !== null) {
            try {
                JSON.stringify(data);
            } catch (error) {
                console.error('[Preload] Invalid data - not serializable:', error.message);
                return null;
            }
        }
        
        try {
            return await ipcRenderer.invoke(channel, data);
        } catch (error) {
            console.error(`[Preload] IPC invoke failed for channel ${channel}:`, error.message);
            return null;
        }
    },

    /**
     * Listen for messages from the main process
     * Only allows whitelisted channels
     */
    on: (channel, callback) => {
        const validChannels = ['app:update-available', 'app:download-progress', 'app:error'];
        if (validChannels.includes(channel)) {
            // Wrap callback to avoid exposing event object
            ipcRenderer.on(channel, (event, ...args) => callback(...args));
        } else {
            console.warn(`[Preload] Blocked listener on invalid channel: ${channel}`);
        }
    },

    /**
     * Remove listener for a channel
     */
    removeListener: (channel, callback) => {
        const validChannels = ['app:update-available', 'app:download-progress', 'app:error'];
        if (validChannels.includes(channel)) {
            ipcRenderer.removeListener(channel, callback);
        }
    }
});

// Log that preload script loaded successfully
console.log(`[Preload] ${config.productName} v${config.version} - Preload initialized`);
