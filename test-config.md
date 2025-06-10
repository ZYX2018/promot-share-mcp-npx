# MCP NPX 服务器测试指南

## 🧪 测试配置

### 方式一：使用 npx 运行（推荐）

```bash
# 设置环境变量
export PROMOT_SHARE_API_URL="https://promot-share.zhangyx-v.cn"
export API_KEY="your_api_key_here"
export DEBUG="true"

# 运行 MCP 服务器
npx @zhangyx-v/promot-share-mcp-server
```

### 方式二：本地测试

```bash
# 在项目目录下
cd /home/zhangyx-v/codes/cursor/promot-share-mcp-npx

# 创建 .env 文件
cat > .env << 'EOF'
PROMOT_SHARE_API_URL=https://promot-share.zhangyx-v.cn
API_KEY=your_actual_api_key_here
DEBUG=true
REQUEST_TIMEOUT=30000
EOF

# 运行开发版本
yarn dev
```

## 🔧 Cursor 配置

### 旧版本 Cursor 配置 (无法携带请求头)

在 Cursor 设置中添加：

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

### 新版本 Cursor 配置 (支持请求头)

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

## 🔍 验证方式

1. **检查服务器启动**：运行后应看到类似日志：
   ```
   [2024-01-01T12:00:00.000Z] [INFO] 🚀 Promot Share MCP 服务器已启动
   [2024-01-01T12:00:00.000Z] [INFO] 📡 API 地址: https://promot-share.zhangyx-v.cn
   [2024-01-01T12:00:00.000Z] [INFO] ✨ 准备接收 Cursor 连接...
   ```

2. **在 Cursor 中测试**：
   - 重启 Cursor
   - 在聊天中输入：@promot-share 搜索与"写代码注释"相关的提示词
   - 应该看到搜索结果

## 🐛 常见问题

- **认证失败**：检查 API_KEY 是否正确
- **连接失败**：检查 PROMOT_SHARE_API_URL 是否可访问
- **Cursor 无法识别**：确认 MCP 服务器配置格式正确

## 📝 API Key 获取

请从 Promot Share 平台的用户设置中获取有效的 API Key。 