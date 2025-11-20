/**
 * Centralized logging utility for the React application
 * Logs can be disabled in production by setting isDevelopment to false
 */
class Logger {
  static isDevelopment = true; // Set to false for production builds


  /**
   * Log general information (only in development mode)
   */
  static log(message, ...args) {
    if (this.isDevelopment) {
      console.log(`[EasySources] ${message}`, ...args);
    }
  }

  /**
   * Log errors (always logged, even in production)
   */
  static error(message, ...args) {
    console.error(`[EasySources ERROR] ${message}`, ...args);
  }

  /**
   * Log warnings (only in development mode)
   */
  static warn(message, ...args) {
    if (this.isDevelopment) {
      console.warn(`[EasySources WARNING] ${message}`, ...args);
    }
  }

  /**
   * Log debug information (only in development mode)
   */
  static debug(message, ...args) {
    if (this.isDevelopment) {
      console.debug(`[EasySources DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Enable or disable development mode logging
   */
  static setDevelopmentMode(enabled) {
    this.isDevelopment = enabled;
  }
}

export default Logger;
