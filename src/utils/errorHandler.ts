/**
 * Global Error Handler
 * 
 * Provides comprehensive error detection and reporting for production debugging.
 * Catches unhandled errors and promise rejections that might prevent the app from rendering.
 */

interface ErrorInfo {
  message: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  timestamp: string;
  userAgent: string;
  url: string;
}

class GlobalErrorHandler {
  private errors: ErrorInfo[] = [];
  private maxErrors = 10;

  constructor() {
    this.setupErrorHandlers();
  }

  private setupErrorHandlers() {
    // Catch synchronous errors
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message || 'Unknown error',
        stack: event.error?.stack,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
      
      // Prevent default browser error handling in development
      if (process.env.NODE_ENV === 'development') {
        event.preventDefault();
      }
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      this.handleError({
        message: error?.message || String(error) || 'Unhandled promise rejection',
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
      
      // Log to console
      console.error('[GlobalErrorHandler] Unhandled promise rejection:', error);
      
      // Prevent default browser error handling in development
      if (process.env.NODE_ENV === 'development') {
        event.preventDefault();
      }
    });
  }

  private handleError(errorInfo: ErrorInfo) {
    // Add to errors array
    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console
    console.error('[GlobalErrorHandler] Error caught:', errorInfo);

    // Display error in UI if app hasn't rendered
    this.displayErrorInUI(errorInfo);
  }

  private displayErrorInUI(errorInfo: ErrorInfo) {
    // Check if root element exists and is empty (app hasn't rendered)
    const root = document.getElementById('root');
    if (!root) return;

    // Check if React has rendered anything
    const hasReactContent = root.children.length > 0 || root.textContent?.trim();
    if (hasReactContent) {
      // App has rendered, let ErrorBoundary handle it
      return;
    }

    // App hasn't rendered, show error message
    const errorDisplay = document.getElementById('init-error-display');
    if (errorDisplay) {
      // Update existing error display
      const errorList = errorDisplay.querySelector('.error-list');
      if (errorList) {
        const errorItem = document.createElement('div');
        errorItem.className = 'error-item';
        errorItem.innerHTML = `
          <div class="error-message">${this.escapeHtml(errorInfo.message)}</div>
          ${errorInfo.stack ? `<pre class="error-stack">${this.escapeHtml(errorInfo.stack)}</pre>` : ''}
        `;
        errorList.appendChild(errorItem);
      }
    } else {
      // Create new error display
      root.innerHTML = `
        <div id="init-error-display" style="
          padding: 40px 20px;
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          color: #fff;
          background: #0a0a0a;
          min-height: 100vh;
        ">
          <h1 style="color: #ef4444; margin-bottom: 20px; font-size: 24px;">
            ⚠️ Application Initialization Error
          </h1>
          <p style="color: #999; margin-bottom: 30px; line-height: 1.6;">
            The application failed to initialize. This error occurred before React could render.
          </p>
          <div class="error-list" style="
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          ">
            <div class="error-item" style="margin-bottom: 20px;">
              <div class="error-message" style="
                color: #ef4444;
                font-weight: 600;
                margin-bottom: 10px;
                font-size: 16px;
              ">${this.escapeHtml(errorInfo.message)}</div>
              ${errorInfo.source ? `
                <div style="color: #666; font-size: 12px; margin-bottom: 10px;">
                  Source: ${this.escapeHtml(errorInfo.source)}${errorInfo.lineno ? `:${errorInfo.lineno}:${errorInfo.colno}` : ''}
                </div>
              ` : ''}
              ${errorInfo.stack ? `
                <pre class="error-stack" style="
                  background: #0a0a0a;
                  padding: 15px;
                  border-radius: 4px;
                  overflow-x: auto;
                  font-size: 12px;
                  color: #999;
                  line-height: 1.5;
                  margin-top: 10px;
                ">${this.escapeHtml(errorInfo.stack)}</pre>
              ` : ''}
            </div>
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
            <button onclick="navigator.clipboard.writeText(document.getElementById('init-error-display').innerText)" style="
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
              • Check the browser console for additional error messages<br>
              • Verify all dependencies are installed correctly<br>
              • Check network tab for failed resource loads<br>
              • Try clearing browser cache and reloading
            </p>
          </div>
        </div>
      `;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Initialize global error handler
export const globalErrorHandler = new GlobalErrorHandler();

// Export for use in components
export default globalErrorHandler;

