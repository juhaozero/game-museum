import type { Manifest } from '@/types/manifest'
import { withBasePath } from '@/utils/routeSuffix'

export async function loadManifest(): Promise<Manifest> {
  const response = await fetch(withBasePath('/manifest.json'), { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`无法加载 manifest.json (${response.status})`)
  }
  return response.json() as Promise<Manifest>
}
