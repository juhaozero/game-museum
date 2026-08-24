import type { Manifest } from '@/types/manifest'

export async function loadManifest(): Promise<Manifest> {
  const response = await fetch('/manifest.json', { cache: 'no-cache' })
  if (!response.ok) {
    throw new Error(`无法加载 manifest.json (${response.status})`)
  }
  return response.json() as Promise<Manifest>
}
