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
     */
    name: 'myapp',

    /**
     * Display name - shown to users in UI, installers, etc.
     * This is what appears in window title bars and menus.
     */
    productName: 'My Application',

    /**
     * Short description of your application
     */
    description: 'A powerful desktop application built with Electron',

    /**
     * Application version (semantic versioning recommended)
     */
    version: '1.0.0',

    // ============================================
    // PLATFORM IDENTIFIERS
    // ============================================

    /**
     * Unique application identifier (reverse domain notation)
     * - macOS: Used as CFBundleIdentifier
     * - Windows: Used for App User Model ID
     * - Must be unique to your application
     */
    appId: 'com.mycompany.myapp',

    /**
     * Executable/process name
     * This is what appears in Task Manager / Activity Monitor
     * Keep it short, no spaces
     */
    executableName: 'myapp',

    // ============================================
    // COMPANY INFORMATION
    // ============================================

    author: {
        name: 'My Company',
        email: 'support@mycompany.com',
        url: 'https://mycompany.com'
    },

    /**
     * Copyright notice
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
         */
        webPreferences: {
            contextIsolation: true,     // Required for security
            nodeIntegration: false,      // Required for security
            enableRemoteModule: false,   // Deprecated, keep disabled
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
         */
        main: 'https://example.com'
    },

    // ============================================
    // TRAY CONFIGURATION (Optional)
    // ============================================

    tray: {
        enabled: false,  // Set to true to enable system tray
        tooltip: 'My Application',
        showOnClick: true,
        minimizeToTray: false
    },

    // ============================================
    // APPLICATION CATEGORIES
    // ============================================

    /**
     * macOS App Store category
     * See: https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype
     */
    macCategory: 'public.app-category.productivity',

    /**
     * Linux desktop category
     * See: https://specifications.freedesktop.org/menu-spec/latest/apa.html
     */
    linuxCategory: 'Utility'
};
