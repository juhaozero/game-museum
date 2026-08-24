import { cn } from '@/utils/cn'

type GameBoxProps = {
  title: string
  shotCount: number
  coverUrl?: string
  className?: string
}

/** 实体盒装封面：壳边 + 左脊 + inset 封面，非裸截图 */
export function GameBox({ title, shotCount, coverUrl, className }: GameBoxProps) {
  return (
    <article
      className={cn(
        'group relative mx-auto w-full max-w-[240px] transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1',
        className,
      )}
    >
      <div
        className="relative flex aspect-[135/170] overflow-hidden rounded-md bg-box-plastic shadow-[0_12px_28px_-16px_rgba(0,0,0,0.55)]"
        style={{ boxShadow: '0 14px 32px -18px rgba(0,0,0,0.55)' }}
      >
        {/* 左脊 */}
        <div
          aria-hidden
          className="w-2.5 shrink-0 bg-gradient-to-b from-black/35 via-black/20 to-black/40"
        />

        <div className="flex min-w-0 flex-1 flex-col p-2.5">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-box-inner ring-1 ring-black/30">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface/30 text-3xl font-medium text-muted">
                {title.slice(0, 1)}
              </div>
            )}
          </div>

          <div className="mt-2 shrink-0 px-0.5">
            <h2 className="line-clamp-2 text-sm font-medium leading-snug text-fg">
              {title}
            </h2>
            <p className="mt-0.5 font-mono text-[11px] text-muted">
              {shotCount} shots
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
