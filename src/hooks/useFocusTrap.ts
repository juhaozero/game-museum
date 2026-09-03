import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      el.closest('[aria-hidden="true"]') === null &&
      !el.hasAttribute('disabled') &&
      el.tabIndex !== -1,
  )
}

/**
 * 将 Tab 焦点锁在 container 内，激活时记录并在清理时还原先前焦点。
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    const previous = document.activeElement
    returnFocusRef.current =
      previous instanceof HTMLElement ? previous : null

    const container = containerRef.current
    const focusInitial = () => {
      const initial = initialFocusRef?.current
      if (initial) {
        initial.focus()
        return
      }
      const first = container ? getFocusable(container)[0] : null
      first?.focus()
    }

    // 等 dialog 挂载后再聚焦
    const frame = requestAnimationFrame(focusInitial)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return
      const focusable = getFocusable(containerRef.current)
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) {
        e.preventDefault()
        return
      }
      const current = document.activeElement

      if (e.shiftKey) {
        if (current === first || !containerRef.current.contains(current)) {
          e.preventDefault()
          last.focus()
        }
      } else if (current === last || !containerRef.current.contains(current)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      const restore = returnFocusRef.current
      if (restore && typeof restore.focus === 'function') {
        restore.focus()
      }
    }
  }, [active, containerRef, initialFocusRef])
}
