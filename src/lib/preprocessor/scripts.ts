import { parseAttributes, type Attribute } from './attributes.js';

const scriptRegex = /(<script([^>]*)>([\s\S]*?)<\/script>)/g;

/**
 * The script tag of a Svelte 4 component.
 */
export class Svelte4Script {
  /**
   * The attributes of the script tag.
   */
  readonly attributes: Attribute[];
  /**
   * The content of the script tag.
   */
  readonly content: string;

  /**
   * Create a new script tag.
   */
  constructor({ attributes, content }: Pick<Svelte4Script, 'attributes' | 'content'>) {
    this.attributes = attributes;
    this.content = content;
  }
}

/**
 * Extract the script tag with the `context="module"` attribute.
 * If no script with `context="module"` is found, returns `null`.
 *
 * @throws {Error} When multiple scripts with context module are found.
 */
export function extractScriptContextModule(content: string): Svelte4Script | null {
  const scripts = extractScripts(content);
  const scriptsContextModule = scripts.filter((info) =>
    info.attributes.some(({ name, value }) => name === 'context' && value === 'module'),
  );

  if (scriptsContextModule.length > 1) {
    throw new Error('Multiple scripts with context module found. This is invalid in Svelte 4.');
  }

  return scriptsContextModule.at(0) ?? null;
}

/**
 * Extract the script tag without the `context="module"` attribute.
 * If no script without `context="module"` is found, returns `null`.
 *
 * @throws {Error} When multiple scripts without context module are found.
 */
export function extractScriptNotContextModule(content: string): Svelte4Script | null {
  const scripts = extractScripts(content);
  const scriptsNotContextModule = scripts.filter(
    (info) => !info.attributes.some(({ name, value }) => name === 'context' && value === 'module'),
  );

  if (scriptsNotContextModule.length > 1) {
    throw new Error('Multiple scripts found. This is invalid in Svelte 4.');
  }

  return scriptsNotContextModule.at(0) ?? null;
}

/**
 * Extract the scripts from a Svelte 4 component.
 */
export function extractScripts(content: string): Svelte4Script[] {
  const scripts: Svelte4Script[] = [];

  for (const execArray of content.matchAll(scriptRegex)) {
    const [, , rawAttributes, rawContent] = execArray;

    scripts.push(
      new Svelte4Script({
        attributes: parseAttributes(rawAttributes),
        content: rawContent,
      }),
    );
  }

  return scripts;
}
