import { useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'

type ShelfHeroProps = {
  gameCount: number
  shotCount: number
  categoryCount: number
  gameIds: string[]
}

/** 左侧叙事 Hero：标题 / 统计 / 随机封面 */
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
    <aside className="flex h-full flex-col gap-8 lg:max-w-[280px] lg:pt-2">
      <div>
        <h1 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-fg sm:text-4xl lg:text-[2.35rem]">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
          {t('heroBody')}
        </p>
      </div>

      <ul className="flex flex-col gap-3 p-0">
        <Stat icon="▣" label={t('statGames')} value={gameCount} />
        <Stat icon="▤" label={t('statShots')} value={shotCount} />
        {/* <Stat icon="▥" label={t('statCategories')} value={categoryCount} /> */}
      </ul>

      <button
        type="button"
        onClick={goRandom}
        disabled={gameIds.length === 0}
        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-surface/40 px-4 py-3 text-sm font-medium text-fg transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span aria-hidden>⇄</span>
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
  icon: string
  label: string
  value: number
}) {
  return (
    <li className="flex list-none items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl border border-hairline bg-surface/40 text-sm text-accent">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-mono text-sm tabular-nums text-fg">
          {value.toLocaleString()}
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
      </span>
    </li>
  )
}
