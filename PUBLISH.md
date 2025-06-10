# 📦 NPM 发布指南

## ✅ 任何人都可以发布到 NPM！

### 🚀 发布步骤

#### 1. 注册 NPM 账号
```bash
# 访问 https://www.npmjs.com 注册账号
# 验证邮箱地址（必须）
```

#### 2. 本地登录 NPM
```bash
npm login
# 输入用户名、密码、邮箱
# 可能需要输入邮箱验证码
```

#### 3. 检查登录状态
```bash
npm whoami
# 应该显示你的用户名
```

#### 4. 发布包
```bash
cd /home/zhangyx-v/codes/cursor/promot-share-mcp-npx

# 确保已构建
yarn build

# 发布（第一次发布）
npm publish --access public

# 后续更新版本发布
npm version patch  # 增加补丁版本
npm publish
```

### 🔒 作用域包的优势

我们使用 `@zhangyx-v/promot-share-mcp-server` 的优势：

1. **避免包名冲突** - 不用担心被占用
2. **归属清晰** - 明确是你发布的包
3. **可以重名** - 其他人可以发布 `@their-name/promot-share-mcp-server`
4. **免费使用** - 公开作用域包完全免费

### 📋 发布检查清单

- [ ] 验证了 NPM 邮箱
- [ ] 项目构建成功 (`yarn build`)
- [ ] 包名使用作用域格式 (`@zhangyx-v/xxx`)
- [ ] README.md 完整
- [ ] package.json 信息正确
- [ ] 本地测试通过

### 🌍 发布后的使用方式

发布成功后，其他用户可以：

```bash
# 直接运行
npx @zhangyx-v/promot-share-mcp-server

# 全局安装
npm install -g @zhangyx-v/promot-share-mcp-server
promot-share-mcp

# 在 Cursor 中配置
{
  "mcpServers": {
    "promot-share": {
      "command": "npx",
      "args": ["@zhangyx-v/promot-share-mcp-server"],
      "env": {
        "PROMOT_SHARE_API_URL": "https://promot-share.zhangyx-v.cn",
        "API_KEY": "their_api_key_here"
      }
    }
  }
}
```

### 🔄 版本管理

```bash
# 补丁版本（修复bug）: 1.0.0 -> 1.0.1
npm version patch

# 小版本（新功能）: 1.0.1 -> 1.1.0
npm version minor

# 大版本（破坏性变更）: 1.1.0 -> 2.0.0
npm version major

# 手动设置版本
npm version 1.2.3

# 发布更新
npm publish
```

### ⚠️ 注意事项

1. **包一旦发布就是公开的** - 任何人都可以下载使用
2. **版本号不能重复** - 发布后的版本无法修改
3. **48小时内可以撤销** - 超过48小时无法删除版本
4. **API Key 安全** - 不要在代码中硬编码 API Key

### 🎯 推荐发布策略

1. **先发布 beta 版本测试**
```bash
npm version 1.0.0-beta.1
npm publish --tag beta
```

2. **测试没问题后发布正式版**
```bash
npm version 1.0.0
npm publish
```

3. **设置 npm tag**
```bash
npm publish --tag latest  # 默认
npm publish --tag beta     # 测试版
```

### 📊 发布后管理

- **查看包信息**: `npm view @zhangyx-v/promot-share-mcp-server`
- **查看下载统计**: https://www.npmjs.com/package/@zhangyx-v/promot-share-mcp-server
- **更新描述**: 在 npmjs.com 网站上编辑

发布成功后，你的包就可以被全世界的开发者使用了！🌍✨ 