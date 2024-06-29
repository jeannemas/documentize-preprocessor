import chalk from 'chalk';

import { PREPROCESSOR_NAME } from './constants.js';

export type LoggerConsole = Pick<Console, 'info' | 'warn'>;

/**
 * A logger that logs to the console.
 */
export class Logger<TConsole extends LoggerConsole = LoggerConsole> {
  /**
   * The console to log to.
   */
  private readonly _console: TConsole;
  /**
   * Whether the logger is in debug mode.
   */
  private readonly _debug: boolean;

  /**
   * Create a new logger.
   *
   * @param console The console to log to.
   * @param debug Whether the logger is in debug mode.
   */
  constructor(console: TConsole, debug: boolean) {
    this._console = console;
    this._debug = debug;
  }

  /**
   * Log to the console with the `info` level.
   *
   * If the logger is not in debug mode, this method does nothing.
   */
  info(...args: unknown[]): void {
    if (!this._debug) {
      // We only want to log in debug mode
      return;
    }

    this._console.info(`[${chalk.bgBlue(PREPROCESSOR_NAME)}]`, ...args);
  }

  /**
   * Log to the console with the `warn` level.
   *
   * If the logger is not in debug mode, this method does nothing.
   */
  warn(...args: unknown[]): void {
    if (!this._debug) {
      // We only want to log in debug mode
      return;
    }

    this._console.warn(`[${chalk.bgYellow(PREPROCESSOR_NAME)}]`, ...args);
  }
}
