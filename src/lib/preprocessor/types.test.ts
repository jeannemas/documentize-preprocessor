import { join } from 'node:path';
import {
  Project,
  type OptionalKind,
  type PropertySignatureStructure,
  type WriterFunction,
} from 'ts-morph';
import { describe, expect, it } from 'vitest';

import { generateAlphabeat } from '$lib/utils/alphabeat.js';
import { randomInteger } from '$lib/utils/numbers.js';
import { randomString } from '$lib/utils/strings.js';

import { Property, extractProperties } from './types.js';

/**
 * Generate random property signatures.
 *
 * @param count The number of property signatures to generate.
 */
export function generateRandomPropertySignatures(
  count: number,
): OptionalKind<PropertySignatureStructure>[] {
  const propertySignatures: OptionalKind<PropertySignatureStructure>[] = [];

  for (let i = 0; i < count; i += 1) {
    const name = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: 16,
    });
    const propertySignature = {
      name,
    } satisfies OptionalKind<PropertySignatureStructure>;

    propertySignatures.push(propertySignature);
  }

  return propertySignatures;
}

/**
 * Wrap properties into an object literal.
 *
 * @param properties The properties to wrap.
 */
export function wrapPropertiesWithObject(
  properties: OptionalKind<PropertySignatureStructure>[],
): WriterFunction {
  return (writer) => {
    writer.block(() => {
      for (const property of properties) {
        if (property.type) {
          if (typeof property.type === 'string') {
            writer.writeLine(`${property.name}: ${property.type};`);
          } else {
            writer.write(`${property.name}: `);

            property.type(writer);

            writer.write(';\n');
          }
        } else {
          writer.writeLine(`${property.name}: any;`);
        }
      }
    });
  };
}

describe(extractProperties.name, () => {
  it('Should extract the properties from the interface declaration', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      join(
        import.meta.filename,
        `${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}.ts`,
      ),
    );
    const interfaceName = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const properties = generateRandomPropertySignatures(
      randomInteger({
        max: 10,
        min: 1,
      }),
    );
    const interfaceDeclaration = sourceFile.addInterface({
      name: interfaceName,
      properties: properties,
    });

    // Act
    const extractedProperties = extractProperties(interfaceDeclaration.getType());

    // Assert
    expect(extractedProperties).toBeInstanceOf(Array);
    expect(extractedProperties).toHaveLength(properties.length);

    for (const property of extractedProperties) {
      expect(property).toBeInstanceOf(Property);
    }
  });

  it('Should extract properties from extended local interfaces', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      join(
        import.meta.filename,
        `${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}.ts`,
      ),
    );
    const interface_A_name = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const interface_B_name = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const interface_A_properties = generateRandomPropertySignatures(
      randomInteger({
        max: 10,
        min: 1,
      }),
    );
    const interface_B_properties = generateRandomPropertySignatures(
      randomInteger({
        max: 10,
        min: 1,
      }),
    );
    const [, interface_B_declaration] = sourceFile.addInterfaces([
      {
        name: interface_A_name,
        properties: interface_A_properties,
      },
      {
        name: interface_B_name,
        extends: [interface_A_name],
        properties: interface_B_properties,
      },
    ]);

    // Act
    const extractedProperties = extractProperties(interface_B_declaration.getType());

    // Assert
    expect(extractedProperties).toBeInstanceOf(Array);
    expect(extractedProperties).toHaveLength(
      interface_A_properties.length + interface_B_properties.length,
    );

    for (const property of extractedProperties) {
      expect(property).toBeInstanceOf(Property);
    }
  });

  it('Should extract properties from extended external interfaces', () => {
    // Arrange
    const project = new Project();
    const sourceFile_A = project.createSourceFile(
      join(
        import.meta.filename,
        `${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}.ts`,
      ),
    );
    const sourceFile_B = project.createSourceFile(
      join(
        import.meta.filename,
        `${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}.ts`,
      ),
    );
    const interface_A_name = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const interface_B_name = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const interface_A_properties = generateRandomPropertySignatures(
      randomInteger({
        max: 10,
        min: 1,
      }),
    );
    const interface_B_properties = generateRandomPropertySignatures(
      randomInteger({
        max: 10,
        min: 1,
      }),
    );
    const interface_B_declaration = sourceFile_B.addInterface({
      name: interface_B_name,
      extends: [interface_A_name],
      properties: interface_B_properties,
    });

    sourceFile_A.addInterface({
      isExported: true,
      name: interface_A_name,
      properties: interface_A_properties,
    });
    sourceFile_B.addImportDeclaration({
      moduleSpecifier: sourceFile_A.getFilePath(),
      isTypeOnly: true,
      namedImports: [interface_A_name],
    });

    // Act
    const extractedProperties = extractProperties(interface_B_declaration.getType());

    // Assert
    expect(extractedProperties).toBeInstanceOf(Array);
    expect(extractedProperties).toHaveLength(
      interface_A_properties.length + interface_B_properties.length,
    );

    for (const property of extractedProperties) {
      expect(property).toBeInstanceOf(Property);
    }
  });

  it('Should extract the properties from the type alias declaration', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      join(
        import.meta.filename,
        `${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}.ts`,
      ),
    );
    const typeAliasName = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const properties = generateRandomPropertySignatures(
      randomInteger({
        max: 10,
        min: 1,
      }),
    );
    const typeAliasDeclaration = sourceFile.addTypeAlias({
      name: typeAliasName,
      type: (writer) => {
        wrapPropertiesWithObject(properties)(writer);
      },
    });

    // Act
    const extractedProperties = extractProperties(typeAliasDeclaration.getType());

    // Assert
    expect(extractedProperties).toBeInstanceOf(Array);
    expect(extractedProperties).toHaveLength(properties.length);

    for (const property of extractedProperties) {
      expect(property).toBeInstanceOf(Property);
    }
  });

  it('Should extract properties from the type alias declaration with intersection type', () => {
    // Arrange
    const project = new Project();
    const sourceFile = project.createSourceFile(
      join(
        import.meta.filename,
        `${randomString({
          alphabeat: generateAlphabeat('a', 'z'),
          length: 16,
        })}.ts`,
      ),
    );
    const typeAlias_A_name = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const typeAlias_B_name = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const typeAlias_C_name = randomString({
      alphabeat: generateAlphabeat('a', 'z'),
      length: randomInteger({
        max: 10,
        min: 1,
      }),
    });
    const typeAlias_A_properties = generateRandomPropertySignatures(
      randomInteger({
        max: 10,
        min: 1,
      }),
    );
    const typeAlias_B_properties = generateRandomPropertySignatures(
      randomInteger({
        max: 10,
        min: 1,
      }),
    );
    const [, , typeAlias_C_declaration] = sourceFile.addTypeAliases([
      {
        name: typeAlias_A_name,
        type: (writer) => {
          wrapPropertiesWithObject(typeAlias_A_properties)(writer);
        },
      },
      {
        name: typeAlias_B_name,
        type: (writer) => {
          wrapPropertiesWithObject(typeAlias_B_properties)(writer);
        },
      },
      {
        name: typeAlias_C_name,
        type: (writer) => {
          writer.writeLine(`${typeAlias_A_name} & ${typeAlias_B_name};`);
        },
      },
    ]);

    // Act
    const extractedProperties = extractProperties(typeAlias_C_declaration.getType());

    // Assert
    expect(extractedProperties).toBeInstanceOf(Array);
    expect(extractedProperties).toHaveLength(
      typeAlias_A_properties.length + typeAlias_B_properties.length,
    );

    for (const property of extractedProperties) {
      expect(property).toBeInstanceOf(Property);
    }
  });
});
