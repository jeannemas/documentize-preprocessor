import chalk from 'chalk';

import { version } from '$lib/../../package.json';
import { PREPROCESSOR_NAME } from './constants.js';

/**
 * A logger that logs to the console.
 */
export class Logger {
  /**
   * Whether the logger is in debug mode.
   */
  #debug: boolean;

  /**
   * Create a new logger.
   *
   * @param debug Whether the logger is in debug mode.
   */
  constructor(debug: boolean) {
    this.#debug = debug;
  }

  /**
   * Log to the console with the `error` level.
   */
  error(...args: unknown[]) {
    console.error(`[${chalk.bgRed(this.#name)}]`, ...args);
  }

  /**
   * Log to the console with the `info` level.
   *
   * If the logger is not in debug mode, this method does nothing.
   */
  info(...args: unknown[]) {
    if (!this.#debug) {
      // We only want to log in debug mode
      return;
    }

    console.info(`[${chalk.bgBlue(this.#name)}]`, ...args);
  }

  /**
   * Log to the console with the `warn` level.
   *
   * If the logger is not in debug mode, this method does nothing.
   */
  warn(...args: unknown[]) {
    if (!this.#debug) {
      // We only want to log in debug mode
      return;
    }

    console.warn(`[${chalk.bgYellow(this.#name)}]`, ...args);
  }

  /**
   * Get the name of the preprocessor.
   */
  get #name() {
    return `${PREPROCESSOR_NAME}@${version}`;
  }
}
