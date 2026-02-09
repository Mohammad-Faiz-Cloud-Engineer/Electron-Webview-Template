/**
 * Application Configuration
 * =========================
 * This is the SINGLE SOURCE OF TRUTH for all application metadata.
 * Edit this file to customize your application branding.
 *
 * After editing, test with: npm start
 * Then verify your app name appears in Task Manager / Activity Monitor.
 * 
 * Template created by Mohammad Faiz
 * https://github.com/Mohammad-Faiz-Cloud-Engineer/Electron-Webview-Template
 */

module.exports = {
    // ============================================
    // APPLICATION IDENTITY
    // ============================================

    /**
     * Technical name - used for folders/files (no spaces, lowercase)
     * Example: 'myapp', 'coolapp', 'superhelper'
     * This appears in: file paths, process names, internal identifiers
     */
    name: 'myapp',

    /**
     * Display name - shown to users in UI, installers, menus
     * This is what appears in: window titles, menu bars, installers
     * Can contain spaces and capital letters
     */
    productName: 'My Application',

    /**
     * Short description of your application
     * Used in: installers, about dialogs, package metadata
     */
    description: 'A powerful desktop application built with Electron',

    /**
     * Application version (semantic versioning recommended)
     * Format: MAJOR.MINOR.PATCH (e.g., 1.0.0)
     */
    version: '1.2.0',

    // ============================================
    // PLATFORM IDENTIFIERS
    // ============================================

    /**
     * Unique application identifier (reverse domain notation)
     * - macOS: Used as CFBundleIdentifier
     * - Windows: Used for App User Model ID (Task Manager name)
     * - Must be unique to your application
     * Format: com.company.appname (no spaces, lowercase)
     */
    appId: 'com.mycompany.myapp',

    // ============================================
    // COMPANY INFORMATION
    // ============================================

    author: {
        name: 'My Company',
        email: 'support@mycompany.com',
        url: 'https://mycompany.com'
    },

    /**
     * Copyright notice (year auto-updated)
     */
    copyright: `Copyright © ${new Date().getFullYear()} My Company`,

    // ============================================
    // WINDOW CONFIGURATION
    // ============================================

    window: {
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,

        /**
         * Security settings - DO NOT CHANGE unless you know what you're doing
         * These settings follow Electron security best practices
         */
        webPreferences: {
            contextIsolation: true,     // Required: Isolates preload scripts
            nodeIntegration: false,      // Required: Prevents Node.js in renderer
            enableRemoteModule: false,   // Deprecated: Keep disabled
            sandbox: true               // Additional security layer
        }
    },

    // ============================================
    // WEBVIEW URLS
    // ============================================

    urls: {
        /**
         * Main URL to load in the webview
         * Change this to your web application URL
         * Supports: https://, http://, file://
         * Falls back to local HTML if URL fails to load
         */
        main: 'https://youtube.com'
    },

    // ============================================
    // TRAY CONFIGURATION (Optional)
    // ============================================

    tray: {
        enabled: false,              // Set to true to enable system tray icon
        tooltip: 'My Application',   // Tooltip text on hover
        showOnClick: true,           // Show window when tray icon is clicked
        minimizeToTray: false        // Hide to tray instead of taskbar when minimized
    },

    // ============================================
    // APPLICATION CATEGORIES
    // ============================================

    /**
     * macOS App Store category
     * Options: productivity, business, developer-tools, education, 
     *          entertainment, finance, games, graphics-design, 
     *          healthcare-fitness, lifestyle, medical, music, news, 
     *          photography, social-networking, sports, travel, utilities, video
     * See: https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype
     */
    macCategory: 'public.app-category.productivity',

    /**
     * Linux desktop category
     * Options: AudioVideo, Audio, Video, Development, Education, Game, 
     *          Graphics, Network, Office, Science, Settings, System, Utility
     * See: https://specifications.freedesktop.org/menu-spec/latest/apa.html
     */
    linuxCategory: 'Utility'
};
