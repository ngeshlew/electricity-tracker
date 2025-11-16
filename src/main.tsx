/**
 * Main Entry Point
 * 
 * Initializes the React application with comprehensive error handling and health checks.
 * Provides detailed diagnostics for debugging initialization failures.
 */

// Initialize global error handler FIRST (before any imports that might fail)
import './utils/errorHandler';

// Import React and core dependencies
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Initialize health check
import { initHealthCheck } from './utils/initHealthCheck';

/**
 * Main initialization function
 * Wraps app initialization in comprehensive error handling
 */
async function initializeApp() {
  const rootElement = document.getElementById('root');
  
  // Check root element
  if (!rootElement) {
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: system-ui; text-align: center; color: #fff; background: #0a0a0a; min-height: 100vh;">
        <h1 style="color: #ef4444;">Critical Error</h1>
        <p>Root element not found. Make sure &lt;div id="root"&gt;&lt;/div&gt; exists in index.html</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer; background: #8b5cf6; color: white; border: none; border-radius: 6px;">
          Reload Page
        </button>
      </div>
    `;
    return;
  }

  try {
    console.log('[Main] Starting initialization...');

    // Run health checks
    console.log('[Main] Running health checks...');
    const healthResult = await initHealthCheck.runChecks();
    
    if (!healthResult.passed) {
      console.error('[Main] Health checks failed:', healthResult);
      initHealthCheck.displayResults(healthResult, rootElement);
      return;
    }

    console.log('[Main] Health checks passed');

    // Dynamically import App component to catch import errors
    console.log('[Main] Importing App component...');
    const { default: App } = await import('./App.tsx');
    console.log('[Main] App component imported successfully');

    // Create React root
    console.log('[Main] Creating React root...');
    const root = createRoot(rootElement);
    console.log('[Main] React root created');

    // Render app
    console.log('[Main] Rendering App component...');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('[Main] App rendered successfully');

  } catch (error) {
    console.error('[Main] Initialization failed:', error);
    
    // Display detailed error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    rootElement.innerHTML = `
      <div style="
        padding: 40px 20px;
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        color: #fff;
        background: #0a0a0a;
        min-height: 100vh;
      ">
        <h1 style="color: #ef4444; margin-bottom: 20px; font-size: 24px;">
          ⚠️ Application Initialization Failed
        </h1>
        <p style="color: #999; margin-bottom: 30px; line-height: 1.6;">
          The application failed to initialize. This error occurred during the initialization process.
        </p>
        <div style="
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        ">
          <div style="color: #ef4444; font-weight: 600; margin-bottom: 10px; font-size: 16px;">
            ${escapeHtml(errorMessage)}
          </div>
          ${errorStack ? `
            <pre style="
              background: #0a0a0a;
              padding: 15px;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 12px;
              color: #999;
              line-height: 1.5;
              margin-top: 10px;
            ">${escapeHtml(errorStack)}</pre>
          ` : ''}
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button onclick="window.location.reload()" style="
            padding: 12px 24px;
            background: #8b5cf6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          ">Reload Page</button>
          <button onclick="navigator.clipboard.writeText(document.querySelector('pre')?.textContent || '')" style="
            padding: 12px 24px;
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">Copy Error Details</button>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
          <p style="color: #666; font-size: 12px; line-height: 1.6;">
            <strong>Debugging Tips:</strong><br>
            • Check the browser console (F12) for additional error messages<br>
            • Verify all dependencies are installed: <code style="background: #1a1a1a; padding: 2px 6px; border-radius: 3px;">npm install</code><br>
            • Check Network tab for failed resource loads<br>
            • Try clearing browser cache and reloading<br>
            • Check if service worker is causing issues (Application tab → Service Workers)
          </p>
        </div>
      </div>
    `;
  }
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Start initialization
initializeApp().catch((error) => {
  console.error('[Main] Unhandled error in initializeApp:', error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; font-family: system-ui; text-align: center; color: #fff; background: #0a0a0a; min-height: 100vh;">
        <h1 style="color: #ef4444;">Fatal Error</h1>
        <p>Unhandled error during initialization</p>
        <pre style="text-align: left; background: #1a1a1a; padding: 15px; border-radius: 4px; margin: 20px 0; overflow-x: auto;">
          ${escapeHtml(error instanceof Error ? error.stack || error.message : String(error))}
        </pre>
        <button onclick="window.location.reload()" style="padding: 12px 24px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
});