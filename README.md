# Promot Share MCP Server

🤖 **Promot Share MCP Server** 是一个标准的 MCP (Model Context Protocol) 服务器，为 Cursor IDE 提供 AI 提示词分享平台的功能。

## ✨ 功能特性

- 🔍 **智能搜索** - 根据需求描述匹配最相关的提示词
- 📝 **详情查看** - 获取提示词的完整信息  
- ✨ **内容创建** - 分享优质提示词给社区
- 👍 **互动功能** - 点赞、评论、收藏提示词
- 📂 **分类管理** - 18+ 专业分类体系
- 🔒 **安全认证** - API Key 认证保护

## 🚀 快速开始
api_key 需要 在https://promot-share.zhangyx-v.cn 注册登录后自行创建，注册登录过程需要激活码，可以邮箱联系zhangyx-vip@foxmail.com获取


## 🔧 Cursor IDE 配置

### 旧版本 Cursor (无法携带请求头)

在 Cursor 设置中添加 MCP 服务器：

```json
{
  "mcpServers": {
    "promot-share": {
      "command": "npx",
      "args": ["@zhangyx-v/promot-share-mcp-server"],
      "env": {
        "PROMOT_SHARE_API_URL": "https://promot-share.zhangyx-v.cn",
        "API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### 新版本 Cursor (支持请求头)

可以直接使用 SSE 方式连接原始服务器：

```json
{
  "mcpServers": {
    "promot-share": {
      "url": "https://promot-share.zhangyx-v.cn/sse",
      "headers": {
        "Authorization": "Bearer your_api_key_here"
      }
    }
  }
}
```

## 🛠️ 可用工具

### 🔍 search_prompts - 根据需求描述搜索最相关的提示词
根据需求描述搜索最相关的提示词

**参数：**
- `query` (必需) - 搜索关键词或需求描述
- `category` (可选) - 提示词分类
- `limit` (可选) - 返回结果数量，默认 10
- `sortBy` (可选) - 排序方式：relevance/popularity/recent

**示例：**
```
搜索与"写代码注释"相关的提示词
```

### 📝 get_prompt_detail - 获取详情
获取指定提示词的完整信息

**参数：**
- `id` (必需) - 提示词ID

### ✨ create_prompt - 创建提示词
向平台分享新的提示词

**参数：**
- `title` (必需) - 提示词标题
- `chineseDesc` (必需) - 中文提示词内容
- `englishDesc` (必需) - 英文提示词内容  
- `category` (必需) - 分类
- `tags` (可选) - 标签数组

### 👍 like_prompt - 点赞/取消点赞
为提示词点赞或取消点赞

**参数：**
- `promptId` (必需) - 提示词ID
- `action` (可选) - like/unlike，默认 like

### 💬 comment_prompt - 添加评论
为提示词添加评论和评分

**参数：**
- `promptId` (必需) - 提示词ID
- `content` (必需) - 评论内容
- `rating` (可选) - 评分 1-5



## 📂 支持的分类

- 💻 **编程开发** - `programming`, `cursor`, `product`, `testing`
- ✍️ **写作创作** - `writing`, `article`, `creative`, `copywriting`
- 🤖 **AI 相关** - `ai`, `ai-art`
- 💼 **商务职场** - `business`, `marketing`, `enterprise`, `seo`
- 🎓 **教育学术** - `education`, `academic`
- 🧠 **心理社交** - `psychology`, `philosophy`
- 🏠 **生活场景** - `life`
- 🛠️ **工具辅助** - `tool`, `game`
- 📊 **分析评估** - `analysis`, `eval`
- 🌐 **语言翻译** - `language`
- 💰 **金融投资** - `finance`, `doctor`
- 🎵 **创意娱乐** - `music`, `industry`, `social`

## 🐛 故障排除

### 连接失败
- 检查 `PROMOT_SHARE_API_URL` 是否正确
- 验证 API 服务器是否运行
- 确认网络连接正常

### 认证失败
- 检查 `API_KEY` 是否正确
- 确认 API Key 是否有效且未过期
- 验证用户权限

### 超时错误
- 增加 `REQUEST_TIMEOUT` 值
- 检查网络延迟
- 确认服务器响应正常

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

