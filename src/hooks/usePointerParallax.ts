import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import {
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'

type ParallaxOptions = {
  travel?: number
  stiffness?: number
  damping?: number
}

/** 全局指针视差（仅氛围装饰层） */
export function usePointerParallax(options: ParallaxOptions = {}) {
  const { travel = 18, stiffness = 120, damping = 22 } = options
  const reduceMotion = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness, damping })
  const sy = useSpring(my, { stiffness, damping })

  useEffect(() => {
    if (reduceMotion) {
      mx.set(0)
      my.set(0)
      return
    }

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      mx.set(nx * travel)
      my.set(ny * travel * 0.65)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduceMotion, travel, mx, my])

  const transform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`

  return {
    sx: sx as MotionValue<number>,
    sy: sy as MotionValue<number>,
    transform,
    reduceMotion: !!reduceMotion,
  }
}

type TiltApi = {
  onPointerEnter: () => void
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
  style: {
    transform: ReturnType<typeof useMotionTemplate>
  }
  reduceMotion: boolean
}

/** 仅在指针位于封面内时倾斜；离开立即回正 */
export function useCoverTilt(maxDeg = 9): TiltApi {
  const reduceMotion = useReducedMotion()
  const active = useRef(false)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 380, damping: 32 })
  const sry = useSpring(ry, { stiffness: 380, damping: 32 })

  const onPointerEnter = () => {
    active.current = true
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || !active.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    ry.set((px - 0.5) * maxDeg * 2)
    rx.set((0.5 - py) * maxDeg * 2)
  }

  const onPointerLeave = () => {
    active.current = false
    rx.set(0)
    ry.set(0)
  }

  const transform =
    useMotionTemplate`perspective(900px) rotateX(${srx}deg) rotateY(${sry}deg)`

  return {
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    style: { transform },
    reduceMotion: !!reduceMotion,
  }
}
