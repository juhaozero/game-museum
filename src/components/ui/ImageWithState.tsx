import { useState } from 'react'
import { cn } from '@/utils/cn'

type ImageWithStateProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** 加载失败时显示的首字占位 */
  fallbackGlyph?: string
  onLoadSuccess?: () => void
}

/** 截图/封面：加载淡入 + 失败可重试 */
export function ImageWithState({
  src,
  alt,
  className,
  imgClassName,
  fallbackGlyph,
  onLoadSuccess,
}: ImageWithStateProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [retryKey, setRetryKey] = useState(0)
  const [loadedSrc, setLoadedSrc] = useState(src)

  // src 变化时在 render 中重置（React 推荐的 props→state 同步方式）
  if (src !== loadedSrc) {
    setLoadedSrc(src)
    setStatus('loading')
  }

  if (status === 'error') {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-2 bg-surface/40 text-muted',
          className,
        )}
      >
        {fallbackGlyph ? (
          <span className="text-3xl font-medium text-muted/80">{fallbackGlyph}</span>
        ) : (
          <span className="text-xs">加载失败</span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setStatus('loading')
            setRetryKey((k) => k + 1)
          }}
          className="rounded border border-hairline px-2 py-0.5 text-xs text-muted hover:text-fg"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      {status === 'loading' && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-surface/50"
        />
      )}
      <img
        key={`${src}-${retryKey}`}
        src={src}
        alt={alt}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-[280ms] ease-out',
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
        loading="lazy"
        onLoad={() => {
          setStatus('loaded')
          onLoadSuccess?.()
        }}
        onError={() => setStatus('error')}
      />
    </div>
  )
}
