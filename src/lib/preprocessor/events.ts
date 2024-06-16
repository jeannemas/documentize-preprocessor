import type { SourceFile } from 'ts-morph';

/**
 * Resolve the Svelte 4 events of a component.
 */
export function resolveSvelte4Events(sourceFile: SourceFile, symbolKey: string) {
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
