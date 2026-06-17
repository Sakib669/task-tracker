// src/lib/logger.ts

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`INFO: ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`WARN: ${message}`, ...args);
  },
  error: (message: string, error?: Error | unknown, ...args: any[]) => {
    // Attempt to extract stack trace if error is an Error object
    const errorLog = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    console.error(`ERROR: ${message}`, errorLog, ...args);
  },
};
