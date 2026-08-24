import type { ManifestState } from '@/hooks/useManifest'
import type { useGalleryFilters } from '@/hooks/useGalleryFilters'
import { useOutletContext } from 'react-router-dom'

export type AppOutletContext = {
  manifestState: ManifestState
  gallery: ReturnType<typeof useGalleryFilters>
}

export function useAppContext() {
  return useOutletContext<AppOutletContext>()
}
