import chalk from 'chalk';

import { version } from '$lib/../../package.json';
import { PREPROCESSOR_NAME } from './constants.js';

export type LoggerConsole = Pick<Console, 'info' | 'warn'>;

/**
 * A logger that logs to the console.
 */
export class Logger<TConsole extends LoggerConsole = LoggerConsole> {
  /**
   * The console to log to.
   */
  #console: TConsole;
  /**
   * Whether the logger is in debug mode.
   */
  #debug: boolean;

  /**
   * Create a new logger.
   *
   * @param console The console to log to.
   * @param debug Whether the logger is in debug mode.
   */
  constructor(console: TConsole, debug: boolean) {
    this.#console = console;
    this.#debug = debug;
  }

  /**
   * Log to the console with the `info` level.
   *
   * If the logger is not in debug mode, this method does nothing.
   */
  info(...args: unknown[]): void {
    if (!this.#debug) {
      // We only want to log in debug mode
      return;
    }

    this.#console.info(`[${chalk.bgBlue(this.#name)}]`, ...args);
  }

  /**
   * Log to the console with the `warn` level.
   *
   * If the logger is not in debug mode, this method does nothing.
   */
  warn(...args: unknown[]): void {
    if (!this.#debug) {
      // We only want to log in debug mode
      return;
    }

    this.#console.warn(`[${chalk.bgYellow(this.#name)}]`, ...args);
  }

  /**
   * Get the name of the preprocessor.
   */
  get #name(): string {
    return `${PREPROCESSOR_NAME}@${version}`;
  }
}
