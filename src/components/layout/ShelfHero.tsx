import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/utils/cn'

const HERO_SESSION_KEY = 'gameshot-hero-entered'

type ShelfHeroProps = {
  gameCount: number
  shotCount: number
  categoryCount: number
  gameIds: string[]
  compact?: boolean
}

function readHeroEntered(): boolean {
  try {
    return sessionStorage.getItem(HERO_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

/** Arcade Archive · 左侧宽叙事栏 */
export function ShelfHero({
  gameCount,
  shotCount,
  categoryCount,
  gameIds,
  compact = false,
}: ShelfHeroProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [alreadyEntered] = useState(readHeroEntered)
  const runEntrance = !alreadyEntered && !reduceMotion

  useEffect(() => {
    if (alreadyEntered || reduceMotion) return
    try {
      sessionStorage.setItem(HERO_SESSION_KEY, '1')
    } catch {
      /* ignore */
    }
  }, [alreadyEntered, reduceMotion])

  const goRandom = () => {
    if (gameIds.length === 0) return
    const id = gameIds[Math.floor(Math.random() * gameIds.length)]
    navigate(`/game/${id}`)
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: runEntrance ? 0.09 : 0,
      },
    },
  }

  const itemVariants = {
    hidden: runEntrance ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.34, ease: 'easeOut' as const },
    },
  }

  return (
    <motion.aside
      className={cn(
        'shelf-hero relative z-[2] flex w-full min-w-0 flex-col',
        compact ? 'shelf-hero--compact gap-6' : 'gap-8 lg:pt-1',
      )}
      initial={runEntrance ? 'hidden' : false}
      animate="show"
      variants={containerVariants}
    >
      <motion.div className="max-w-xl" variants={itemVariants}>
        <h1 className="type-hero type-metal text-balance text-[2rem] leading-[1.25] sm:text-[2.35rem] lg:text-[2.55rem] xl:text-[2.75rem]">
          {t('heroTitle')}
        </h1>
        <p className="hero-kicker mt-4">{t('heroKicker')}</p>
        <span className="hero-rule" aria-hidden />
        <p className="max-w-md text-pretty text-[14px] leading-relaxed text-muted sm:text-[15px]">
          {t('heroBody')}
        </p>
      </motion.div>

      <motion.ul
        className={cn(
          'grid list-none gap-5 p-0',
          categoryCount > 1 ? 'grid-cols-3' : 'grid-cols-2 max-w-sm',
        )}
        variants={itemVariants}
      >
        <Stat icon={<CabinetIcon />} label={t('statGames')} value={gameCount} />
        <Stat icon={<ShotIcon />} label={t('statShots')} value={shotCount} />
        {categoryCount > 1 && (
          <Stat
            icon={<TagIcon />}
            label={t('statCategories')}
            value={categoryCount}
          />
        )}
      </motion.ul>

      <motion.button
        type="button"
        onClick={goRandom}
        disabled={gameIds.length === 0}
        className="inline-flex h-11 w-fit min-w-[10.5rem] items-center justify-center gap-2 rounded-md border border-accent bg-transparent px-5 text-[14px] font-semibold text-accent transition-colors hover:bg-accent hover:text-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-40"
        variants={itemVariants}
      >
        {t('randomCover')}
        <span aria-hidden className="text-base leading-none">
          →
        </span>
      </motion.button>
    </motion.aside>
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
    <li className="flex list-none flex-col gap-2">
      <span className="text-accent opacity-85">{icon}</span>
      <span className="type-stat type-metal text-[1.65rem] leading-none tabular-nums sm:text-2xl">
        {value.toLocaleString()}
      </span>
      <span className="text-[12px] leading-relaxed text-muted">{label}</span>
    </li>
  )
}

function CabinetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="6"
        y="2.5"
        width="12"
        height="19"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="5"
        width="8"
        height="6"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
      <path
        d="M9.5 19h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ShotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m13 15 2.2-2.5a1 1 0 0 1 1.5 0L19 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.6 13.4 12.7 21.3a1 1 0 0 1-1.4 0l-8.6-8.6a2 2 0 0 1-.6-1.4V4a1 1 0 0 1 1-1h7.3a2 2 0 0 1 1.4.6l8.6 8.6a1 1 0 0 1 0 1.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
    </svg>
  )
}
