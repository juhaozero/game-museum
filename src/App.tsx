import { Navigate, Route, Routes } from 'react-router-dom'
import AmbientBackground from '@/components/AmbientBackground'
import { AppShell } from '@/components/layout/AppShell'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { GameGalleryPage } from '@/pages/GameGalleryPage'
import { ShelfPage } from '@/pages/ShelfPage'

export default function App() {
  return (
    <>
      <AmbientBackground />
      <div className="relative z-10 min-h-full">
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<ShelfPage />} />
            <Route path="category/:categorySlug" element={<ShelfPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="game/:gameId" element={<GameGalleryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}
