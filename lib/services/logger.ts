/**
 * Structured Logging Utility
 * 
 * Provides a structured logging interface ready for integration with services like Sentry.
 * Currently outputs to console with structured JSON format for easy parsing.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
    /** Module or service name */
    module?: string;
    /** User ID if available */
    userId?: string;
    /** Request ID for tracing */
    requestId?: string;
    /** Additional metadata */
    [key: string]: unknown;
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

/**
 * Format a log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
    return JSON.stringify(entry);
}

/**
 * Check if we're in development mode
 */
function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

/**
 * Main logger implementation
 */
class Logger {
    private defaultContext: LogContext;

    constructor(context: LogContext = {}) {
        this.defaultContext = context;
    }

    /**
     * Create a child logger with additional context
     */
    child(context: LogContext): Logger {
        return new Logger({ ...this.defaultContext, ...context });
    }

    /**
     * Log a debug message (only in development)
     */
    debug(message: string, context?: LogContext): void {
        if (!isDev()) return;
        this.log('debug', message, context);
    }

    /**
     * Log an info message
     */
    info(message: string, context?: LogContext): void {
        this.log('info', message, context);
    }

    /**
     * Log a warning message
     */
    warn(message: string, context?: LogContext): void {
        this.log('warn', message, context);
    }

    /**
     * Log an error message
     */
    error(message: string, error?: Error | unknown, context?: LogContext): void {
        const entry: LogEntry = {
            level: 'error',
            message,
            timestamp: new Date().toISOString(),
            context: { ...this.defaultContext, ...context },
        };

        if (error instanceof Error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        } else if (error) {
            entry.error = {
                name: 'UnknownError',
                message: String(error),
            };
        }

        console.error(formatLogEntry(entry));

        // TODO: Send to Sentry when integrated
        // if (typeof Sentry !== 'undefined' && error instanceof Error) {
        //   Sentry.captureException(error, { extra: entry.context });
        // }
    }

    /**
     * Internal log method
     */
    private log(level: LogLevel, message: string, context?: LogContext): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context: { ...this.defaultContext, ...context },
        };

        const output = formatLogEntry(entry);

        switch (level) {
            case 'debug':
                console.debug(output);
                break;
            case 'info':
                console.info(output);
                break;
            case 'warn':
                console.warn(output);
                break;
            case 'error':
                console.error(output);
                break;
        }
    }
}

/**
 * Default logger instance
 */
export const logger = new Logger({ module: 'waypla' });

/**
 * Create a logger for a specific module
 */
export function createLogger(module: string, context?: LogContext): Logger {
    return new Logger({ module, ...context });
}

/**
 * Log API request/response for debugging
 */
export function logApiRequest(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
    context?: LogContext
): void {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    logger[level](`${method} ${path} ${statusCode} ${durationMs}ms`, {
        ...context,
        http: {
            method,
            path,
            statusCode,
            durationMs,
        },
    });
}

/**
 * Capture and log unhandled errors
 */
export function captureError(error: Error | unknown, context?: LogContext): void {
    logger.error('Unhandled error', error, context);
}
