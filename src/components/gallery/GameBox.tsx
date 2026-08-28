import { motion } from 'motion/react'
import { ImageWithState } from '@/components/ui/ImageWithState'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/utils/cn'

type GameBoxProps = {
  gameId: string
  title: string
  shotCount: number
  coverUrl?: string
  className?: string
  /** 是否启用共享元素 layoutId（盒 → 展墙） */
  sharedTransition?: boolean
}

/**
 * Level 1 实体盒装（ui.md §4.2）
 * 塑胶壳 + 8px 左脊 + 封面 inset 10px + 盒底标签 + 接触影
 * Hover：整盒 -4px；阴影用伪元素 opacity；封面 scale 1.03，壳不动；200ms
 */
export function GameBox({
  gameId,
  title,
  shotCount,
  coverUrl,
  className,
  sharedTransition = true,
}: GameBoxProps) {
  const { t } = useI18n()

  return (
    <article
      className={cn(
        'group relative mx-auto w-full max-w-[240px] transition-transform duration-200 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="game-box-shadow relative">
        <div
          className="relative flex aspect-[135/170] overflow-hidden rounded-md bg-box-plastic"
          style={{
            boxShadow:
              'inset 0 1px 0 var(--box-bevel-hi), inset 0 -1px 0 var(--box-bevel-lo)',
          }}
        >
          {/* 左脊 8px */}
          <div
            aria-hidden
            className="relative w-2 shrink-0 overflow-hidden"
            style={{
              background:
                'linear-gradient(to bottom, color-mix(in srgb, black 40%, transparent), color-mix(in srgb, black 22%, transparent), color-mix(in srgb, black 45%, transparent))',
            }}
          >
            <div
              className="game-box-spine-sheen absolute inset-x-0 top-0 h-1/2"
              style={{
                background:
                  'linear-gradient(to bottom, color-mix(in srgb, white 35%, transparent), transparent)',
              }}
            />
          </div>

          {/* 封面区：四周露壳 10px */}
          <div className="flex min-w-0 flex-1 flex-col p-2.5">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-box-inner ring-1 ring-black/30">
              {sharedTransition ? (
                <motion.div
                  layoutId={`cover-${gameId}`}
                  className="h-full w-full overflow-hidden"
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <CoverMedia title={title} coverUrl={coverUrl} />
                </motion.div>
              ) : (
                <CoverMedia title={title} coverUrl={coverUrl} />
              )}
            </div>

            <div className="mt-2 shrink-0 px-0.5">
              <h2 className="line-clamp-2 text-balance text-sm font-medium leading-snug text-fg">
                {title}
              </h2>
              <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted">
                {t('shotsLabel', { count: shotCount })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function CoverMedia({
  title,
  coverUrl,
}: {
  title: string
  coverUrl?: string
}) {
  if (!coverUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface/30 text-3xl font-medium text-muted">
        {title.slice(0, 1)}
      </div>
    )
  }

  return (
    <ImageWithState
      src={coverUrl}
      alt=""
      fallbackGlyph={title.slice(0, 1)}
      imgClassName="transition-transform duration-200 ease-out group-hover:scale-[1.03]"
    />
  )
}
