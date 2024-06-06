import type { Api } from '@codemod.com/workflow';

// List of all schema names
const SCHEMAS = [
  'any',
  'array',
  'bigint',
  'blob',
  'boolean',
  'custom',
  'date',
  'enum_',
  'instance',
  'intersect',
  'lazy',
  'literal',
  'looseObject',
  'looseTuple',
  'map',
  'nan',
  'never',
  'nonNullable',
  'nonNullish',
  'nonOptional',
  'null_',
  'nullable',
  'nullish',
  'number',
  'object',
  'objectWithRest',
  'optional',
  'picklist',
  'record',
  'set',
  'strictObject',
  'strictTuple',
  'string',
  'symbol',
  'tuple',
  'tupleWithRest',
  'undefined_',
  'union',
  'unknown',
  'variant',
  'void_',
];

// List of schema names with an mandatory array argument
const SCHEMAS_WITH_ARRAY_ARG = [
  'union',
  'intersect',
  'tuple',
  'looseTuple',
  'strictTuple',
  'picklist',
  'variant',
];

// List of names that have changed
const RENAMES: [string, string][] = [
  ['anyAsync', 'any'],
  ['BaseSchema', 'GenericSchema'],
  ['bigintAsync', 'bigint'],
  ['blobAsync', 'blob'],
  ['booleanAsync', 'boolean'],
  ['custom', 'check'],
  ['customAsync', 'checkAsync'],
  ['dateAsync', 'date'],
  ['enumAsync', 'enum_'],
  ['Input', 'InferInput'],
  ['instanceAsync', 'instance'],
  ['literalAsync', 'literal'],
  ['nanAsync', 'nan'],
  ['neverAsync', 'never'],
  ['nullAsync', 'null_'],
  ['numberAsync', 'number'],
  ['Output', 'InferOutput'],
  ['picklistAsync', 'picklist'],
  ['special', 'custom'],
  ['specialAsync', 'customAsync'],
  ['SchemaConfig', 'Config'],
  ['stringAsync', 'string'],
  ['symbolAsync', 'symbol'],
  ['undefinedAsync', 'undefined_'],
  ['unknownAsync', 'unknown'],
  ['toCustom', 'transform'],
  ['toTrimmed', 'trim'],
  ['toTrimmedEnd', 'trimEnd'],
  ['toTrimmedStart', 'trimStart'],
  ['voidAsync', 'void_'],
];

/**
 * Codemod workflow that migrates Valibot code to v0.31.0.
 */
