# GameShot Museum — UI 设计稿（实现同步）

> **版本**：v3.5 · Arcade Archive（街机馆藏）  
> 气质：**深色馆藏为主** · 浅色为冷 slate 日间展厅 · 深靛柜体 · 街机指示铜 · 卡带脊线 + 底部灯条 · marquee 顶灯。  
> 顶栏：**方案 B** 薄品牌灯箱（搜索下沉至 Hero）。历史预览稿已移除；以本文件与线上实现为准。

---

## 1. 设计结论

私人游戏截图博物馆走 **街机馆 / 玩家档案** 路线。默认 **深色馆藏模式**；浅色仅为次要对照。

左侧 Hero 讲故事与数据，右侧是卡带式封面墙。点封面进截图展墙，再进 Lightbox。

**记忆锚点（去 logo 仍可辨）**：

1. 封面 **左侧脊线** + **底部灯条 / 外置柔光**
2. Filmstrip **marquee 顶灯条**
3. 底部 **地平线铜光** + 四角暗角

**刻意不做**：玻璃胶囊顶栏、冷 teal SaaS、3D 透视银幕、HUD 角标漂浮光斑、打字机字体、Oxanium 窄体、米黄浅色反色、厚黑描边。

---

## 2. 信息架构

```text
┌─ 薄品牌灯箱顶栏（marquee · 无搜索） ────────────────────┐
│  GM  游戏截图博物馆   收藏室 · 高光展         EN  浅色   │
└─────────────────────────────────────────────────────────┘
┌─ FEATURED marquee（顶灯条 · compact） ──────────────────┐
│  ▌▌ ▌▌ ▌▌ ▌▌                                            │
└─────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────┐
│  Hero        │  卡带展墙（脊线 + 底灯 · ≥36 虚拟行）      │
│  type-hero   │  ▌▌ ▌▌ ▌▌ ▌▌ ▌▌                           │
│  搜索槽      │                                          │
│  统计 + CTA  │                                          │
└──────────────┴──────────────────────────────────────────┘
```

---

## 3. 视觉系统

### 3.1 关键词

街机柜 · 卡带脊线 · 灯条 · marquee · 深色馆藏 · Noto Sans SC  
**不是**：玻璃浮层、胶囊 pill、影院 3D、冷 teal、高饱和廉价黄、打字机、窄体游戏字、负字距。

### 3.2 色彩（深色为主 · 浅色日间展厅）

```css
.dark {
  --bg: #0b0e14;
  --accent: #d4a24a;
  --cabinet: #141925;
}
:root {
  --bg: #e8edf4;
  --accent: #8f6420;
  --cabinet: #e4eaf2;
  --ambient-horizon: /* accent ~20% */;
  --shelf-glow: /* accent 62% 混金 */;
}
```

默认主题：**`dark`（深色主场）**；`index.html` 预挂 `class="dark"` + 阻塞脚本。

### 3.3 字体

| 用途 | 类名 | 字距 |
| --- | --- | --- |
| Hero 铜金字 | `.type-metal` | 渐变 + 噪点 `background-clip: text` |
| Hero 大标题 | `.type-hero` | `0.03em` |
| 页面标题 | `.type-display` | `0.06em` |
| 标签 | `.type-label` | `0.10em` |
| 宽距标签（可选） | `.type-label-wide` | `0.14em` |

**禁止**负 letter-spacing；不做 Oxanium / Sora。

### 3.4–3.5 形状 / 氛围

卡带脊线 + 底灯、filmstrip 顶灯、地平线铜光 + 暗角 + 弱 scanline。网格项启用 `content-visibility: auto`。

---

## 4. 组件规格（增量）

### 4.5 展墙

- 12 列不对称；首图 `exhibit-lead`
- 空态：`ExhibitEmptyState`（柜体顶灯 + 底架纹理）
- 骨架：`ExhibitSkeleton`（`exhibit-frame--wall` 形态）

### 4.8 Lightbox

- `--lightbox-*` token；侧栏 rail + 移动端 dock

### 4.9 VirtualArcadeGrid

- 封面墙 `< 36`：直出 CSS grid
- `≥ 36`：`@tanstack/react-virtual` 行级窗口虚拟列表

### 4.10 首页节奏

- 有 featured 时：`filmstrip--compact` + `arcade-stage--with-featured` + `ShelfHero compact`

---

## 5. 动效

| 场景 | 参数 |
| --- | --- |
| 进馆序幕 | Hero 错落 ~90ms（session 内只播一次） |
| 灯条呼吸 | 顶栏 / filmstrip / 展墙头 ~4s；**卡带底灯仅 hover 满亮** |
| 展墙换展 | 筛选 key 变更：短淡出 → stagger 入场 ~55ms |
| 开柜入场 | 详情页展签错落 + 展墙网格 delay 后 stagger |
| 封面入场 | stagger ~55ms（虚拟列表关闭 stagger） |
| 封面 hover | translateY(-6px) + 灯条 |
| filmstrip | 横向 loop，hover pause |
| reduced-motion | 关闭位移、滚动与灯条呼吸 |

---

## 6. 文件对照

```text
AmbientBackground.tsx
layout/TopBar.tsx · ShelfHero.tsx · ShelfSearch.tsx · WallHeader.tsx · CategoryChips.tsx
gallery/GameBox.tsx · ScreenshotCard.tsx · FeaturedFilmstrip.tsx
gallery/VirtualArcadeGrid.tsx
ui/ExhibitEmptyState.tsx · ExhibitSkeleton.tsx · ShelfSkeleton.tsx
lightbox/Lightbox.tsx
index.css · docs/ui.md
```

---

## 7. 状态清单

- [x] 深色馆藏默认（html 预挂 + 阻塞脚本）
- [x] 街机指示铜 + 地光 / 暗角
- [x] 卡带脊线 + 底灯记忆锚点
- [x] filmstrip marquee 顶灯
- [x] Noto Sans SC + 正字距分层（type-hero / display / label）
- [x] 浅色日间展厅灯条 / 地光
- [x] 展墙脊线 + 不对称构图
- [x] Lightbox token + 移动端展签
- [x] 空态 / 错误态柜体展签化
- [x] 二级页 ExhibitSkeleton
- [x] 首页 filmstrip + Hero 压缩节奏
- [x] 封面墙虚拟列表（≥36）+ content-visibility
- [x] Hero 进馆序幕 + 灯条呼吸 + 展墙换展
- [x] 历史 cinema 预览稿移除 / 文档以本文件为准
- [x] 顶栏方案 B：薄品牌灯箱 + 搜索下沉 Hero
