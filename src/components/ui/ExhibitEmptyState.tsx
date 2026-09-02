import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

type ExhibitEmptyAction =
  | { to: string; label: string }
  | { onClick: () => void; label: string }

type ExhibitEmptyStateProps = {
  eyebrow?: string
  title: string
  body?: ReactNode
  action?: ExhibitEmptyAction
  codeHint?: string
  className?: string
}

/** 柜体展签式空态 / 错误态 */
export function ExhibitEmptyState({
  eyebrow,
  title,
  body,
  action,
  codeHint,
  className,
}: ExhibitEmptyStateProps) {
  return (
    <div
      className={cn(
        'arcade-panel relative mx-auto max-w-lg overflow-hidden px-6 py-8',
        className,
      )}
      role="status"
    >
      <span className="exhibit-empty-light" aria-hidden />
      {eyebrow && (
        <p className="type-label mb-3 inline-flex items-center gap-2 text-accent">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-[1px] bg-accent"
          />
          {eyebrow}
        </p>
      )}
      <h2 className="type-hero text-balance text-xl text-fg sm:text-2xl">
        {title}
      </h2>
      {body && (
        <div className="mt-3 text-pretty text-sm leading-relaxed text-muted">
          {body}
        </div>
      )}
      {codeHint && (
        <code className="mt-4 inline-block rounded border border-[color:var(--cabinet-edge)] bg-[color:var(--bg)] px-2 py-1 font-mono text-xs text-accent">
          {codeHint}
        </code>
      )}
      {action && (
        <p className="mt-5">
          {'to' in action ? (
            <Link
              to={action.to}
              className="inline-flex items-center rounded-md border border-accent px-3.5 py-2 text-sm font-medium text-accent no-underline transition-colors hover:bg-accent hover:text-[var(--bg)]"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center rounded-md border border-accent px-3.5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-[var(--bg)]"
            >
              {action.label}
            </button>
          )}
        </p>
      )}
      <div className="exhibit-empty-shelf" aria-hidden />
    </div>
  )
}