export async function workflow({ jsFiles }: Api) {
  await jsFiles(async ({ astGrep, addImport, removeImport, getImports }) => {
    // Query wildcard import
    const wildcardImport = (
      await getImports('import * as $IMPORT from "valibot"').map(
        ({ getMatch }) => getMatch('IMPORT')?.text()
      )
    ).shift();

    // Query direct imports
    const directImports = (
      await getImports('import { $$$IMPORTS } from "valibot"').map(
        ({ getMultipleMatches }) =>
          getMultipleMatches('IMPORTS')
            .filter((node) => node.kind() === 'import_specifier')
            .map((node) => node.text())
      )
    ).reduce((allImports, imports) => {
      allImports.push(...imports);
      return allImports;
    }, []);

    /**
     * Returns a function that checks if it is a valid wildcard or direct
     * import.
     */
    function createImportCheck() {
      return (name: string | undefined): boolean => {
        if (
          name &&
          ((wildcardImport && name.startsWith(`${wildcardImport}.`)) ||
            directImports.includes(name))
        ) {
          return true;
        }
        return false;
      };
    }

    /**
     * Returns a function that checks if it is a valid wildcard or direct
     * import of a specific name.
     */
    function createNameCheck(names: string[]) {
      const isImported = createImportCheck();
      return (name: string | undefined): boolean => {
        if (
          name &&
          isImported(name) &&
          ((wildcardImport &&
            names.includes(
              name.replace(new RegExp(`^${wildcardImport}.`), '')
            )) ||
            names.includes(name))
        ) {
          return true;
        }
        return false;
      };
    }

    /**
     * Deeply searches for specific patterns.
     */
    async function deepSearch(
      action: (continue_: () => void) => Promise<unknown>
    ) {
      let notDone = true;
      while (notDone) {
        notDone = false;
        await action(() => (notDone = true));
      }
    }

    // Create util functions
    const isImported = createImportCheck();
    const isSchema = createNameCheck(SCHEMAS);
    const isSchemaWithArrayArg = createNameCheck(SCHEMAS_WITH_ARRAY_ARG);
    const isObject = createNameCheck(['object']);
    const isTuple = createNameCheck(['tuple']);
    const isObjectOrTuple = createNameCheck(['object', 'tuple']);
    const isUnknown = createNameCheck(['unknown']);
    const isNever = createNameCheck(['never']);
    const isPipe = createNameCheck(['pipe']);
    const isMerge = createNameCheck(['merge']);
    const isBrandOrTransform = createNameCheck(['brand', 'transform']);
    const isCoerce = createNameCheck(['coerce']);
    const isFlatten = createNameCheck(['flatten']);

    // Create wildcard prefix
    const wildcardPrefix = wildcardImport ? `${wildcardImport}.` : '';

    // Rewrite names
    for (const [from, to] of [
      ...(wildcardImport
        ? RENAMES.map(([prev, next]) => [
            `${wildcardImport}.${prev}`,
            `${wildcardImport}.${next}`,
          ])
        : []),
      ...RENAMES,
    ]) {
      // Rewrite only if imported by Valibot
      if (isImported(from)) {
        await astGrep(from).replace(() => to);
        await astGrep({
          rule: { regex: from, kind: 'type_identifier' },
        }).replace(() => to);
      }
    }

    // Rewrite object merging
    await astGrep`$METHOD($$$ARGS)`.replace(
      ({ getMatch, getMultipleMatches }) => {
        // Get and process node
        const methodName = getMatch('METHOD')?.text();

        // Continue if it is merge method
        if (isMerge(methodName)) {
          // Get and process nodes
          const argsNodes = getMultipleMatches('ARGS');
          const entriesText = argsNodes[0]
            ?.children()
            .slice(1, -1)
            .filter((node) => node.kind() !== ',')
            .map((node) => `...${node.text()}.entries`)
            .join(', ');
          const restText = argsNodes
            .slice(1)
            .filter((node) => node.kind() !== ',')
            .map((node) => node.text())
            .join(', ');

          // Update imports if necessary
          if (!wildcardImport) {
            addImport(`import { object } from "valibot"`);
            removeImport(`import { merge } from "valibot"`);
            directImports.push(`object`);
          }

          // Return rewritten code
          return `${wildcardPrefix}object({${entriesText}}${restText ? `, ${restText}` : ''})`;
        }
      }
    );

    // Rewrite objects and tuples with rest
    await astGrep`$SCHEMA($SHAPE, $$$REST)`.replace(
      ({ getMatch, getMultipleMatches }) => {
        // Get and process nodes
        const schemaName = getMatch('SCHEMA')?.text();
        const shapeText = getMatch('SHAPE')?.text();
        const restNodes = getMultipleMatches('REST');
        const restSchemaName = restNodes[0]?.child(0)?.text();

        // Continue if it is object or tuple with rest
        if (
          isObjectOrTuple(schemaName) &&
          isSchema(restSchemaName) &&
          !isUnknown(restSchemaName) &&
          !isNever(restSchemaName)
        ) {
          // Process nodes
          const restText = restNodes
            .filter((node) => node.kind() !== ',')
            .map((node) => node.text())
            .join(', ');

          // Update imports if necessary
          // Hint: We do not remove the object or tuple import because we do
          // not know if it will be used elsewhere.
          if (schemaName && !schemaName.startsWith(`${wildcardImport}.`)) {
            addImport(`import { ${schemaName}WithRest } from "valibot"`);
            directImports.push(`${schemaName}WithRest`);
          }

          // Return rewritten code
          return `${schemaName}WithRest(${shapeText}, ${restText})`;
        }
      }
    );

    // Rewrite loose and strict objects and tuples
    await astGrep`$SCHEMA($SHAPE, $$$REST)`.replace(
      ({ getMatch, getMultipleMatches }) => {
        // Get and process nodes
        const schemaName = getMatch('SCHEMA')?.text();
        const shapeText = getMatch('SHAPE')?.text();
        const restNodes = getMultipleMatches('REST');
        const restSchemaName = restNodes[0]?.child(0)?.text();

        // Create necessary variables
        let schemaPrefix: string | undefined;
        let schemaSuffix: string | undefined;

        // Set schema suffix and imports
        if (isObject(schemaName)) {
          schemaSuffix = 'Object';
        } else if (isTuple(schemaName)) {
          schemaSuffix = 'Tuple';
        }

        // Set schema prefix and imports
        if (isUnknown(restSchemaName)) {
          schemaPrefix = 'loose';
        } else if (isNever(restSchemaName)) {
          schemaPrefix = 'strict';
        }

        // Continue if prefix and suffix are set
        if (schemaPrefix && schemaSuffix) {
          // Process nodes
          const restText = restNodes
            .slice(1)
            .filter((node) => node.kind() !== ',')
            .map((node) => node.text())
            .join(', ');

          // Update imports if necessary
          // Hint: We do not remove any imports because we do not know if it
          // will be used elsewhere.
          if (!wildcardImport) {
            addImport(
              `import { ${schemaPrefix}${schemaSuffix} } from "valibot"`
            );
            directImports.push(`${schemaPrefix}${schemaSuffix}`);
          }

          // Return rewritten code
          return `${wildcardPrefix}${schemaPrefix}${schemaSuffix}(${shapeText}${restText ? `, ${restText}` : ''})`;
        }
      }
    );

    // Rewrite coerce
    await astGrep`$METHOD($REMOVE, $LASTARG)`.replace(({ getMatch }) => {
      // Get and process nodes
      const methodName = getMatch('METHOD')?.text();
      const lastArgText = getMatch('LASTARG')?.text();

      // Continue if it is coerce method
      if (isCoerce(methodName)) {
        // Update imports if necessary
        if (!wildcardImport) {
          addImport(`import { pipe, unknown, transform } from "valibot"`);
          removeImport(`import { coerce } from "valibot"`);
        }

        // Return rewritten code
        return `${wildcardPrefix}pipe(${wildcardPrefix}unknown(), ${wildcardPrefix}transform(${lastArgText}))`;
      }
    });

    // Rewrite flatten
    await astGrep`$METHOD($ARG)`.replace(({ getMatch }) => {
      // Get and process node
      const methodName = getMatch('METHOD')?.text();
      const argChildLength = getMatch('ARG')?.children().length;

      // Continue if it is flatten method with error argument
      if (isFlatten(methodName) && !argChildLength) {
        // Return rewritten code
        return `$METHOD($ARG.issues)`;
      }
    });

    // Rewrite brand and transform
    await deepSearch((continue_) =>
      astGrep`$METHOD($SCHEMA, $LASTARG)`.replace(({ getMatch }) => {
        // Get and process nodes
        const methodName = getMatch('METHOD')?.text();
        const schemaText = getMatch('SCHEMA')?.text();
        const lastArgText = getMatch('LASTARG')?.text();

        // Continue if it is brand or transform method
        if (isBrandOrTransform(methodName)) {
          // Continue searching
          continue_();

          // Update imports if necessary
          if (!wildcardImport) {
            addImport(`import { pipe } from "valibot"`);
            directImports.push(`pipe`);
          }

          // Return rewritten code
          return `${wildcardPrefix}pipe(${schemaText}, ${methodName}(${lastArgText}))`;
        }
      })
    );

    // Rewrite pipelines for schemas with mandatory array argument
    await deepSearch((continue_) =>
      astGrep`$SCHEMA([$$$ITEMS], $$$REST, [$$$ACTIONS])`.replace(
        ({ getMatch, getMultipleMatches }) => {
          // Get and process nodes
          const schemaName = getMatch('SCHEMA')?.text();

          // Continue if it is schema with array argument
          if (isSchemaWithArrayArg(schemaName)) {
            // Get and process nodes
            const itemsText = getMultipleMatches('ITEMS')
              .filter((node) => node.kind() !== ',')
              .map((node) => node.text())
              .join(', ');
            const restText = getMultipleMatches('REST')
              .filter((node) => node.kind() !== ',')
              .map((node) => node.text())
              .join(', ');
            const actionNodes = getMultipleMatches('ACTIONS');

            // If pipe is not empty, rewrite it to new pipe method
            if (actionNodes.length) {
              // Continue searching
              continue_();

              const actionsText = actionNodes
                .filter((node) => node.kind() !== ',')
                .map((node) => node.text())
                .join(', ');

              // Update imports if necessary
              if (!wildcardImport) {
                addImport(`import { pipe } from "valibot"`);
                directImports.push(`pipe`);
              }

              // Return rewritten code
              return `${wildcardPrefix}pipe(${schemaName}([${itemsText}]${restText ? `, ${restText}` : ''}), ${actionsText})`;
            }

            // Otherwise, remove pipe argument from schema
            return `${schemaName}([${itemsText}]${restText ? `, ${restText}` : ''})`;
          }
        }
      )
    );

    // Rewrite pipelines for schemas without mandatory array argument
    await deepSearch((continue_) =>
      astGrep`$SCHEMA($$$REST, [$$$ACTIONS])`.replace(
        ({ getMatch, getMultipleMatches }) => {
          // Get and process nodes
          const schemaName = getMatch('SCHEMA')?.text();

          // Continue if it is schema without array argument
          if (isSchema(schemaName) && !isSchemaWithArrayArg(schemaName)) {
            // Get and process nodes
            const restText = getMultipleMatches('REST')
              .filter((node) => node.kind() !== ',')
              .map((node) => node.text())
              .join(', ');
            const actionNodes = getMultipleMatches('ACTIONS');

            // If pipe is not empty, rewrite it to new pipe method
            if (actionNodes.length) {
              // Continue searching
              continue_();

              // Get and process nodes
              const actionsText = actionNodes
                .map((node) => node.text())
                .join(' ');

              // Update imports if necessary
              if (!wildcardImport) {
                addImport(`import { pipe } from "valibot"`);
                directImports.push(`pipe`);
              }

              // Return rewritten code
              return `${wildcardPrefix}pipe(${schemaName}(${restText}), ${actionsText})`;
            }

            // Otherwise, remove pipe argument from schema
            return `${schemaName}(${restText})`;
          }
        }
      )
    );

    // Rewrite nested pipes
    await deepSearch((continue_) =>
      astGrep`$METHOD1($METHOD2($$$ARGS), $$$REST)`.replace(
        ({ getMatch, getMultipleMatches }) => {
          // Get and process nodes
          const method1Name = getMatch('METHOD1')?.text();
          const method2Name = getMatch('METHOD2')?.text();

          // Continue if both methods are pipes
          if (isPipe(method1Name) && isPipe(method2Name)) {
            // Continue searching
            continue_();

            // Get and process nodes
            const itemsText = [
              ...getMultipleMatches('ARGS').filter(
                (node) => node.kind() !== ','
              ),
              ...getMultipleMatches('REST').filter(
                (node) => node.kind() !== ','
              ),
            ]
              .map((node) => node.text())
              .join(', ');

            // Update imports if necessary
            if (!wildcardImport) {
              addImport(`import { pipe } from "valibot"`);
              directImports.push(`pipe`);
            }

            // Return rewritten code
            return `${wildcardPrefix}pipe(${itemsText})`;
          }
        }
      )
    );
  });
}
