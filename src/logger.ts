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

class SimpleLogger implements Logger {
  private isDebugMode: boolean;

  constructor() {
    this.isDebugMode = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      return `${prefix} ${JSON.stringify(data)}`;
    }
    
    return prefix;
  }

  debug(message: string, data?: any): void {
    if (this.isDebugMode) {
      console.log(this.formatMessage('DEBUG', message, data));
    }
  }

  info(message: string, data?: any): void {
    console.log(this.formatMessage('INFO', message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage('WARN', message, data));
  }

  error(message: string, data?: any): void {
    console.error(this.formatMessage('ERROR', message, data));
  }
}

export const logger = new SimpleLogger(); 