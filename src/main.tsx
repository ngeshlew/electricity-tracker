import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TestPage } from './TestPage.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestPage />
  </StrictMode>,
)