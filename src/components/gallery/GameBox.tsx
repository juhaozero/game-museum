import { motion } from 'motion/react'
import { ImageWithState } from '@/components/ui/ImageWithState'
import { useCoverTilt } from '@/hooks/usePointerParallax'
import { cn } from '@/utils/cn'

type GameBoxProps = {
  gameId: string
  title: string
  coverUrl?: string
  className?: string
  sharedTransition?: boolean
  /** 街机卡带封面样式 */
  cart?: boolean
}

/**
 * 封面：倾斜交互 + 卡带脊线 / 底部灯条
 */
export function GameBox({
  gameId,
  title,
  coverUrl,
  className,
  sharedTransition = true,
  cart = false,
}: GameBoxProps) {
  const tilt = useCoverTilt(cart ? 8 : 6)

  return (
    <motion.article
      className={cn('group relative w-full', className)}
      style={tilt.reduceMotion ? undefined : tilt.style}
      onPointerEnter={tilt.onPointerEnter}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <div
        className={cn(
          'relative',
          cart ? 'cart-cover-lift' : 'cover-lift',
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden bg-surface',
            cart
              ? 'cart-cover'
              : 'rounded-md border border-[color:var(--cabinet-edge)] shadow-[0_8px_22px_var(--contact-shadow)]',
          )}
        >
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
              'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2.5 pb-2.5 pt-10 transition-opacity duration-200',
              coverUrl
                ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                : 'opacity-100',
            )}
          >
            <h2 className="line-clamp-2 text-balance text-[12px] font-medium leading-snug text-white sm:text-[13px]">
              {title}
            </h2>
          </div>
        </div>
        {cart ? (
          <span className="cart-shelf-glow" aria-hidden />
        ) : (
          <span className="cover-shelf-glow" aria-hidden />
        )}
      </div>
    </motion.article>
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
      imgClassName="transition-opacity duration-200"
    />
  )
}
