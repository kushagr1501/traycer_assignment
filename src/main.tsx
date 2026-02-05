import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Analytics } from "@vercel/analytics/react"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <SmoothCursor /> */}

    <Analytics />
  </StrictMode>,
)
