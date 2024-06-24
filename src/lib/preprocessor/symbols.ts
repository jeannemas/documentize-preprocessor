import type { InterfaceDeclaration, SourceFile, TypeAliasDeclaration } from 'ts-morph';

/**
 * Get an interface or type alias from a symbol name.
 *
 * @throws If the symbol is ambiguous (i.e., both an interface and a type alias are found).
 */
export function getInterfaceOrTypeAliasFromSymbolName(
  eventsSymbol: string,
  sourceFile: SourceFile,
): InterfaceDeclaration | TypeAliasDeclaration | null {
  const interfaceDeclaration = sourceFile.getInterface(eventsSymbol) ?? null;
  const typeAliasDeclaration = sourceFile.getTypeAlias(eventsSymbol) ?? null;

  if (interfaceDeclaration && typeAliasDeclaration) {
    throw new Error(
      `Ambiguous symbol: "${eventsSymbol}". Found both an interface and a type alias.`,
    );
  }

  return interfaceDeclaration ?? typeAliasDeclaration ?? null;
}
