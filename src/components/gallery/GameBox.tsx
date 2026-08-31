import { motion } from 'motion/react'
import { ImageWithState } from '@/components/ui/ImageWithState'
import { cn } from '@/utils/cn'

type GameBoxProps = {
  gameId: string
  title: string
  shotCount: number
  coverUrl?: string
  className?: string
  sharedTransition?: boolean
}

/**
 * 货架封面：圆角海报 + 底部柔光灯带；标题仅 hover 叠层（对齐参考图）
 */
export function GameBox({
  gameId,
  title,
  shotCount,
  coverUrl,
  className,
  sharedTransition = true,
}: GameBoxProps) {
  return (
    <article className={cn('group relative w-full', className)}>
      <div className="cover-lift relative">
        <div className="relative overflow-hidden rounded-2xl border border-hairline/60 bg-surface shadow-[0_8px_28px_var(--contact-shadow)]">
          <div className="aspect-[2/3] w-full overflow-hidden">
            {sharedTransition ? (
              <motion.div
                layoutId={`cover-${gameId}`}
                className="h-full w-full"
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <CoverMedia title={title} coverUrl={coverUrl} />
              </motion.div>
            ) : (
              <CoverMedia title={title} coverUrl={coverUrl} />
            )}
          </div>

          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pb-3 pt-12 transition-opacity duration-200',
              coverUrl
                ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                : 'opacity-100',
            )}
          >
            <h2 className="line-clamp-2 text-balance text-[13px] font-medium leading-snug text-white">
              {title}
            </h2>
            <p className="mt-0.5 font-mono text-[10px] tabular-nums text-white/70">
              {shotCount} shots
            </p>
          </div>
        </div>
        <span className="cover-shelf-glow" aria-hidden />
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
      <div className="flex h-full w-full items-center justify-center bg-surface text-3xl font-medium text-muted">
        {title.slice(0, 1)}
      </div>
    )
  }

  return (
    <ImageWithState
      src={coverUrl}
      alt=""
      fallbackGlyph={title.slice(0, 1)}
      imgClassName="transition-transform duration-200 ease-out group-hover:scale-[1.04]"
    />
  )
}
