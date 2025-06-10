"use strict";
/**
 * 简单的日志工具
 * 为 MCP 服务器提供结构化日志
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class SimpleLogger {
    isDebugMode;
    constructor() {
        this.isDebugMode = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
    }
    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level}] ${message}`;
        if (data) {
            return `${prefix} ${JSON.stringify(data)}`;
        }
        return prefix;
    }
    debug(message, data) {
        if (this.isDebugMode) {
            console.log(this.formatMessage('DEBUG', message, data));
        }
    }
    info(message, data) {
        console.log(this.formatMessage('INFO', message, data));
    }
    warn(message, data) {
        console.warn(this.formatMessage('WARN', message, data));
    }
    error(message, data) {
        console.error(this.formatMessage('ERROR', message, data));
    }
}
exports.logger = new SimpleLogger();
//# sourceMappingURL=logger.js.map