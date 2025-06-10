#!/usr/bin/env node
/**
 * Promot Share MCP Server
 * 标准 MCP 服务器，作为 Promot Share API 的代理层
 * 解决旧版本 Cursor 无法携带请求头的问题
 */
/**
 * MCP 服务器类
 * 提供标准 MCP 协议接口，内部调用 Promot Share API
 */
declare class PromotShareMcpServer {
    private server;
    private apiClient;
    constructor();
    /**
     * 设置 MCP 工具
     */
    private setupTools;
    /**
     * 格式化工具执行结果
     */
    private formatToolResult;
    /**
     * 设置错误处理
     */
    private setupErrorHandling;
    /**
     * 启动服务器
     */
    start(): Promise<void>;
}
export default PromotShareMcpServer;
//# sourceMappingURL=index.d.ts.map