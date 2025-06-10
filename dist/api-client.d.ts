/**
 * Promot Share API 客户端
 * 负责与现有的 Promot Share 服务器 API 通信
 * 处理认证头和请求转发
 */
export interface ApiClientConfig {
    baseUrl: string;
    apiKey: string;
    userToken?: string;
    timeout?: number;
}
export interface SearchPromptsParams {
    query?: string;
    category?: string;
    limit?: number;
    sortBy?: 'relevance' | 'popularity' | 'recent';
}
export interface CreatePromptParams {
    title: string;
    chineseDesc: string;
    englishDesc: string;
    category: string;
    tags?: string[];
}
export interface LikePromptParams {
    promptId: string;
    action?: 'like' | 'unlike';
}
export interface CommentPromptParams {
    promptId: string;
    content: string;
    rating?: number;
}
/**
 * API 客户端类
 * 封装对 Promot Share 后端 API 的调用
 */
export declare class PromotShareApiClient {
    private baseUrl;
    private apiKey;
    private userToken?;
    private timeout;
    constructor(config: ApiClientConfig);
    /**
     * 获取基础 URL
     */
    getBaseUrl(): string;
    /**
     * 创建通用请求方法
     */
    private makeRequest;
    /**
     * 搜索提示词
     */
    searchPrompts(params: SearchPromptsParams): Promise<any>;
    /**
     * 获取提示词详情
     */
    getPromptDetail(id: string): Promise<any>;
    /**
     * 创建提示词
     */
    createPrompt(params: CreatePromptParams): Promise<any>;
    /**
     * 点赞提示词
     */
    likePrompt(params: LikePromptParams): Promise<any>;
    /**
     * 评论提示词
     */
    commentPrompt(params: CommentPromptParams): Promise<any>;
    /**
     * 获取分类列表
     */
    listCategories(): Promise<any>;
    /**
     * 获取用户收藏
     */
    getUserFavorites(): Promise<any>;
    /**
     * 健康检查
     */
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=api-client.d.ts.map