/**
 * Centralized logging utility for the extension
 * Logs can be disabled in production by setting isDevelopment to false
 */
export class Logger {
  private static isDevelopment = true; // Set to false for production builds

  /**
   * Log general information (only in development mode)
   */
  static log(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(`[SFDX-EasySources] ${message}`, ...args);
    }
  }

  /**
   * Log errors (always logged, even in production)
   */
  static error(message: string, ...args: any[]): void {
    console.error(`[SFDX-EasySources ERROR] ${message}`, ...args);
  }

  /**
   * Log warnings (only in development mode)
   */
  static warn(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(`[SFDX-EasySources WARNING] ${message}`, ...args);
    }
  }

  /**
   * Log debug information (only in development mode)
   */
  static debug(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.debug(`[SFDX-EasySources DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Enable or disable development mode logging
   */
  static setDevelopmentMode(enabled: boolean): void {
    this.isDevelopment = enabled;
  }
}
