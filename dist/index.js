#!/usr/bin/env node
"use strict";
/**
 * Promot Share MCP Server
 * 标准 MCP 服务器，作为 Promot Share API 的代理层
 * 解决旧版本 Cursor 无法携带请求头的问题
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const dotenv = __importStar(require("dotenv"));
const api_client_js_1 = require("./api-client.js");
const logger_js_1 = require("./logger.js");
// 加载环境变量
dotenv.config();
/**
 * MCP 服务器类
 * 提供标准 MCP 协议接口，内部调用 Promot Share API
 */
class PromotShareMcpServer {
    server;
    apiClient;
    constructor() {
        this.server = new index_js_1.Server({
            name: 'promot-share-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // 初始化 API 客户端
        this.apiClient = new api_client_js_1.PromotShareApiClient({
            baseUrl: process.env.PROMOT_SHARE_API_URL || 'http://localhost:3000',
            apiKey: process.env.API_KEY || '',
            userToken: process.env.USER_TOKEN,
            timeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
        });
        this.setupTools();
        this.setupErrorHandling();
    }
    /**
     * 设置 MCP 工具
     */
    setupTools() {
        // 注册工具列表处理器
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            logger_js_1.logger.info('📋 获取工具列表');
            return {
                tools: [
                    {
                        name: 'search_prompts',
                        description: '智能搜索提示词，根据需求描述匹配最相关的提示词',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: '搜索关键词或需求描述',
                                },
                                category: {
                                    type: 'string',
                                    description: '提示词分类',
                                },
                                limit: {
                                    type: 'number',
                                    description: '返回结果数量限制，默认10',
                                    default: 10,
                                },
                                sortBy: {
                                    type: 'string',
                                    enum: ['relevance', 'popularity', 'recent'],
                                    description: '排序方式：相关性、热度、时间',
                                    default: 'relevance',
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'get_prompt_detail',
                        description: '获取提示词详细信息',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: '提示词ID',
                                },
                            },
                            required: ['id'],
                        },
                    },
                    {
                        name: 'create_prompt',
                        description: '创建新的提示词，分享你觉得有用的提示词给其他用户',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                title: {
                                    type: 'string',
                                    description: '提示词标题（简洁明了）',
                                    maxLength: 100,
                                },
                                chineseDesc: {
                                    type: 'string',
                                    description: '中文提示词内容，完整的中文版本提示词，用户会复制使用',
                                    maxLength: 10000,
                                },
                                englishDesc: {
                                    type: 'string',
                                    description: '英文提示词内容，完整的英文版本提示词，用户会复制使用',
                                    maxLength: 10000,
                                },
                                category: {
                                    type: 'string',
                                    enum: [
                                        'writing', 'article', 'programming', 'ai', 'life', 'business',
                                        'marketing', 'psychology', 'philosophy', 'game', 'education',
                                        'academic', 'tool', 'analysis', 'language', 'creative', 'eval',
                                        'copywriting', 'enterprise', 'seo', 'doctor', 'finance', 'music',
                                        'industry', 'social', 'cursor', 'product', 'testing', 'ai-art'
                                    ],
                                    description: '提示词分类',
                                },
                                tags: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    description: '标签列表，帮助用户更好地发现这个提示词',
                                    maxItems: 10,
                                },
                            },
                            required: ['title', 'chineseDesc', 'englishDesc', 'category'],
                        },
                    },
                    {
                        name: 'like_prompt',
                        description: '为提示词点赞或取消点赞',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                promptId: {
                                    type: 'string',
                                    description: '提示词ID',
                                },
                                action: {
                                    type: 'string',
                                    enum: ['like', 'unlike'],
                                    description: '操作类型：点赞或取消点赞',
                                    default: 'like',
                                },
                            },
                            required: ['promptId'],
                        },
                    },
                    {
                        name: 'comment_prompt',
                        description: '为提示词添加评论和反馈',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                promptId: {
                                    type: 'string',
                                    description: '提示词ID',
                                },
                                content: {
                                    type: 'string',
                                    description: '评论内容',
                                },
                                rating: {
                                    type: 'number',
                                    description: '评分（1-5分）',
                                    minimum: 1,
                                    maximum: 5,
                                },
                            },
                            required: ['promptId', 'content'],
                        },
                    },
                    {
                        name: 'list_categories',
                        description: '获取所有可用的提示词分类',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'get_user_favorites',
                        description: '获取用户收藏的提示词列表',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                ],
            };
        });
        // 注册工具调用处理器
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            logger_js_1.logger.info(`🔧 调用工具: ${name}`, args);
            try {
                let result;
                switch (name) {
                    case 'search_prompts':
                        result = await this.apiClient.searchPrompts(args);
                        break;
                    case 'get_prompt_detail':
                        result = await this.apiClient.getPromptDetail(args?.id);
                        break;
                    case 'create_prompt':
                        result = await this.apiClient.createPrompt(args);
                        break;
                    case 'like_prompt':
                        result = await this.apiClient.likePrompt(args);
                        break;
                    case 'comment_prompt':
                        result = await this.apiClient.commentPrompt(args);
                        break;
                    case 'list_categories':
                        result = await this.apiClient.listCategories();
                        break;
                    case 'get_user_favorites':
                        result = await this.apiClient.getUserFavorites();
                        break;
                    default:
                        throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `未知工具: ${name}`);
                }
                // 格式化返回结果
                return {
                    content: [
                        {
                            type: 'text',
                            text: this.formatToolResult(result, name),
                        },
                    ],
                };
            }
            catch (error) {
                logger_js_1.logger.error(`工具调用失败 (${name}):`, error);
                if (error instanceof types_js_1.McpError) {
                    throw error;
                }
                throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `工具执行失败: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * 格式化工具执行结果
     */
    formatToolResult(result, toolName) {
        try {
            // 如果结果包含 cursorGuidance，优先显示
            if (result.cursorGuidance) {
                return `${result.cursorGuidance}\n\n📊 详细数据：\n${JSON.stringify(result.data || result, null, 2)}`;
            }
            // 根据不同工具定制化格式
            switch (toolName) {
                case 'search_prompts':
                    if (result.data && Array.isArray(result.data)) {
                        const prompts = result.data;
                        let output = `🎯 找到 ${prompts.length} 个相关提示词：\n\n`;
                        prompts.forEach((prompt, index) => {
                            output += `${index + 1}. **${prompt.title}**\n`;
                            output += `   ID: ${prompt.id}\n`;
                            output += `   分类: ${prompt.category}\n`;
                            output += `   标签: ${prompt.tags?.join(', ') || '无'}\n`;
                            output += `   使用量: ${prompt.usage || 0} | 收藏: ${prompt.favoriteCount || 0} | 点赞: ${prompt.likes || 0}\n`;
                            if (prompt.chineseDesc) {
                                const preview = prompt.chineseDesc.slice(0, 100);
                                output += `   预览: ${preview}${prompt.chineseDesc.length > 100 ? '...' : ''}\n`;
                            }
                            output += '\n';
                        });
                        return output;
                    }
                    break;
                case 'get_prompt_detail':
                    if (result.data) {
                        const prompt = result.data;
                        return `📝 提示词详情：

**${prompt.title}**
分类：${prompt.category}
标签：${prompt.tags?.join(', ') || '无'}

📊 统计信息：
- 使用量：${prompt.usage || 0}
- 收藏数：${prompt.favoriteCount || 0}  
- 点赞数：${prompt.likes || 0}
- 评论数：${prompt.comments || 0}

🇨🇳 中文版本：
${prompt.chineseDesc}

🇺🇸 英文版本：
${prompt.englishDesc}

⏰ 创建时间：${prompt.createdAt}
⏰ 更新时间：${prompt.updatedAt}`;
                    }
                    break;
                case 'create_prompt':
                    if (result.success) {
                        return `✅ 提示词创建成功！

🎉 "${result.data?.title}" 已成功添加到平台
📂 分类：${result.data?.category}
🏷️ 标签：${result.data?.tags?.join(', ') || '无'}

${result.guidance || '感谢你为社区贡献内容！'}`;
                    }
                    break;
                case 'list_categories':
                    if (result.data && Array.isArray(result.data)) {
                        let output = '📂 可用分类列表：\n\n';
                        result.data.forEach((cat) => {
                            output += `${cat.emoji || '📁'} **${cat.label}** (${cat.key})\n`;
                        });
                        return output;
                    }
                    break;
            }
            // 默认格式化
            return JSON.stringify(result, null, 2);
        }
        catch (error) {
            logger_js_1.logger.warn('结果格式化失败，返回原始数据:', error);
            return JSON.stringify(result, null, 2);
        }
    }
    /**
     * 设置错误处理
     */
    setupErrorHandling() {
        this.server.onerror = (error) => {
            logger_js_1.logger.error('MCP 服务器错误:', error);
        };
        process.on('SIGINT', async () => {
            logger_js_1.logger.info('🛑 正在关闭 MCP 服务器...');
            await this.server.close();
            process.exit(0);
        });
    }
    /**
     * 启动服务器
     */
    async start() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        logger_js_1.logger.info('🚀 Promot Share MCP 服务器已启动');
        logger_js_1.logger.info(`📡 API 地址: ${this.apiClient.getBaseUrl()}`);
        logger_js_1.logger.info('✨ 准备接收 Cursor 连接...');
    }
}
// 启动服务器
if (require.main === module) {
    const server = new PromotShareMcpServer();
    server.start().catch((error) => {
        logger_js_1.logger.error('服务器启动失败:', error);
        process.exit(1);
    });
}
exports.default = PromotShareMcpServer;
//# sourceMappingURL=index.js.map