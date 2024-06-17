import { JSDOM } from 'jsdom';

type ScriptInfo = {
  /**
   * The attributes of the script tag.
   */
  attributes: Record<string, string>;
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
  const scriptContextModuleAttributes = [...(scriptContextModule?.attributes ?? [])].reduce<
    Record<string, string>
  >(
    (acc, { name, value }) => ({
      ...acc,
      [name]: value,
    }),
    {},
  );
  const scriptNotContextModuleAttributes = [...(scriptNotContextModule?.attributes ?? [])].reduce<
    Record<string, string>
  >(
    (acc, { name, value }) => ({
      ...acc,
      [name]: value,
    }),
    {},
  );

  return {
    scripts: {
      contextModule: {
        attributes: scriptContextModuleAttributes,
        content: scriptContextModule?.innerHTML ?? '',
      },
      notContextModule: {
        attributes: scriptNotContextModuleAttributes,
        content: scriptNotContextModule?.innerHTML ?? '',
      },
    },
  };
}
