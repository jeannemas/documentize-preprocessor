import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomBoolean } from '$lib/utils/booleans.js';
import { randomString } from '$lib/utils/strings.js';

import { Logger, type LoggerConsole } from './logger.js';

export class SilentLogger implements LoggerConsole {
  #infoLogs: unknown[][] = [];
  #warnLogs: unknown[][] = [];

  get infoLogs(): readonly unknown[][] {
    return this.#infoLogs;
  }

  get warnLogs(): readonly unknown[][] {
    return this.#warnLogs;
  }

  info(...args: Parameters<LoggerConsole['info']>) {
    this.#infoLogs.push(args);
  }

  warn(...args: Parameters<LoggerConsole['warn']>) {
    this.#warnLogs.push(args);
  }
}

describe(Logger.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const loggerConsole = console satisfies LoggerConsole;
      const debug = randomBoolean();

      // Act
      const action = () => new Logger(loggerConsole, debug);

      // Assert
      expect(action).not.toThrowError();

      const maybeLogger = action();

      expect(maybeLogger).toBeInstanceOf(Logger);
    });
  });

  describe('info' satisfies keyof Logger, () => {
    it('Should only log when debug=true', () => {
      // Arrange
      const loggerConsole = new SilentLogger();
      const debugs = [false, true] satisfies boolean[];
      const actions = new Map<boolean, () => void>();

      // Act
      for (const debug of debugs) {
        const logger = new Logger(loggerConsole, debug);

        actions.set(debug, () =>
          logger.info(
            randomString({
              alphabeat: generateAlphabeat('a', 'z'),
              length: 16,
            }),
          ),
        );
      }

      // Assert
      for (const [debug, action] of actions.entries()) {
        const infosCountBefore = loggerConsole.infoLogs.length;

        expect(action).not.toThrowError();

        const infosCountAfter = loggerConsole.infoLogs.length;

        if (debug) {
          expect(infosCountAfter).toBeGreaterThan(infosCountBefore);
        } else {
          expect(infosCountAfter).toEqual(infosCountBefore);
        }
      }
    });
  });

  describe('warn' satisfies keyof Logger, () => {
    it('Should only log when debug=true', () => {
      // Arrange
      const loggerConsole = new SilentLogger();
      const debugs = [false, true] satisfies boolean[];
      const actions = new Map<boolean, () => void>();

      // Act
      for (const debug of debugs) {
        const logger = new Logger(loggerConsole, debug);

        actions.set(debug, () =>
          logger.warn(
            randomString({
              alphabeat: generateAlphabeat('a', 'z'),
              length: 16,
            }),
          ),
        );
      }

      // Assert
      for (const [debug, action] of actions.entries()) {
        const warnsCountBefore = loggerConsole.warnLogs.length;

        expect(action).not.toThrowError();

        const warnsCountAfter = loggerConsole.warnLogs.length;

        if (debug) {
          expect(warnsCountAfter).toBeGreaterThan(warnsCountBefore);
        } else {
          expect(warnsCountAfter).toEqual(warnsCountBefore);
        }
      }
    });
  });
});
