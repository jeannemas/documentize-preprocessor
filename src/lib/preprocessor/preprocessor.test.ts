import { describe, expect, it } from 'vitest';

import { randomString } from '$lib/utils/index.js';

import { resolveConfig, type Config } from './config.js';
import { Logger } from './logger.js';
import { SilentLogger } from './logger.test.js';
import { extractMetaTag } from './meta-tag.js';
import { Preprocessor, Svelte4Metadata } from './preprocessor.js';

describe(Preprocessor.name, () => {
  describe(Preprocessor.create.name, () => {
    it('Should create a new preprocessor', () => {
      // Arrange
      const config = {} satisfies Config;

      // Act
      const action = () => Preprocessor.create(config);

      // Assert
      expect(action).not.toThrowError();

      const maybePreprocessor = action();

      expect(maybePreprocessor).toBeInstanceOf(Preprocessor);
    });
  });

  describe('constructor', () => {
    it('Should create a new instance', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const logger = new Logger(console, resolvedConfig.debug);

      // Act
      const action = () => new Preprocessor(logger, resolvedConfig);

      // Assert
      expect(action).not.toThrowError();

      const maybePreprocessor = action();

      expect(maybePreprocessor).toBeInstanceOf(Preprocessor);
    });
  });

  describe('extractComponentMetadata' satisfies keyof Preprocessor, () => {
    it('Should extract the component metadata', () => {
      // Arrange
      const resolvedConfig = resolveConfig({
        debug: true,
      });
      const preprocessor = new Preprocessor(
        new Logger(new SilentLogger(), resolvedConfig.debug),
        resolvedConfig,
      );
      const filename = randomString();
      const content = `
<script lang="ts">
  type $$Events = {};
  type $$Props = {};
  type $$Slots = {};
</script>

<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;
      const metaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);

      // Act
      const action = () => preprocessor.extractComponentMetadata(filename, content, metaTag!);

      // Assert
      expect(action).not.toThrowError();

      const maybeMetadata = action();

      expect(maybeMetadata).toBeInstanceOf(Svelte4Metadata);
    });
  });

  describe('markup' satisfies keyof Preprocessor, () => {
    it('Should process the markup', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        resolvedConfig,
      );
      const filename = randomString();
      const content = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;

      // Act
      const action = () => preprocessor.markup({ content, filename });

      // Assert
      expect(action).not.toThrowError();

      const maybeProcessed = action();

      expect(maybeProcessed).toBeTypeOf('object');
      expect(maybeProcessed).toHaveProperty('code');
      expect(maybeProcessed!.code).toBeTypeOf('string');
    });

    it('Should not process the markup', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        resolvedConfig,
      );
      const filename = randomString();
      const content = `
<meta
 data-not-documentize
/>
`;

      // Act
      const action = () => preprocessor.markup({ content, filename });

      // Assert
      expect(action).not.toThrowError();

      const maybeProcessed = action();

      expect(maybeProcessed).toBeTypeOf('undefined');
    });
  });

  describe('name' satisfies keyof Preprocessor, () => {
    it('Should be defined as a string', () => {
      // Arrange
      const preprocessor = Preprocessor.create();

      // Act
      const action = () => preprocessor.name;

      // Assert
      expect(action).not.toThrowError();

      const maybeString = action();

      expect(maybeString).toBeTypeOf('string');
    });
  });

  describe('patchContent' satisfies keyof Preprocessor, () => {
    it('Should patch the content', () => {
      // Arrange
      const resolvedConfig = resolveConfig();
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        resolvedConfig,
      );
      const filename = randomString();
      const content = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;
      const metaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);
      const metadata = preprocessor.extractComponentMetadata(filename, content, metaTag!);

      // Act
      const action = () => preprocessor.patchContent(content, metaTag!.regex, metadata);

      // Assert
      const warnsCountBefore = loggerConsole.warnLogs.length;

      expect(action).not.toThrowError();

      const warnsCountAfter = loggerConsole.warnLogs.length;

      expect(warnsCountAfter).toEqual(warnsCountBefore);
    });

    it('Should fail the patch', () => {
      // Arrange
      const resolvedConfig = resolveConfig({
        debug: true,
      });
      const loggerConsole = new SilentLogger();
      const preprocessor = new Preprocessor(
        new Logger(loggerConsole, resolvedConfig.debug),
        resolvedConfig,
      );
      const filename = randomString();
      const content = `
<meta
  ${resolvedConfig.dataAttributes.global}
/>
`;
      const metaTag = extractMetaTag(content, resolvedConfig.dataAttributes.global);
      const metadata = preprocessor.extractComponentMetadata(filename, content, metaTag!);

      // Act
      const action = () => preprocessor.patchContent(content, /^$/, metadata);

      // Assert
      const warnsCountBefore = loggerConsole.warnLogs.length;

      expect(action).not.toThrowError();

      const warnsCountAfter = loggerConsole.warnLogs.length;

      expect(warnsCountAfter).toBeGreaterThan(warnsCountBefore);
    });
  });
});
