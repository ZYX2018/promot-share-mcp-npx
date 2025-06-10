"use strict";
/**
 * Promot Share API 客户端
 * 负责与现有的 Promot Share 服务器 API 通信
 * 处理认证头和请求转发
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotShareApiClient = void 0;
const logger_js_1 = require("./logger.js");
/**
 * API 客户端类
 * 封装对 Promot Share 后端 API 的调用
 */
class PromotShareApiClient {
    baseUrl;
    apiKey;
    userToken;
    timeout;
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, ''); // 移除末尾斜杠
        this.apiKey = config.apiKey;
        this.userToken = config.userToken;
        this.timeout = config.timeout || 30000;
        if (!this.apiKey) {
            throw new Error('API Key 是必需的');
        }
        logger_js_1.logger.info(`🔗 API 客户端初始化: ${this.baseUrl}`);
    }
    /**
     * 获取基础 URL
     */
    getBaseUrl() {
        return this.baseUrl;
    }
    /**
     * 创建通用请求方法
     */
    async makeRequest(endpoint, method = 'POST', body) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'User-Agent': 'promot-share-mcp-client/1.0.0',
        };
        // 如果有额外的用户令牌，也可以添加（通常不需要）
        if (this.userToken && this.userToken !== this.apiKey) {
            headers['X-User-Token'] = this.userToken;
        }
        const requestInit = {
            method,
            headers,
            // 设置超时
            signal: AbortSignal.timeout(this.timeout),
        };
        if (body && method === 'POST') {
            requestInit.body = JSON.stringify(body);
        }
        logger_js_1.logger.debug(`📡 API 请求: ${method} ${url}`, body);
        try {
            const response = await fetch(url, requestInit);
            const responseData = await response.json();
            if (!response.ok) {
                logger_js_1.logger.error(`❌ API 请求失败: ${response.status} ${response.statusText}`, responseData);
                const errorMessage = responseData?.message || response.statusText;
                throw new Error(`API 请求失败: ${errorMessage}`);
            }
            logger_js_1.logger.debug(`✅ API 响应成功`, responseData);
            return responseData;
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    logger_js_1.logger.error(`⏰ API 请求超时: ${url}`);
                    throw new Error('请求超时，请检查网络连接或服务器状态');
                }
                if (error.message.includes('ECONNREFUSED')) {
                    logger_js_1.logger.error(`🔌 无法连接到服务器: ${url}`);
                    throw new Error('无法连接到 Promot Share 服务器，请检查服务器是否运行');
                }
            }
            logger_js_1.logger.error(`💥 API 请求异常: ${url}`, error);
            throw error;
        }
    }
    /**
     * 搜索提示词
     */
    async searchPrompts(params) {
        logger_js_1.logger.info(`🔍 搜索提示词: "${params.query}"`);
        const body = {
            method: 'search_prompts',
            params: {
                query: params.query || '',
                category: params.category,
                limit: params.limit || 10,
                sortBy: params.sortBy || 'relevance',
            },
        };
        return await this.makeRequest('/sse', 'POST', body);
    }
    /**
     * 获取提示词详情
     */
    async getPromptDetail(id) {
        logger_js_1.logger.info(`📝 获取提示词详情: ${id}`);
        const body = {
            method: 'get_prompt_detail',
            params: { id },
        };
        return await this.makeRequest('/sse', 'POST', body);
    }
    /**
     * 创建提示词
     */
    async createPrompt(params) {
        logger_js_1.logger.info(`✨ 创建提示词: "${params.title}"`);
        const body = {
            method: 'create_prompt',
            params: {
                title: params.title,
                chineseDesc: params.chineseDesc,
                englishDesc: params.englishDesc,
                category: params.category,
                tags: params.tags || [],
            },
        };
        return await this.makeRequest('/sse', 'POST', body);
    }
    /**
     * 点赞提示词
     */
    async likePrompt(params) {
        logger_js_1.logger.info(`👍 ${params.action === 'unlike' ? '取消点赞' : '点赞'}提示词: ${params.promptId}`);
        const body = {
            method: 'like_prompt',
            params: {
                promptId: params.promptId,
                action: params.action || 'like',
            },
        };
        return await this.makeRequest('/sse', 'POST', body);
    }
    /**
     * 评论提示词
     */
    async commentPrompt(params) {
        logger_js_1.logger.info(`💬 评论提示词: ${params.promptId}`);
        const body = {
            method: 'comment_prompt',
            params: {
                promptId: params.promptId,
                content: params.content,
                rating: params.rating,
            },
        };
        return await this.makeRequest('/sse', 'POST', body);
    }
    /**
     * 获取分类列表
     */
    async listCategories() {
        logger_js_1.logger.info('📂 获取分类列表');
        const body = {
            method: 'list_categories',
            params: {},
        };
        return await this.makeRequest('/sse', 'POST', body);
    }
    /**
     * 获取用户收藏
     */
    async getUserFavorites() {
        logger_js_1.logger.info('⭐ 获取用户收藏');
        const body = {
            method: 'get_user_favorites',
            params: {},
        };
        return await this.makeRequest('/sse', 'POST', body);
    }
    /**
     * 健康检查
     */
    async healthCheck() {
        try {
            logger_js_1.logger.info('🏥 执行健康检查');
            const response = await fetch(`${this.baseUrl}/api/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000), // 5秒超时
            });
            const isHealthy = response.ok;
            logger_js_1.logger.info(`💗 服务器健康状态: ${isHealthy ? '健康' : '异常'}`);
            return isHealthy;
        }
        catch (error) {
            logger_js_1.logger.warn('健康检查失败:', error);
            return false;
        }
    }
}
exports.PromotShareApiClient = PromotShareApiClient;
//# sourceMappingURL=api-client.js.map