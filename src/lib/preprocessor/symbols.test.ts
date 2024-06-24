import { InterfaceDeclaration, Project, TypeAliasDeclaration, type SourceFile } from 'ts-morph';
import { beforeEach, describe, expect, it } from 'vitest';

import { randomString } from '$lib/utils/index.js';

import { getInterfaceOrTypeAliasFromSymbolName } from './symbols.js';

let symbol: string;
let project: Project;
let sourceFile: SourceFile;

beforeEach(() => {
  symbol = randomString();
  project = new Project();
  sourceFile = project.createSourceFile(`${randomString()}.ts`);
});

describe(getInterfaceOrTypeAliasFromSymbolName.name, () => {
  it('Should match the interface declaration', () => {
    // Arrange
    sourceFile.addInterface({
      name: symbol,
    });

    // Act
    const maybeInterfaceOrTypeAlias = getInterfaceOrTypeAliasFromSymbolName(symbol, sourceFile);

    // Assert
    expect(maybeInterfaceOrTypeAlias).not.toBeNull();
    expect(maybeInterfaceOrTypeAlias).toBeInstanceOf(InterfaceDeclaration);
  });

  it('Should match the type alias declaration', () => {
    // Arrange
    sourceFile.addTypeAlias({
      name: symbol,
      type: 'unknown',
    });

    // Act
    const maybeInterfaceOrTypeAlias = getInterfaceOrTypeAliasFromSymbolName(symbol, sourceFile);

    // Assert
    expect(maybeInterfaceOrTypeAlias).not.toBeNull();
    expect(maybeInterfaceOrTypeAlias).toBeInstanceOf(TypeAliasDeclaration);
  });

  it('Should match nothing', () => {
    // Arrange

    // Act
    const maybeInterfaceOrTypeAlias = getInterfaceOrTypeAliasFromSymbolName(symbol, sourceFile);

    // Assert
    expect(maybeInterfaceOrTypeAlias).toBeNull();
  });

  it('Should throw an error if the symbol is ambiguous', () => {
    // Arrange
    sourceFile.addInterface({
      name: symbol,
    });
    sourceFile.addTypeAlias({
      name: symbol,
      type: 'unknown',
    });

    // Act
    const action = () => getInterfaceOrTypeAliasFromSymbolName(symbol, sourceFile);

    // Assert
    expect(action).toThrowError(Error);
  });
});
