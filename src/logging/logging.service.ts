import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { resolve } from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logLevel: number;
  private readonly logFilePath: string;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL ? Number(process.env.LOG_LEVEL) : 2;
    this.logFilePath = path.join(resolve(), 'logs', 'app.log');
    fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
  }

  log(message: any) {
    this.writeLog('INFO', message);
  }

  error(message: any, trace?: string) {
    this.writeLog('ERROR', message, trace);
  }

  warn(message: any) {
    this.writeLog('WARN', message);
  }

  debug(message: any) {
    this.writeLog('DEBUG', message);
  }

  verbose(message: any) {
    this.writeLog('VERBOSE', message);
  }

  private writeLog(level: string, message: any, trace?: string) {
    if (this.shouldLog(level)) {
      const logMessage =
        `${new Date().toISOString()} [${level}] ${JSON.stringify(message)}` +
        (trace ? `\n${trace}` : '');
      console.log(logMessage);
      fs.appendFileSync(this.logFilePath, logMessage + '\n');
      this.rotateLogs();
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug', 'verbose'];
    const messageLevelIndex = levels.indexOf(level.toLowerCase());
    return messageLevelIndex <= this.logLevel;
  }

  private rotateLogs() {
    const stats = fs.statSync(this.logFilePath);
    const maxFileSize = Number(process.env.LOGGING_SIZE) * 1024;
    if (stats.size >= maxFileSize) {
      const timestamp = new Date()
        .toISOString()
        .replace(/:/g, '-')
        .split('.')[0];
      const newLogFilePath = path.join(
        resolve(),
        'logs',
        `app-${timestamp}.log`,
      );
      fs.renameSync(this.logFilePath, newLogFilePath);
      fs.writeFileSync(this.logFilePath, '');
    }
  }
}
