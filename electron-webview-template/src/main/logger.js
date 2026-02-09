/**
 * Logger Utility
 * ==============
 * Production-grade logging with levels and timestamps
 */

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Log levels
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

// Current log level (set via environment variable or default to INFO)
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

// Log file path
let logFilePath = null;

/**
 * Initialize logger with log file
 */
function initLogger() {
    try {
        const logsDir = path.join(app.getPath('userData'), 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().split('T')[0];
        logFilePath = path.join(logsDir, `app-${timestamp}.log`);

        // Rotate old logs (keep last 7 days)
        rotateOldLogs(logsDir);
    } catch (error) {
        console.error('[Logger] Failed to initialize log file:', error);
    }
}

/**
 * Rotate old log files (keep last 7 days)
 * @param {string} logsDir - Directory containing log files
 */
function rotateOldLogs(logsDir) {
    const MAX_LOG_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
    const LOG_FILE_PATTERN = /^app-\d{4}-\d{2}-\d{2}\.log$/;
    
    try {
        const files = fs.readdirSync(logsDir);
        const now = Date.now();
        let deletedCount = 0;

        files.forEach(file => {
            // Only process log files matching our pattern
            if (!LOG_FILE_PATTERN.test(file)) {
                return;
            }

            try {
                const filePath = path.join(logsDir, file);
                const stats = fs.statSync(filePath);
                
                if (stats.isFile() && now - stats.mtime.getTime() > MAX_LOG_AGE_MS) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            } catch (fileError) {
                console.error(`[Logger] Failed to process log file ${file}:`, fileError.message);
            }
        });

        if (deletedCount > 0) {
            console.log(`[Logger] Rotated ${deletedCount} old log file(s)`);
        }
    } catch (error) {
        console.error('[Logger] Failed to rotate logs:', error.message);
    }
}

/**
 * Format log message with timestamp and structured data
 * @param {string} level - Log level (ERROR, WARN, INFO, DEBUG)
 * @param {string} category - Log category
 * @param {string} message - Log message
 * @param {Object} [data] - Additional structured data
 * @returns {string} Formatted log message
 */
function formatMessage(level, category, message, data) {
    const timestamp = new Date().toISOString();
    let formatted = `[${timestamp}] [${level}] [${category}] ${message}`;
    
    if (data !== undefined && data !== null) {
        try {
            formatted += ` ${JSON.stringify(data)}`;
        } catch (error) {
            formatted += ' [Unserializable data]';
        }
    }
    
    return formatted;
}

/**
 * Write to log file
 */
function writeToFile(message) {
    if (!logFilePath) return;
    
    try {
        fs.appendFileSync(logFilePath, message + '\n', 'utf8');
    } catch (error) {
        console.error('[Logger] Failed to write to log file:', error);
    }
}

/**
 * Log error message
 */
function error(category, message, data) {
    if (CURRENT_LEVEL < LOG_LEVELS.ERROR) return;
    
    const formatted = formatMessage('ERROR', category, message, data);
    console.error(formatted);
    writeToFile(formatted);
}

/**
 * Log warning message
 */
function warn(category, message, data) {
    if (CURRENT_LEVEL < LOG_LEVELS.WARN) return;
    
    const formatted = formatMessage('WARN', category, message, data);
    console.warn(formatted);
    writeToFile(formatted);
}

/**
 * Log info message
 */
function info(category, message, data) {
    if (CURRENT_LEVEL < LOG_LEVELS.INFO) return;
    
    const formatted = formatMessage('INFO', category, message, data);
    console.log(formatted);
    writeToFile(formatted);
}

/**
 * Log debug message
 */
function debug(category, message, data) {
    if (CURRENT_LEVEL < LOG_LEVELS.DEBUG) return;
    
    const formatted = formatMessage('DEBUG', category, message, data);
    console.log(formatted);
    writeToFile(formatted);
}

/**
 * Get log file path
 */
function getLogPath() {
    return logFilePath;
}

module.exports = {
    initLogger,
    error,
    warn,
    info,
    debug,
    getLogPath
};
