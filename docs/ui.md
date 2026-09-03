# GameShot Museum — UI 设计稿（实现同步）

> **版本**：v3.9 · Arcade Archive（街机馆藏）  
> 气质：**深色馆藏为主** · 浅色为冷 slate 日间展厅（env 可关）· 深靛柜体 · 街机指示铜 · 卡带脊线 + 底部灯条 · marquee 顶灯。  
> 顶栏：**方案 B** 薄品牌灯箱（铜金品牌行 + 馆藏副标）+ **右上搜索**（非货架路由禁用）。以本文件与线上实现为准。

---

## 1. 设计结论

私人游戏截图博物馆走 **街机馆 / 玩家档案** 路线。默认 **深色馆藏模式**；浅色由 `PUBLIC_ENABLE_LIGHT_MODE` 控制。

左侧 Hero 讲故事与数据，右侧是卡带式封面墙。点封面进截图展墙，再进 Lightbox。

**记忆锚点（去 logo 仍可辨）**：

1. 封面 **左侧脊线** + **底部灯条 / 外置柔光**（静默 · hover 满亮）
2. Filmstrip **marquee 顶灯条**（Structure 静态弱光，不呼吸）
3. 底部 **地平线铜光** + 四角暗角

**灯条三层（P0）**：

| 层 | 角色 | 规则 |
| --- | --- | --- |
| Ambient | 顶栏 `::before` | **全站唯一**持续呼吸 |
| Structure | filmstrip / 展墙页顶灯 | 静态 · `--lamp-structure-opacity` · 弱于 Ambient |
| Interactive | 卡带底灯 / 货架柔光 / 展墙卡片底灯 | 静默 rest · hover/focus 满亮 |

空态顶灯极弱，不与 Ambient 同相位抢戏。

**品牌层级（P0）**：顶栏品牌行 `type-metal` + `brandTagline` 副标；Hero 标题字号略收敛，避免压过品牌。

**字体双轨（P1）**：拉丁展示 **Archivo**（柜体工业感）+ 中文 **Noto Sans SC** + 正文拉丁 **IBM Plex Sans**。`--font-display` 真正独立于 `--font-sans`。

**封面墙节奏（P1）**：微错落 padding（`arcade-cell--nudge-*`）；`<36` 直出网格偶发 `arcade-cell--wide` 跨列；`≥36` 虚拟行保留微错落、不做跨列。

**浅色辨识（P1）**：抬高 `--cart-spine-mix` / 灯条 opacity；scanline 压到近无；柜体边更利。

**柜体控件（P2）**：CTA `.cabinet-cta`（边框 + 内侧铜光）；顶栏搜索 `.topbar-search-input` console inset。

**开柜衔接（P2）**：Lightbox 暗场略延长 + vignette `lightbox-settle`；展签略延迟入场（不抢 shared layout）。

**刻意不做**：玻璃胶囊顶栏、冷 teal SaaS、3D 透视银幕、HUD 角标漂浮光斑、打字机字体、Oxanium 窄体、米黄浅色反色、厚黑描边、多处同相位灯条呼吸。

---

## 2. 信息架构

```text
┌─ 薄品牌灯箱顶栏（Ambient 呼吸灯） ─────────────────────┐
│  GM  游戏截图博物馆          收藏室 · 高光展  ⌕  EN    │
│      玩家馆藏 · 截图收藏室                              │
└─────────────────────────────────────────────────────────┘
┌─ FEATURED marquee（Structure 顶灯 · compact） ──────────┐
│  ▌▌ ▌▌ ▌▌ ▌▌                                            │
└─────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────┐
│  Hero        │  展墙头（分类灯条）+ 卡带墙（≥36 虚拟行）   │
│  type-hero   │  ▌▌ ▌▌ ▌▌ ▌▌ ▌▌（微错落 · 偶发宽格）      │
│  统计(lg+)   │                                          │
│  CTA         │                                          │
└──────────────┴──────────────────────────────────────────┘
```

**移动首屏**：标题 + kicker + CTA；正文与统计仅 `lg+` 显示，优先露出封面墙。

---

## 3. 视觉系统

### 3.1 关键词

街机柜 · 卡带脊线 · 灯条 · marquee · 深色馆藏 · Archivo + Noto Sans SC  
**不是**：玻璃浮层、胶囊 pill、影院 3D、冷 teal、高饱和廉价黄、打字机、窄体游戏字、负字距。

### 3.2 色彩（深色为主 · 浅色日间展厅）

```css
.dark {
  --bg: #0b0e14;
  --accent: #d4a24a;
  --cabinet: #141925;
  --cart-spine-mix: 55%;
  --lamp-ambient-opacity: 0.85;
  --lamp-structure-opacity: 0.45;
  --lamp-interactive-rest: 0.36;
}
:root {
  --bg: #e8edf4;
  --accent: #8f6420;
  --cabinet: #e4eaf2;
  --cart-spine-mix: 78%;
  --lamp-structure-opacity: 0.68;
  --lamp-interactive-rest: 0.55;
  --ambient-scanline-opacity: 0.008;
}
```

默认主题：**`dark`**；`index.html` 预挂 `class="dark"` + 阻塞脚本。

### 3.3 字体

