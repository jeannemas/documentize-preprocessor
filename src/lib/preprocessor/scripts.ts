/**
 * The script tag of a Svelte 4 component.
 */
export type Svelte4Script = {
  /**
   * The attributes of the script tag.
   */
  attributes: Record<string, string>;
  /**
   * The content of the script tag.
   */
  content: string;
};

/**
 * Extract the script tag with the `context="module"` attribute.
 * If no script with `context="module"` is found, returns `null`.
 *
 * @throws {Error} When multiple scripts with context module are found.
 */
export function extractScriptContextModule(content: string): Svelte4Script | null {
  const scripts = extractScripts(content);
  const scriptsContextModule = scripts.filter((info) => info.attributes.context === 'module');

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
  const scriptsNotContextModule = scripts.filter((info) => info.attributes.context !== 'module');

  if (scriptsNotContextModule.length > 1) {
    throw new Error('Multiple scripts found. This is invalid in Svelte 4.');
  }

  return scriptsNotContextModule.at(0) ?? null;
}

/**
 * Extract the scripts from a Svelte 4 component.
 */
export function extractScripts(content: string): Svelte4Script[] {
  const scriptRegex = /(<script([^>]*)>([\s\S]*?)<\/script>)/g;
  const attributeRegex = /(([a-zA-Z_-][a-zA-Z0-9_-]*)=(?:'([\s\S]*?)'|"([\s\S]*?)"))/g;
  const scripts: Svelte4Script[] = [];

  for (const execArray of content.matchAll(scriptRegex)) {
    const [, , rawAttributes, rawContent] = execArray;
    const attributes: Record<string, string> = {};

    for (const execArray of rawAttributes.matchAll(attributeRegex)) {
      const [, , rawName, rawValue1, rawValue2] = execArray;

      attributes[rawName] = rawValue1 || rawValue2 || '';
    }

    scripts.push({
      attributes,
      content: rawContent,
    });
  }

  return scripts;
}
