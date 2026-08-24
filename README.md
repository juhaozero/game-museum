# GameShot Museum

私人游戏截图博物馆（纯前端静态站）。

- 设计：`docs/ui.md`
- 开发流程：`docs/dev.md`
- **数据流水线：`docs/manifest.md`**

## 开发

```bash
npm install
cp .env.example .env   # 可选：配置子路径
npm run dev
```

### 路由前缀（可选）

复制 `.env.example` 为 `.env`，设置 `PUBLIC_ROUTE_SUFFIX`：

```env
PUBLIC_ROUTE_SUFFIX=/museum
```

- 本地开发：`http://localhost:5173/museum`
- 打包后静态资源与路由均挂在该前缀下
- 根路径部署时留空即可

## 生成 manifest（阶段 1）

```bash
cp scripts/manifest.config.example.js scripts/manifest.config.local.js
# 编辑 COS 域名与目录布局

# 整理本地 Screenshots/ 后执行
npm run manifest
```

详见 [docs/manifest.md](./docs/manifest.md)。

## 构建

```bash
npm run build
npm run preview
```