| 用途 | 类名 | 字族 |
| --- | --- | --- |
| 顶栏品牌 / Hero / kicker / 统计 | `.type-metal` / `.type-hero` / `.hero-kicker` / `.type-stat` | `--font-display`（Archivo → Noto SC） |
| 页面标题 | `.type-display` | `--font-display` |
| 宽距英文标签 | `.type-label-wide` | `--font-display` |
| 正文 / 中文标签 | `.type-label` · body | `--font-sans`（Noto SC → Plex） |

字距：Hero `0.03em` · display `0.06em` · label `0.10em`。  
**禁止**负 letter-spacing；不做 Oxanium / Sora。

### 3.4–3.5 形状 / 氛围

卡带脊线（`--cart-spine-mix`）+ 底灯、filmstrip 顶灯、地平线铜光 + 暗角 + 弱 scanline（浅色近无）。网格 `align-items: start` + 微错落；`content-visibility: auto`。圆角以 `4–6px` 柜体为准。

---

## 4. 组件规格（增量）

### 4.5 展墙

- 12 列不对称；首图 `exhibit-lead`
- caption 尊重 `showGameName` / `showFileName`（env）
- 空态：`ExhibitEmptyState`；骨架：`ExhibitSkeleton`

### 4.8 Lightbox

- `--lightbox-*` token；侧栏 rail + 移动端 dock
- 开柜：overlay ~280ms + `lightbox-settle` vignette；plaque delay ~120ms

### 4.9 VirtualArcadeGrid

- `< 36`：CSS grid + `arcade-grid--mason` 偶发宽格 + 换展 stagger
- `≥ 36`：行级虚拟列表 + 行内微错落 + 轻量 fade（不做跨列）

### 4.10 首页节奏

- 有 featured：`filmstrip--compact` + `arcade-stage--with-featured` + `ShelfHero compact`
- 分类 / 计数：`WallHeader`（无底部 sticky dock）

### 4.11 星标

- 精细指针 + hover：未收藏可隐藏至悬停
- 触控 / 粗指针：半透明常显

### 4.12 柜体控件

- CTA：`.cabinet-cta` / `.cabinet-cta--sm`（Hero「探索藏品」、空态动作）
- 顶栏搜索：`.topbar-search` + `.topbar-search-input`（console inset）；菜单内 `.menu-search-input`

---

## 5. 动效

| 场景 | 参数 |
| --- | --- |
| 进馆序幕 | Hero 错落 ~90ms（session 内只播一次） |
| 灯条呼吸 | **仅顶栏 Ambient** ~4s；Structure / Interactive 不呼吸 |
| 展墙换展 | 筛选 key：短淡出 → stagger ~55ms |
| 开柜入场 | 详情展签错落 + 网格 delay stagger |
| Lightbox 开柜 | overlay ~280ms + vignette settle ~420ms；plaque delay ~120ms |
| 封面 hover | tilt + lift（**无** image scale）；底灯满亮 |
| 展墙 / filmstrip hover | lift 或边框提亮（**无** image scale） |
| filmstrip | 横向 loop，hover pause |
| reduced-motion | 关闭位移、滚动与顶栏呼吸 |

---

## 6. 文件对照

```text
AmbientBackground.tsx
layout/TopBar.tsx · ShelfHero.tsx · WallHeader.tsx
gallery/GameBox.tsx · ScreenshotCard.tsx · FeaturedFilmstrip.tsx
gallery/VirtualArcadeGrid.tsx · ScreenshotGrid.tsx
ui/ExhibitEmptyState.tsx · ExhibitSkeleton.tsx · ShelfSkeleton.tsx · FavoriteStar.tsx · ImageWithState.tsx
lightbox/Lightbox.tsx
index.html · index.css · docs/ui.md
```

已移除未接线：`ShelfDock` · `CategoryChips` · `ShelfSearch`。

---

## 7. 状态清单

- [x] 深色馆藏默认（html 预挂 + 阻塞脚本）
- [x] 街机指示铜 + 地光 / 暗角
- [x] 卡带脊线 + 底灯记忆锚点
- [x] filmstrip marquee 顶灯
- [x] Noto Sans SC + 正字距分层
- [x] 浅色日间展厅（env 开关）
- [x] 展墙脊线 + 不对称构图
- [x] Lightbox token + 移动端展签
- [x] 空态 / 错误态柜体展签化
- [x] 二级页 ExhibitSkeleton
- [x] 首页 filmstrip + Hero 压缩节奏
- [x] 封面墙虚拟列表（≥36）+ content-visibility
- [x] Hero 进馆序幕 + 顶栏呼吸 + 展墙换展 + 开柜
- [x] 顶栏方案 B：薄品牌灯箱 + 右上搜索
- [x] 移动首屏压缩 Hero；减灯叠层；收敛 hover scale
- [x] 触屏星标常显；exhibition caption 跟 env
- [x] arcade-floor token / 骨架圆角 / 虚拟 fade / ImageWithState i18n
- [x] P0 灯条三层降噪（Ambient / Structure / Interactive）
- [x] P0 顶栏铜金品牌 + 副标；Hero 字号收敛
- [x] P1 字体双轨 Archivo + Noto SC
- [x] P1 封面墙微错落 + 偶发宽格
- [x] P1 浅色脊线 / 灯条 contrast + 减 scanline
- [x] P2 柜体 CTA + 顶栏搜索 console inset
- [x] P2 Lightbox 开柜短暗场 settle
