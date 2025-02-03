type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor(logLevel: LogLevel = "info") {
    this.logLevel = logLevel;
  }

  static getInstance(logLevel?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel);
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV == "production") {
      return false;
    }

    const levels: LogLevel[] = ["info", "warn", "error", "debug"];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog("info")) {
      console.info(`[INFO]: ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog("warn")) {
      console.log(`[WARN]: ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog("error")) {
      console.log(`[ERROR]: ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog("debug")) {
      console.log(`[DEBUG]: ${message}`, ...args);
    }
  }
}

export const logger = Logger.getInstance();

export default Logger;
