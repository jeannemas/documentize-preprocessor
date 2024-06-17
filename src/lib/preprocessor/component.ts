import { JSDOM } from 'jsdom';

type ScriptInfo = {
  /**
   * The content of the script tag.
   */
  content: string;
};
type Svelte4Component = {
  /**
   * The scripts of the Svelte 4 component.
   */
  scripts: {
    /**
     * The script tag with the `context="module"` attribute.
     */
    contextModule: ScriptInfo;
    /**
     * The script tag without the `context="module"` attribute.
     */
    notContextModule: ScriptInfo;
  };
};

/**
 * Extract the parts of a Svelte 4 component.
 */
export function extractSvelte4ComponentParts(content: string): Svelte4Component {
  const jsdom = new JSDOM(content);
  const scriptContextModule = jsdom.window.document.querySelector<HTMLScriptElement>(
    'script[context="module"]',
  );
  const scriptNotContextModule = jsdom.window.document.querySelector<HTMLScriptElement>(
    'script:not([context="module"])',
  );

  return {
    scripts: {
      contextModule: {
        content: scriptContextModule?.innerHTML ?? '',
      },
      notContextModule: {
        content: scriptNotContextModule?.innerHTML ?? '',
      },
    },
  };
}