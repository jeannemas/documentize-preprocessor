import { describe, expect, it } from 'vitest';

import { generateRandomString, randomInt } from '$lib/test-utils.js';

import { Logger, type LoggerConsole } from './logger.js';

export function generateRandomBoolean(): boolean {
  const boolean = randomInt(0, 2) === 0;

  return boolean;
}

describe(Logger.name, () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const loggerConsole = console satisfies LoggerConsole;
      const debug = generateRandomBoolean();

      // Act
      const action = () => new Logger(loggerConsole, debug);

      // Assert
      expect(action).not.toThrowError();

      const maybeLogger = action();

      expect(maybeLogger).toBeInstanceOf(Logger);
    });
  });

  describe('error' satisfies keyof Logger, () => {
    it('Should always log to the console', () => {
      // Arrange
      const errors: unknown[][] = [];
      const loggerConsole = {
        error(...args) {
          errors.push(args);
        },

        info: console.info,

        warn: console.warn,
      } satisfies LoggerConsole;
      const debugs = [false, true] satisfies boolean[];
      const actions = new Set<() => void>();

      // Act
      for (const debug of debugs) {
        const logger = new Logger(loggerConsole, debug);

        actions.add(() => logger.error(generateRandomString()));
      }

      // Assert
      for (const action of actions.values()) {
        const errorsCountBefore = errors.length;

        expect(action).not.toThrowError();

        const errorsCountAfter = errors.length;

        expect(errorsCountAfter).toBeGreaterThan(errorsCountBefore);
      }
    });
  });

  describe('info' satisfies keyof Logger, () => {
    it('Should only log when debug=true', () => {
      // Arrange
      const infos: unknown[][] = [];
      const loggerConsole = {
        error: console.error,

        info(...args) {
          infos.push(args);
        },

        warn: console.warn,
      } satisfies LoggerConsole;
      const debugs = [false, true] satisfies boolean[];
      const actions = new Map<boolean, () => void>();

      // Act
      for (const debug of debugs) {
        const logger = new Logger(loggerConsole, debug);

        actions.set(debug, () => logger.info(generateRandomString()));
      }

      // Assert
      for (const [debug, action] of actions.entries()) {
        const infosCountBefore = infos.length;

        expect(action).not.toThrowError();

        const infosCountAfter = infos.length;

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
      const warns: unknown[][] = [];
      const loggerConsole = {
        error: console.error,

        info: console.info,

        warn(...args) {
          warns.push(args);
        },
      } satisfies LoggerConsole;
      const debugs = [false, true] satisfies boolean[];
      const actions = new Map<boolean, () => void>();

      // Act
      for (const debug of debugs) {
        const logger = new Logger(loggerConsole, debug);

        actions.set(debug, () => logger.warn(generateRandomString()));
      }

      // Assert
      for (const [debug, action] of actions.entries()) {
        const warnsCountBefore = warns.length;

        expect(action).not.toThrowError();

        const warnsCountAfter = warns.length;

        if (debug) {
          expect(warnsCountAfter).toBeGreaterThan(warnsCountBefore);
        } else {
          expect(warnsCountAfter).toEqual(warnsCountBefore);
        }
      }
    });
  });
});
