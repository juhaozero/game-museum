import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'

type ShelfHeroProps = {
  gameCount: number
  shotCount: number
  categoryCount: number
  gameIds: string[]
}

/** Arcade Archive · 左侧叙事 Hero（可读标题 + 打字机标签） */
export function ShelfHero({
  gameCount,
  shotCount,
  categoryCount,
  gameIds,
}: ShelfHeroProps) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const goRandom = () => {
    if (gameIds.length === 0) return
    const id = gameIds[Math.floor(Math.random() * gameIds.length)]
    navigate(`/game/${id}`)
  }

  return (
    <aside className="relative z-0 flex h-full flex-col gap-8 lg:max-w-[260px] lg:pt-6 lg:pr-2">
      <div className="rounded-md border border-[color:var(--cabinet-edge)] bg-[color:var(--cabinet)] p-4 lg:border-0 lg:bg-transparent lg:p-0">
        <p className="type-label mb-3 inline-flex items-center gap-2 text-accent">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-[1px] bg-accent"
          />
          {t('heroBadge')}
        </p>
        <h1 className="type-display text-balance text-3xl text-fg sm:text-4xl lg:text-[2.4rem]">
          {t('heroTitle')}
        </h1>
        <p className="mt-3 text-pretty text-[14px] leading-relaxed text-muted">
          {t('heroBody')}
        </p>
      </div>

      <ul className="flex flex-col gap-[18px] p-0">
        <Stat icon={<GamepadIcon />} label={t('statGames')} value={gameCount} />
        <Stat icon={<ShotIcon />} label={t('statShots')} value={shotCount} />
        {categoryCount > 1 && (
          <Stat
            icon={<TagIcon />}
            label={t('statCategories')}
            value={categoryCount}
          />
        )}
      </ul>

      <button
        type="button"
        onClick={goRandom}
        disabled={gameIds.length === 0}
        className="mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-accent bg-transparent px-4 text-[14px] font-semibold text-accent transition-colors hover:bg-accent hover:text-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShuffleIcon />
        {t('randomCover')}
      </button>
    </aside>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: number
}) {
  return (
    <li className="flex list-none items-center gap-3">
      <span className="text-accent">{icon}</span>
      <span className="flex flex-col">
        <span className="type-stat text-2xl leading-none text-fg">
          {value.toLocaleString()}
        </span>
        <span className="mt-1.5 text-[13px] leading-relaxed text-muted">
          {label}
        </span>
      </span>
    </li>
  )
}

function GamepadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 9.5h11a3.5 3.5 0 0 1 3.4 4.3l-.7 2.8A3 3 0 0 1 17.3 19H6.7a3 3 0 0 1-2.9-2.4l-.7-2.8A3.5 3.5 0 0 1 6.5 9.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 14h3M10 12.5v3M15.5 13h.01M17.5 15h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ShotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m13 15 2.2-2.5a1 1 0 0 1 1.5 0L19 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.6 13.4 12.7 21.3a1 1 0 0 1-1.4 0l-8.6-8.6a2 2 0 0 1-.6-1.4V4a1 1 0 0 1 1-1h7.3a2 2 0 0 1 1.4.6l8.6 8.6a1 1 0 0 1 0 1.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 3h5v5M21 3l-7 7M3 16l5-5M16 21h5v-5M21 21l-6.5-6.5M3 8l5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
