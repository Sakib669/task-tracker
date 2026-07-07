"use strict";
// src/lib/logger.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (message, ...args) => {
        console.log(`INFO: ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`WARN: ${message}`, ...args);
    },
    error: (message, error, ...args) => {
        // Attempt to extract stack trace if error is an Error object
        const errorLog = error instanceof Error ? { message: error.message, stack: error.stack } : error;
        console.error(`ERROR: ${message}`, errorLog, ...args);
    },
};
