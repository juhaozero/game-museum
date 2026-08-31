/** 影院地光背景（Generated_image）：暗角 + 中段地光 + 噪点 */
export default function AmbientBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'var(--ambient-base)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'var(--ambient-horizon)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'var(--ambient-spotlight)' }}
      />
      <svg
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full mix-blend-multiply dark:mix-blend-screen"
        style={{ opacity: 'var(--ambient-noise-opacity)' }}
      >
        <defs>
          <filter id="ambient-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#ambient-grain)" />
      </svg>
    </>
  )
}
