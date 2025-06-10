/**
 * 简单的日志工具
 * 为 MCP 服务器提供结构化日志
 */
export interface Logger {
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, data?: any): void;
}
declare class SimpleLogger implements Logger {
    private isDebugMode;
    constructor();
    private formatMessage;
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, data?: any): void;
}
export declare const logger: SimpleLogger;
export {};
//# sourceMappingURL=logger.d.ts.map