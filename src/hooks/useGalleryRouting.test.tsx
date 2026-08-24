import { renderHook, act, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGalleryRouting } from '@/hooks/useGalleryRouting'
import { useGalleryStore } from '@/store/useGalleryStore'

/** 测试中跳过 300ms 防抖，便于断言 URL 同步 */
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: <T,>(value: T) => value,
}))

type RouteSnapshot = {
  pathname: string
  search: string
}

function resetGalleryStore() {
  useGalleryStore.setState({
    searchQuery: '',
    selectedCategory: null,
    favoriteIds: [],
  })
}

function createWrapper(initialEntry: string) {
  let snapshot: RouteSnapshot = { pathname: '', search: '' }

  function LocationProbe() {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    snapshot = {
      pathname: location.pathname,
      search: location.search,
    }
    return (
      <div
        data-testid="route-snapshot"
        data-pathname={location.pathname}
        data-search={location.search}
        data-q={searchParams.get('q') ?? ''}
      />
    )
  }

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialEntry]}>
        <LocationProbe />
        <Routes>
          <Route path="/" element={children} />
          <Route path="/category/:categorySlug" element={children} />
          <Route path="/game/:gameId" element={children} />
        </Routes>
      </MemoryRouter>
    )
  }

  return { Wrapper, getSnapshot: () => snapshot }
}

describe('useGalleryRouting', () => {
  beforeEach(() => {
    resetGalleryStore()
  })

  it('从 /?q= 初始化时灌入 searchQuery', async () => {
    const { Wrapper } = createWrapper('/?q=zelda')

    renderHook(() => useGalleryRouting(), { wrapper: Wrapper })

    await waitFor(() => {
      expect(useGalleryStore.getState().searchQuery).toBe('zelda')
    })
    expect(useGalleryStore.getState().selectedCategory).toBeNull()
  })

  it('从 /category/:slug 初始化时灌入 selectedCategory', async () => {
    const { Wrapper } = createWrapper('/category/RPG')

    renderHook(() => useGalleryRouting(), { wrapper: Wrapper })

    await waitFor(() => {
      expect(useGalleryStore.getState().selectedCategory).toBe('RPG')
    })
    expect(useGalleryStore.getState().searchQuery).toBe('')
  })

  it('从 /category/:slug?q= 同时灌入分类与搜索', async () => {
    const { Wrapper } = createWrapper('/category/FPS?q=cod')

    renderHook(() => useGalleryRouting(), { wrapper: Wrapper })

    await waitFor(() => {
      expect(useGalleryStore.getState().selectedCategory).toBe('FPS')
      expect(useGalleryStore.getState().searchQuery).toBe('cod')
    })
  })

  it('中文分类 slug 可正确解码', async () => {
    const { Wrapper } = createWrapper(
      `/category/${encodeURIComponent('未分类')}`,
    )

    renderHook(() => useGalleryRouting(), { wrapper: Wrapper })

    await waitFor(() => {
      expect(useGalleryStore.getState().selectedCategory).toBe('未分类')
    })
  })

  it('store 搜索变化时写回 ?q=', async () => {
    const { Wrapper, getSnapshot } = createWrapper('/')

    renderHook(() => useGalleryRouting(), { wrapper: Wrapper })

    act(() => {
      useGalleryStore.getState().setSearchQuery('mario')
    })

    await waitFor(() => {
      expect(getSnapshot().search).toBe('?q=mario')
    })
  })

  it('清空搜索时移除 ?q=', async () => {
    const { Wrapper, getSnapshot } = createWrapper('/?q=mario')

    renderHook(() => useGalleryRouting(), { wrapper: Wrapper })

    await waitFor(() => {
      expect(useGalleryStore.getState().searchQuery).toBe('mario')
    })

    act(() => {
      useGalleryStore.getState().setSearchQuery('')
    })

    await waitFor(() => {
      expect(getSnapshot().search).toBe('')
    })
  })

  it('navigateToCategory 跳转到分类 URL 并保留搜索', async () => {
    const { Wrapper, getSnapshot } = createWrapper('/?q=zelda')

    const { result } = renderHook(() => useGalleryRouting(), {
      wrapper: Wrapper,
    })

    await waitFor(() => {
      expect(useGalleryStore.getState().searchQuery).toBe('zelda')
    })

    act(() => {
      result.current.navigateToCategory('RPG')
    })

    await waitFor(() => {
      expect(getSnapshot().pathname).toBe('/category/RPG')
      expect(getSnapshot().search).toBe('?q=zelda')
    })
  })

  it('navigateToCategory(null) 回到全部馆藏', async () => {
    const { Wrapper, getSnapshot } = createWrapper('/category/RPG?q=zelda')

    const { result } = renderHook(() => useGalleryRouting(), {
      wrapper: Wrapper,
    })

    await waitFor(() => {
      expect(useGalleryStore.getState().searchQuery).toBe('zelda')
    })

    act(() => {
      result.current.navigateToCategory(null)
    })

    await waitFor(() => {
      expect(getSnapshot().pathname).toBe('/')
      expect(getSnapshot().search).toBe('?q=zelda')
    })
  })

  it('clearFiltersAndNavigate 清空 store 并回到 /', async () => {
    const { Wrapper, getSnapshot } = createWrapper('/category/RPG?q=zelda')

    const { result } = renderHook(() => useGalleryRouting(), {
      wrapper: Wrapper,
    })

    act(() => {
      result.current.clearFiltersAndNavigate()
    })

    await waitFor(() => {
      expect(getSnapshot().pathname).toBe('/')
      expect(getSnapshot().search).toBe('')
      expect(useGalleryStore.getState().searchQuery).toBe('')
      expect(useGalleryStore.getState().selectedCategory).toBeNull()
    })
  })

  it('非盒墙路由不同步 ?q= 到 URL', async () => {
    const { Wrapper, getSnapshot } = createWrapper('/game/abc123')

    renderHook(() => useGalleryRouting(), { wrapper: Wrapper })

    act(() => {
      useGalleryStore.getState().setSearchQuery('should-not-sync')
    })

    await waitFor(() => {
      expect(useGalleryStore.getState().searchQuery).toBe('should-not-sync')
    })

    expect(getSnapshot().pathname).toBe('/game/abc123')
    expect(getSnapshot().search).toBe('')
  })

  it('浏览器后退：URL q 变化且防抖 settled 时同步到 store', async () => {
    const { Wrapper: wrapperA } = createWrapper('/?q=foo')
    const first = renderHook(() => useGalleryRouting(), { wrapper: wrapperA })

    await waitFor(() => {
      expect(useGalleryStore.getState().searchQuery).toBe('foo')
    })

    first.unmount()
    resetGalleryStore()
    useGalleryStore.setState({ searchQuery: 'foo' })

    const { Wrapper: wrapperB } = createWrapper('/?q=bar')
    renderHook(() => useGalleryRouting(), { wrapper: wrapperB })

    await waitFor(() => {
      expect(useGalleryStore.getState().searchQuery).toBe('bar')
    })
  })
})
