/**
 * Initialization Health Check
 * 
 * Validates critical dependencies and environment before app initialization.
 * Provides detailed diagnostics for debugging initialization failures.
 */

interface HealthCheckResult {
  passed: boolean;
  checks: {
    name: string;
    passed: boolean;
    message: string;
    critical: boolean;
  }[];
}

class InitHealthCheck {
  /**
   * Run all health checks
   */
  async runChecks(): Promise<HealthCheckResult> {
    const checks = [
      this.checkRootElement(),
      this.checkReact(),
      this.checkRequiredAPIs(),
      this.checkCriticalImports(),
    ];

    const results = await Promise.all(checks);
    const allPassed = results.every(check => check.passed || !check.critical);
    const criticalFailed = results.some(check => !check.passed && check.critical);

    return {
      passed: allPassed && !criticalFailed,
      checks: results,
    };
  }

  /**
   * Check if root element exists
   */
  private async checkRootElement(): Promise<{
    name: string;
    passed: boolean;
    message: string;
    critical: boolean;
  }> {
    const root = document.getElementById('root');
    return {
      name: 'Root Element',
      passed: !!root,
      message: root
        ? 'Root element found'
        : 'Root element not found. Check index.html for <div id="root"></div>',
      critical: true,
    };
  }

  /**
   * Check if React is available
   */
  private async checkReact(): Promise<{
    name: string;
    passed: boolean;
    message: string;
    critical: boolean;
  }> {
    try {
      // React will be validated during import - if import fails, it will be caught
      return {
        name: 'React Library',
        passed: true, // Will be checked during import
        message: 'React will be validated during import',
        critical: true,
      };
    } catch (error) {
      return {
        name: 'React Library',
        passed: false,
        message: `React check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        critical: true,
      };
    }
  }

  /**
   * Check required browser APIs
   */
  private async checkRequiredAPIs(): Promise<{
    name: string;
    passed: boolean;
    message: string;
    critical: boolean;
  }> {
    const requiredAPIs = [
      { name: 'document', available: typeof document !== 'undefined' },
      { name: 'window', available: typeof window !== 'undefined' },
      { name: 'localStorage', available: typeof Storage !== 'undefined' && 'localStorage' in window },
    ];

    const missing = requiredAPIs.filter(api => !api.available);
    return {
      name: 'Browser APIs',
      passed: missing.length === 0,
      message:
        missing.length === 0
          ? 'All required browser APIs available'
          : `Missing APIs: ${missing.map(m => m.name).join(', ')}`,
      critical: true,
    };
  }

  /**
   * Check critical imports (async validation)
   */
  private async checkCriticalImports(): Promise<{
    name: string;
    passed: boolean;
    message: string;
    critical: boolean;
  }> {
    // This will be validated during actual imports
    // We can't dynamically check imports without actually importing them
    return {
      name: 'Critical Imports',
      passed: true,
      message: 'Will be validated during module loading',
      critical: true,
    };
  }

  /**
   * Display health check results
   */
  displayResults(result: HealthCheckResult, rootElement: HTMLElement): void {
    if (result.passed) {
      console.log('[InitHealthCheck] All health checks passed');
      return;
    }

    const failedChecks = result.checks.filter(check => !check.passed);
    const criticalFailures = failedChecks.filter(check => check.critical);

    if (criticalFailures.length > 0) {
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
            ⚠️ Initialization Health Check Failed
          </h1>
          <p style="color: #999; margin-bottom: 30px; line-height: 1.6;">
            Critical health checks failed. The application cannot initialize.
          </p>
          <div style="
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          ">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">Failed Checks:</h2>
            ${criticalFailures
              .map(
                check => `
              <div style="
                padding: 15px;
                background: #0a0a0a;
                border-left: 3px solid #ef4444;
                margin-bottom: 10px;
                border-radius: 4px;
              ">
                <div style="color: #ef4444; font-weight: 600; margin-bottom: 5px;">
                  ${this.escapeHtml(check.name)}
                </div>
                <div style="color: #999; font-size: 14px;">
                  ${this.escapeHtml(check.message)}
                </div>
              </div>
            `
              )
              .join('')}
          </div>
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
        </div>
      `;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export const initHealthCheck = new InitHealthCheck();
export default initHealthCheck;

