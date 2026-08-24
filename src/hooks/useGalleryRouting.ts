import { useCallback, useEffect, useRef } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useDebounce } from '@/hooks/useDebounce'
import { useGalleryStore } from '@/store/useGalleryStore'
import { buildShelfUrl, decodeCategorySlug, isShelfPath } from '@/utils/routes'

function isShelfPathname(pathname: string) {
  return isShelfPath(pathname)
}

/** 同步 URL ↔ gallery store（搜索 q + 分类路径） */
export function useGalleryRouting() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categorySlug } = useParams()

  const searchQuery = useGalleryStore((s) => s.searchQuery)
  const setSearchQuery = useGalleryStore((s) => s.setSearchQuery)
  const setSelectedCategory = useGalleryStore((s) => s.setSelectedCategory)

  const debouncedSearch = useDebounce(searchQuery, 300)
  const prevPathRef = useRef<string | null>(null)
  const prevSearchRef = useRef<string | null>(null)
  const pendingHydrationRef = useRef(false)

  const isShelfRoute = isShelfPathname(location.pathname)

  // URL → store（路径变化 / 浏览器后退）
  useEffect(() => {
    if (!isShelfRoute) return

    const pathChanged = prevPathRef.current !== location.pathname
    const searchChanged = prevSearchRef.current !== searchParams.toString()

    prevPathRef.current = location.pathname
    prevSearchRef.current = searchParams.toString()

    if (pathChanged) {
      pendingHydrationRef.current = true
      setSearchQuery(searchParams.get('q') ?? '')
      setSelectedCategory(
        categorySlug ? decodeCategorySlug(categorySlug) : null,
      )
      return
    }

    if (
      searchChanged &&
      searchQuery === debouncedSearch &&
      !pendingHydrationRef.current
    ) {
      setSearchQuery(searchParams.get('q') ?? '')
    }
  }, [
    isShelfRoute,
    location.pathname,
    searchParams,
    categorySlug,
    debouncedSearch,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
  ])

  // store → URL（防抖搜索）
  useEffect(() => {
    if (!isShelfRoute) return

    // 路径刚变化时先完成 URL→store，避免误删 ?q=
    if (pendingHydrationRef.current) {
      pendingHydrationRef.current = false
      return
    }

    const current = searchParams.get('q') ?? ''
    const next = debouncedSearch.trim()
    if (next === current) return

    const sp = new URLSearchParams(searchParams)
    if (next) sp.set('q', next)
    else sp.delete('q')

    prevSearchRef.current = sp.toString()
    setSearchParams(sp, { replace: true })
  }, [debouncedSearch, isShelfRoute, searchParams, setSearchParams])

  const navigateToCategory = useCallback(
    (category: string | null) => {
      navigate(buildShelfUrl(category, searchQuery), { replace: false })
    },
    [navigate, searchQuery],
  )

  const clearFiltersAndNavigate = useCallback(() => {
    pendingHydrationRef.current = true
    prevPathRef.current = '/'
    prevSearchRef.current = ''
    navigate('/', { replace: true })
    setSearchQuery('')
    setSelectedCategory(null)
  }, [navigate, setSearchQuery, setSelectedCategory])

  return {
    navigateToCategory,
    clearFiltersAndNavigate,
  }
}
