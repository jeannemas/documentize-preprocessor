import type { SourceFile } from 'ts-morph';

/**
 * Resolve the Svelte 4 props of a component.
 */
export function resolveSvelte4Props(sourceFile: SourceFile, symbolKey: string) {
  const node = sourceFile.getTypeAlias(symbolKey) ?? sourceFile.getInterface(symbolKey);

  if (!node) {
    return [];
  }

  return node
    .getType()
    .getProperties()
    .map((symbol) => ({
      comment: symbol.compilerSymbol.getDocumentationComment(undefined),
      name: symbol.getName(),
    }));
}
