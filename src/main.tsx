import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { getBasePathFromEnv } from '@/utils/routeSuffix'
import App from './App'
import './index.css'

const basename = getBasePathFromEnv()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename || undefined}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
