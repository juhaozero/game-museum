import { useEffect, useState } from 'react'
import type { Manifest } from '@/types/manifest'
import { loadManifest } from '@/utils/loadManifest'

type ManifestState =
  | { status: 'loading' }
  | { status: 'ready'; data: Manifest }
  | { status: 'error'; message: string }

export type { ManifestState }

export function useManifest() {
  const [state, setState] = useState<ManifestState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    loadManifest()
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : '加载失败',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
