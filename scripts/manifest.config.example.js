/**
 * 配置示例 — 复制为 manifest.config.local.js 后修改
 *
 *   cp scripts/manifest.config.example.js scripts/manifest.config.local.js
 */
export default {
  // 相对项目根
  sourceDir: 'Screenshots',

  // 或扫描项目外的目录（示例，按需取消注释并修改）
  // sourceDir: 'E:/tea/Screenshots',
  cosBaseUrl: 'https://my-bucket.cos.ap-shanghai.myqcloud.com',
  cosPathPrefix: 'Screenshots',
  outputFile: 'public/manifest.json',
  layout: 'category-first',
  defaultCategory: '未分类',
  gameCategories: {
    '超级马里奥兄弟': 'Famicom / NES',
    '塞尔达传说': 'Famicom / NES',
  },
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'],
  /**
   * 封面约定文件名；也可用游戏目录下 meta.json：
   * { "category": "RPG", "cover": "001.jpg" }
   */
  coverFileNames: [
    'cover.jpg',
    'cover.jpeg',
    'cover.png',
    'cover.webp',
  ],
  recursive: false,
}
