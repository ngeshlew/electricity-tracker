import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure root element exists before rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Make sure <div id="root"></div> exists in index.html');
}

// Add error boundary for initialization errors
try {
  console.log('[Main] Initializing app...');
  const root = createRoot(rootElement);
  console.log('[Main] Root created, rendering App...');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('[Main] App rendered successfully');
} catch (error) {
  console.error('[Main] Failed to render app:', error);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: system-ui; text-align: center;">
        <h1>Application Error</h1>
        <p>Failed to initialize the application.</p>
        <p style="color: #666; font-size: 14px;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}