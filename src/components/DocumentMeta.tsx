import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import type { useGalleryFilters } from '@/hooks/useGalleryFilters'
import type { useManifest } from '@/hooks/useManifest'
import { useI18n } from '@/i18n/useI18n'
import { applyDocumentMeta } from '@/utils/documentMeta'
import { displayCategoryName, displayGameName, pickLocalized } from '@/utils/localized'
import { resolveFeaturedExhibits } from '@/utils/featuredShots'
import { absoluteSiteUrl } from '@/utils/siteUrl'
import { decodeCategorySlug } from '@/utils/routes'

type Gallery = ReturnType<typeof useGalleryFilters>
type ManifestState = ReturnType<typeof useManifest>

type DocumentMetaProps = {
  gallery: Gallery
  manifestState: ManifestState
}

/** 按路由同步 title / canonical / Open Graph（SPA 分享链接） */
export function DocumentMeta({ gallery, manifestState }: DocumentMetaProps) {
  const { pathname } = useLocation()
  const { gameId, categorySlug } = useParams()
  const { t, locale } = useI18n()

  useEffect(() => {
    const siteName = t('siteTitle')
    const pathOnly = pathname.split('?')[0] || '/'
    const url = absoluteSiteUrl(pathOnly)

    let title = siteName
    let description = t('metaDescription')
    let image: string | null = null
    let type: 'website' | 'article' = 'website'

    const manifest =
      manifestState.status === 'ready' ? manifestState.data : null
    const featured = manifest ? resolveFeaturedExhibits(manifest) : null
    const shelfImage =
      featured?.items[0]?.url ??
      gallery.allGames.find((g) => g.coverUrl)?.coverUrl ??
      null

    if (pathOnly === '/favorites') {
      title = `${t('myFavorites')} · ${siteName}`
      description = t('metaDescriptionFavorites')
      image = gallery.favoriteScreenshots[0]?.url ?? shelfImage
    } else if (gameId) {
      const game = gallery.getGameById(gameId)
      if (game) {
        const name = displayGameName(game.name, game.title, locale)
        title = `${name} · ${siteName}`
        const blurb = pickLocalized(game.blurb, locale)
        description = blurb || t('metaDescriptionGame', { name })
        image = game.coverUrl || shelfImage
        type = 'article'
      } else {
        title = `${t('gameNotFound')} · ${siteName}`
        description = t('metaDescription')
        image = shelfImage
      }
    } else if (categorySlug) {
      const category = decodeCategorySlug(categorySlug)
      const cat = gallery.categories.find((c) => c.name === category)
      const label = cat
        ? displayCategoryName(cat.name, cat.title, locale)
        : category
      title = `${label} · ${siteName}`
      description = t('metaDescriptionCategory', { category: label })
      image =
        gallery.filteredGames.find((g) => g.coverUrl)?.coverUrl ?? shelfImage
    } else {
      title = siteName
      description = t('metaDescription')
      image = shelfImage
    }

    applyDocumentMeta({
      title,
      description,
      url,
      image,
      type,
      locale,
      siteName,
    })
  }, [
    pathname,
    gameId,
    categorySlug,
    locale,
    t,
    manifestState,
    gallery.allGames,
    gallery.categories,
    gallery.filteredGames,
    gallery.favoriteScreenshots,
    gallery.getGameById,
  ])

  return null
}
