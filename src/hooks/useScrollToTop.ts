import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useGalleryStore } from '@/store/useGalleryStore'

/** 路由或分类变化时滚回顶部 */
export function useScrollToTop() {
  const location = useLocation()
  const selectedCategory = useGalleryStore((s) => s.selectedCategory)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, selectedCategory])
}
