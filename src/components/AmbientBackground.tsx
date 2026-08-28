/**
 * 首页氛围质感（ui.md §3.5）：L1 聚光灯 + L2 坐标网格 + L3 微噪点 + L4 扁平底板。
 * 纯 CSS / SVG，无动画、无实体灯具。
 */
export default function AmbientBackground() {
  return (
    <>
      {/* Layer 1 · 径向聚光灯 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'var(--ambient-spotlight)' }}
      />

      {/* Layer 2 · 极淡坐标网格 48px */}
      <svg
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        style={{ opacity: 'var(--ambient-grid-opacity)' }}
      >
        <defs>
          <pattern
            id="ambient-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="var(--hairline)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ambient-grid)" />
      </svg>

      {/* Layer 3 · 微噪点 feTurbulence */}
      <svg
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full mix-blend-multiply dark:mix-blend-screen"
        style={{ opacity: 'var(--ambient-noise-opacity)' }}
      >
        <defs>
          <filter id="ambient-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#ambient-grain)" />
      </svg>

      {/* Layer 4 · 扁平底板（仅 ≥1024，无 3D / 无檐口） */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-10 inset-y-16 z-[1] hidden rounded-[24px] bg-surface lg:block"
        style={{ boxShadow: 'inset 0 1px 0 var(--hairline)' }}
      />
    </>
  )
}
