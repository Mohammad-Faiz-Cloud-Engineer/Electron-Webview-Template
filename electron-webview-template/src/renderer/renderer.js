/**
 * Renderer Process
 * =================
 * This runs in the browser context of the Electron window.
 * Access to Node.js is disabled for security.
 * Use window.appAPI to communicate with the main process.
 */

(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', init);

    // Configuration
    const CONFIG = {
        LOADER_DELAY: 500, // Delay before hiding loader (ms)
        NOTIFICATION_DURATION: 3000, // Notification display time (ms)
        NOTIFICATION_FADE_OUT: 300, // Notification fade out time (ms)
        RELOAD_DELAY: 300 // Delay before reload (ms)
    };

    /**
     * Initialize the renderer
     */
    function init() {
        try {
            // Hide loader, show content after brief delay
            setTimeout(() => {
                hideLoader();
                populateAppInfo();
                setupEventListeners();
            }, CONFIG.LOADER_DELAY);
        } catch (error) {
            console.error('[Renderer] Initialization error:', error);
            showError('Failed to initialize application');
        }
    }

    /**
     * Hide the loading spinner and show main content
     */
    function hideLoader() {
        const loader = document.getElementById('loader');
        const content = document.getElementById('content');

        if (loader) {
            loader.style.display = 'none';
        }

        if (content) {
            content.style.display = 'block';
        }
    }

    /**
     * Populate UI with app information from preload
     */
    function populateAppInfo() {
        try {
            // Check if appAPI is available (exposed by preload script)
            if (typeof window.appAPI === 'undefined') {
                console.warn('[Renderer] appAPI not available - running outside Electron?');
                showError('Application API not available');
                return;
            }

            const api = window.appAPI;

            // Update app name
            const appNameEl = document.getElementById('app-name');
            if (appNameEl) {
                appNameEl.textContent = api.getAppName();
            }

            // Update version
            const versionEl = document.getElementById('app-version');
            if (versionEl) {
                versionEl.textContent = `Version ${api.getVersion()}`;
            }

            // Update description
            const descEl = document.getElementById('app-description');
            if (descEl) {
                descEl.textContent = api.getDescription();
            }

            // Update document title
            document.title = api.getAppName();

            // Update platform info
            const platformEl = document.getElementById('platform-info');
            if (platformEl) {
                const platformNames = {
                    darwin: 'macOS',
                    win32: 'Windows',
                    linux: 'Linux'
                };
                const platform = api.getPlatform();
                platformEl.textContent = `Platform: ${platformNames[platform] || platform}`;
            }

            // Update copyright
            const copyrightEl = document.getElementById('copyright');
            if (copyrightEl) {
                const info = api.getAppInfo();
                const currentYear = new Date().getFullYear();
                copyrightEl.textContent = `© ${currentYear} ${info.author}`;
            }

            console.log(`[Renderer] ${api.getAppName()} v${api.getVersion()} initialized`);
        } catch (error) {
            console.error('[Renderer] Error populating app info:', error);
            showError('Failed to load application information');
        }
    }

    /**
     * Set up event listeners for buttons
     */
    function setupEventListeners() {
        try {
            // Reload button
            const reloadBtn = document.getElementById('reload-btn');
            if (reloadBtn) {
                reloadBtn.addEventListener('click', () => {
                    try {
                        updateStatus('loading', 'Reloading...');
                        setTimeout(() => {
                            window.location.reload();
                        }, CONFIG.RELOAD_DELAY);
                    } catch (error) {
                        console.error('[Renderer] Reload error:', error);
                        showError('Failed to reload');
                    }
                });
            }

            // Settings button
            const settingsBtn = document.getElementById('settings-btn');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    showNotification('Settings panel coming soon!', 'info');
                });
            }
        } catch (error) {
            console.error('[Renderer] Error setting up event listeners:', error);
        }
    }

    /**
     * Update the status indicator
     * @param {string} status - 'online', 'offline', or 'loading'
     * @param {string} text - Status text to display
     */
    function updateStatus(status, text) {
        const VALID_STATUSES = ['online', 'offline', 'loading'];
        const indicator = document.querySelector('.status-indicator');
        const statusText = document.getElementById('status-text');

        if (indicator && VALID_STATUSES.includes(status)) {
            indicator.className = `status-indicator ${status}`;
        }

        if (statusText && typeof text === 'string') {
            statusText.textContent = text;
        }
    }

    /**
     * Show a notification message
     * @param {string} message - Message to display
     * @param {string} type - 'info', 'success', 'warning', or 'error'
     */
    function showNotification(message, type = 'info') {
        const VALID_TYPES = ['info', 'success', 'warning', 'error'];
        const notificationType = VALID_TYPES.includes(type) ? type : 'info';
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${notificationType}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Add to body
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after configured duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, CONFIG.NOTIFICATION_FADE_OUT);
        }, CONFIG.NOTIFICATION_DURATION);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    function showError(message) {
        console.error('[Renderer]', message);
        showNotification(message, 'error');
    }

    // Export functions for external use (optional)
    window.appRenderer = {
        updateStatus,
        showNotification,
        showError
    };

})();
