import { motion, useReducedMotion } from 'motion/react'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/utils/cn'

type FavoriteStarProps = {
  active: boolean
  onToggle: () => void
  className?: string
  /** 可见性：always | hover（父级需有 group） */
  visibility?: 'always' | 'hover'
}

/** 收藏星标：spring pop，仅小元素可用 spring */
export function FavoriteStar({
  active,
  onToggle,
  className,
  visibility = 'hover',
}: FavoriteStarProps) {
  const reduceMotion = useReducedMotion()
  const { t } = useI18n()

  return (
    <button
      type="button"
      aria-label={active ? t('unfavorite') : t('favorite')}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        'favorite-star inline-flex size-8 items-center justify-center rounded border border-[color:var(--cabinet-edge)] bg-bg-elevated/90 text-star shadow-sm transition-opacity duration-200',
        visibility === 'hover' &&
          !active &&
          'opacity-70 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 focus-visible:opacity-100',
        visibility === 'hover' && active && 'opacity-100',
        className,
      )}
    >
      <motion.span
        key={active ? 'on' : 'off'}
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { scale: 0.6, opacity: 0 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reduceMotion
            ? { duration: 0.15 }
            : { type: 'spring', stiffness: 500, damping: 30 }
        }
        className="inline-flex"
      >
        <StarIcon filled={active} />
      </motion.span>
    </button>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden
      className="size-4"
    >
      <path
        d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8 6.8 19.5l1-5.8L3.6 9.6l5.8-.8L12 3.5z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
