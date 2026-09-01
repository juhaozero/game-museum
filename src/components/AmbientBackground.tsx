/** Arcade Archive：深色馆藏底 + 地光 + 暗角 + CRT scanline */
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
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'var(--ambient-floor)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'var(--ambient-vignette)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 ambient-scanlines"
      />

      <svg
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full mix-blend-multiply dark:mix-blend-soft-light"
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
    </>
  )
}
