# GameShot Museum — 整体 UI 设计稿 v2

> **v2 变更（相对 v1）**
>
> - 新增完整动效规格：入场 stagger、FLIP 布局过渡、共享元素过渡（盒 → 展墙 → Lightbox）、滚动 reveal、星标 pop、氛围呼吸。
> - 明确动效技术选型：Framer Motion + IntersectionObserver；hover 阴影改用伪元素 opacity 方案，守住「只动 transform/opacity」。
> - 状态清单补全：图片加载失败、数据加载态。
> - 对 v1「待确认」给出默认决策（Level2 16:9 裁切、盒脊启用），v1.1 可推翻。
> - 新增「参考与灵感」清单。

参考交互：[rgm.games/games](https://rgm.games/games)（按游戏陈列，点入再展开）。
气质：展陈式私人游戏馆 · 桌面优先 · 疏朗留白 · 实体盒装封面 · 游戏机感色调 · 明暗记住上次。无左侧分类栏；分类若保留，仅作顶栏轻量筛选（可 v1.1）。

## 1. 设计结论（一句话）

全宽展柜式浏览：货架上摆着一排实体游戏盒，盒间距宽松；点开某盒进入该游戏的截图展墙，再进 Lightbox。不是侧栏档案柜，也不是贴满截图的密集网格。动效是「展陈式」的：只在入场、换位、层级切换时给节奏，不炫技。

## 2. 信息架构

```
顶栏：搜索 / 我的收藏 / 密度 / 主题  （无左侧栏）
         │
         ▼
 ┌─────────────────────────┐
 │  Level 1 · 盒装展柜      │  一盒 = 一个游戏（实体盒样式）
 │  Game Box Shelf         │  疏朗网格，展陈感
 └───────────┬─────────────┘
             │ 点击盒子（共享元素过渡）
             ▼
 ┌─────────────────────────┐
 │  Level 2 · 截图展墙      │
 └───────────┬─────────────┘
             │ 点击截图（共享元素过渡）
             ▼
 ┌─────────────────────────┐
 │  Level 3 · Lightbox     │
 └─────────────────────────┘
```

| PRD 能力           | 本 UI 落点                                          |
| ------------------ | --------------------------------------------------- |
| 左侧分类树         | 去掉。分类不作为主导航；可选顶栏 Chip（非首版必须） |
| 搜索               | 顶栏，搜游戏名                                      |
| 虚拟列表 + 懒加载  | Level 1 盒墙 + Level 2 展墙                         |
| 密度 / 主题 / 收藏 | 顶栏；默认偏「宽松展陈」                            |
| Lightbox           | Level 3                                             |

## 3. 视觉方向

### 3.1 关键词

展陈 · 货架 · 实体盒 · 疏朗 · 主机石板色 · 克制节奏
不是：左侧分类导航、纸色档案、密铺截图墙、纯 flat 图卡、主机品牌 Logo。

### 3.2 色彩（Console Slate）

```css
:root {
  --bg: #e8eef2;
  --bg-elevated: #f2f6f8;
  --surface: #dce5eb;
  --text: #12181c;
  --text-muted: #5a6872;
  --hairline: rgba(18, 24, 28, 0.08);
  --accent: #2f7f8a;
  --accent-soft: rgba(47, 127, 138, 0.14);
  --star: #9a7b3c;
  --box-plastic: #b8c4cc; /* 盒体外壳塑胶感 */
  --box-inner: #0a0e12; /* 封面凹槽暗边 */
  --motif: rgba(47, 127, 138, 0.06);
}
.dark {
  --bg: #0e1418;
  --bg-elevated: #161d22;
  --surface: #1c252c;
  --text: #e8eef2;
  --text-muted: #8a9aa6;
  --hairline: rgba(232, 238, 242, 0.08);
  --accent: #5eb0bb;
  --accent-soft: rgba(94, 176, 187, 0.16);
  --star: #c4a56a;
  --box-plastic: #2a343c;
  --box-inner: #06080a;
  --motif: rgba(94, 176, 187, 0.07);
}
```

### 3.3 字体

UI：`IBM Plex Sans` / `Geist`
编目：`IBM Plex Mono` 小号
无大 Hero 标题

### 3.4 展陈节奏（疏朗）

主区左右 padding 桌面建议 `48–64px`，上下 `40–56px`。
盒与盒 gap 桌面建议 `28–40px`（宁疏勿密）。
默认密度 = 宽松 3 列（≥1440 可用 3–4；不要默认 5 列）。
密度档：大图 2 列 / 宽松 3 / 标准 4；**取消「紧凑 5 列」**或降为高级选项。

### 3.5 首页氛围图案

全宽主区背后淡手柄/主机线稿（无商标），低透明，不压盒子。呼吸参数见 6.2。

## 4. 桌面布局（无侧栏）

```
┌────────────────────────────────────────────────────────────┐
│  GameShot Museum    [ 搜索游戏…        ]  ♥  密度  主题   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│      ┌───┐        ┌───┐        ┌───┐                       │
│      │盒 │        │盒 │        │盒 │     ← 疏朗 3 列展柜   │
│      └───┘        └───┘        └───┘                       │
│                                                            │
│      ┌───┐        ┌───┐        ┌───┐                       │
│      │盒 │        │盒 │        │盒 │                       │
│      └───┘        └───┘        └───┘                       │
│                                                            │
│              （背后淡主机/手柄线稿）                          │
└────────────────────────────────────────────────────────────┘
```

### 4.1 顶栏

左：站点名小字（非 Hero）。
中：搜索。
右：我的收藏 · 密度 · 主题。
无分类侧栏、无大标题、无 CTA。

### 4.2 Level 1 · 实体盒装（核心）

必须是「盒子」，不是「单纯截图缩略图」。
结构（竖版约 135:170，无品牌标）：

```
        ▌← 可选：左侧窄脊（暗示厚度）【v2 默认启用】
┌───────┴────────────────────────┐
│  ░░░░░ 塑胶外壳边框 ░░░░░░░░░  │  ← box-plastic，可见厚度/圆角
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │     封面图（内凹 inset）   │  │  ← 四周留 8–12px 壳边，不要出血铺满
│  │                          │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ 游戏名                    │  │  ← 盒底标签区（也是壳的一部分）
│  │ 24 shots                  │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
     ▂▂  极轻接触阴影（货架感）
```

盒样式要点：

- 外壳：独立塑胶色边框 + 轻微内高光/外暗边，像实体盒子。
- 封面 inset：截图嵌在壳内，四周露壳，禁止整张图直接当卡片。
- 脊线（v2 默认要）：左侧 6–10px 深色窄条模拟书脊/盒脊，增强「盒子」体积感（CSS 即可，非 3D 模型）。
- 底托阴影：很轻的椭圆接触影，像放在展柜层板上。
- 禁止：平台 Logo、角标贴纸、纯 flat 无壳截图墙。

交互：

- Hover：整盒 `translateY(-4px)`，阴影略加强（伪元素 opacity 方案）；封面微 scale（壳不动或少动）。
- 点击 → `/game/:gameId`（共享元素过渡，见 6.2）。
- 封面选取：收藏优先 → 否则首张 → 失败则壳色+首字。

### 4.3 Level 2 · 截图展墙

顶栏：`← 馆藏 / 游戏名`
疏朗网格；v1 默认 16:9 裁切（原比例留 v1.1，见 11）；Hover 星标。
进入后可关掉首页氛围图案。

### 4.4 Lightbox

全屏查看；键盘切换；信息面板大屏右侧。

### 4.5 我的收藏

顶栏入口；跨游戏截图平铺；空状态一句文案即可。

## 5. 功能显隐

| 功能               | 呈现                |
| ------------------ | ------------------- |
| 左侧分类           | 移除                |
| 搜索 / 收藏 / 主题 | 顶栏                |
| 密度               | 顶栏；默认宽松 3 列 |
| 盒装元数据         | 盒底标签常显        |
| 截图元数据         | Hover / Lightbox    |
| 品牌标识           | 禁止                |

## 6. 动效规格（v2 核心）

### 6.1 原则

- 克制优先：只在入场、换位、层级切换时给节奏。
- **只动画 `transform` / `opacity`**。hover 阴影加强用「伪元素预渲染强阴影 + opacity 渐显」实现，不直接 transition `box-shadow`。
- 时长基准 `200–280ms`；布局类（FLIP）可放宽到 `300ms`；任何单项不超过 400ms。
- `prefers-reduced-motion` 时关闭入场 stagger / FLIP / 共享元素位移，仅保留必要 opacity 渐显。

### 6.2 分层动效表

| 层级 / 位置            | 效果                               | 参数                                                                           | 实现建议                                             |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Level 1 入场           | 盒子逐个 fade + 上浮               | opacity 0→1；translateY 12px→0；stagger 50ms；单盒 280ms ease-out              | Framer Motion `variants` + `staggerChildren`         |
| Level 1 Hover          | 整盒上浮；封面微缩放；盒脊高光扫过 | 盒 translateY(-4px)；封面 scale 1→1.03（壳不动）；高光条 transform 位移；200ms | CSS transition；阴影走伪元素 opacity                 |
| 密度 / 搜索 / 过滤切换 | FLIP：盒子平滑滑动归位，退场项淡出 | layout 300ms ease-out；退场 opacity 150ms                                      | Framer Motion `layout` + `AnimatePresence popLayout` |
| Level 1 → 2            | 共享元素：盒封面展开为展墙头图     | 220ms ease-out；页面背景同步 fade                                              | `layoutId`                                           |
| Level 2 滚动 reveal    | 截图进入视口 fade + 上浮           | stagger 40ms；translateY 16px→0；280ms                                         | IntersectionObserver 或 `whileInView`                |
| 图片加载完成           | 淡入（blur-up 可选）               | opacity 280ms                                                                  | `onLoad` + CSS                                       |
| 收藏星标               | 星形 pop                           | scale 0.6→1；spring stiffness 500 / damping 30                                 | `motion.span`                                        |
| Lightbox 进入          | 缩略图共享元素放大至全屏；遮罩淡入 | 220ms；遮罩 200ms                                                              | `layoutId`                                           |
| Lightbox 切换          | 左右滑 + fade                      | translateX ±24px；200ms                                                        | `AnimatePresence`                                    |
| Lightbox 信息面板      | 右侧滑入                           | translateX 16px→0；240ms；delay 60ms                                           | `motion.aside`                                       |
| 氛围线稿               | 极慢呼吸（可降级静态）             | opacity 0.5↔0.8；scale 1↔1.02；周期 10s                                        | CSS keyframes（transform/opacity）                   |
| 主题切换               | 颜色淡变（唯一例外项）             | color/background 200ms                                                         | CSS transition                                       |
| 全局                   | reduced-motion 回退                | 关闭位移类动画，保留 opacity                                                   | `useReducedMotion`                                   |

### 6.3 技术选型

- **Framer Motion**：`layoutId`（盒 → 展墙 → Lightbox 共享元素）、`layout`（FLIP 换位）、`AnimatePresence`（退场）。
- **IntersectionObserver**：Level 2 滚动 reveal，不引重库。
- **CSS transition / keyframes**：hover、氛围呼吸、主题淡变。

### 6.4 禁止的动效

- 弹跳 / 大弹性（spring 仅用于星标等小元素）。
- 全屏视差、鼠标跟随 3D、整卡 rotateX/rotateY。
- `width / height / top / left` 动画。
- 任何 > 400ms 的单项动画。

## 7. 响应式

| 断点      | 策略                     |
| --------- | ------------------------ |
| ≥1440     | 默认 3 列，gap 大        |
| 1024–1439 | 2–3 列                   |
| 768–1023  | 2 列                     |
| <768      | 1–2 列，顶栏工具收进菜单 |

## 8. 状态清单

- Level1 盒装展柜（疏朗）／入场 stagger 态
- 搜索无结果
- Level2 截图墙／滚动 reveal 态
- 密度 2/3/4 列（带 FLIP 过渡）
- 我的收藏（有 / 空）
- Lightbox
- Light / Dark
- 图片加载失败（占位图 + 可重试）
- manifest / 数据加载中（骨架或轻量 fade）

## 9. 与参考站

| 像 rgm               | 不像                           |
| -------------------- | ------------------------------ |
| 先按游戏实体再进内容 | 无侧栏分类密集导航             |
| 点条目看该作内容     | 内容是截图；展陈更疏；实体盒壳 |

## 10. 参考与灵感

| 类别            | 链接                                                                                                 | 看什么                                |
| --------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 交互结构        | https://rgm.games/games                                                                              | 先游戏实体再进内容                    |
| 封面墙手感      | https://backloggd.com                                                                                | 游戏封面网格陈列、hover               |
| 极简编目感      | https://steam250.com                                                                                 | 疏朗、mono 字体气质                   |
| 博物馆留白      | https://www.rijksmuseum.nl/en/collection                                                             | 图优先、加载淡入、展陈呼吸感          |
| 线上展厅        | https://www.mplus.org.hk                                                                             | gallery + collection + animation 组合 |
| 克制 hover      | https://tympanus.net/codrops/2014/06/19/ideas-for-subtle-hover-effects/                              | 3D translate / 微位移 hover 全集      |
| 网格入场 / 加载 | https://tympanus.net/Development/ImageGridEffects/                                                   | Level 2 展墙入场动画 demo             |
| FLIP 网格过渡   | https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/ | 密度切换 / 过滤换位动画               |
| 分层视差氛围    | http://www.firewatchgame.com                                                                         | 氛围层级处理（幅度降到 10% 再用）     |
| 灵感批量刷      | https://godly.website · https://landing.love · https://www.awwwards.com/websites/animation/          | 按 animation 标签筛高质量动效站       |

## 11. 待确认（含 v2 默认决策）

| 项          | v2 默认                | 备注                             |
| ----------- | ---------------------- | -------------------------------- |
| Level2 比例 | 16:9 裁切              | 原比例留 v1.1（需 masonry 布局） |
| 盒脊        | 启用（左 6–10px 窄脊） | 不喜欢可一键关                   |
| 氛围图案    | 极慢呼吸               | 性能敏感时降级静态               |
