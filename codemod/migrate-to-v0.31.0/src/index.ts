import type { Api } from '@codemod.com/workflow';

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

const ACTIONS = [
  'bic',
  'brand',
  'bytes',
  'check',
  'creditCard',
  'cuid2',
  'decimal',
  'email',
  'emoji',
  'empty',
  'endsWith',
  'every',
  'excludes',
  'finite',
  'hash',
  'hexadecimal',
  'hexColor',
  'imei',
  'includes',
  'integer',
  'ip',
  'ipv4',
  'ipv6',
  'isoDate',
  'isoDateTime',
  'isoTime',
  'isoTimeSecond',
  'isoTimestamp',
  'isoWeek',
  'length',
  'mac',
  'mac48',
  'mac64',
  'maxBytes',
  'maxLength',
  'maxSize',
  'maxValue',
  'mimeType',
  'minBytes',
  'minLength',
  'minSize',
  'minValue',
  'multipleOf',
  'nonEmpty',
  'notBytes',
  'notLength',
  'notSize',
  'notValue',
  'octal',
  'readonly',
  'regex',
  'safeInteger',
  'size',
  'some',
  'startsWith',
  'toLowerCase',
  'toMaxValue',
  'toMinValue',
  'toUpperCase',
  'transform',
  'trim',
  'trimEnd',
  'trimStart',
  'ulid',
  'url',
  'uuid',
  'value',
  'forward',
];

const RENAMES: [string, string][] = [
  ['custom', 'check'],
  ['BaseSchema', 'GenericSchema'],
  ['Input', 'InferInput'],
  ['Output', 'InferOutput'],
  ['special', 'custom'],
  ['toCustom', 'transform'],
  ['toTrimmed', 'trim'],
  ['toTrimmedEnd', 'trimEnd'],
  ['toTrimmedStart', 'trimStart'],
];

const constructIsImported =
  ({
    importStar,
    namedImports,
  }: {
    importStar?: string;
    namedImports: string[];
  }) =>
  (name?: string) => {
    if (importStar && name && name.startsWith(`${importStar}.`)) {
      return true;
    }

    return !!(name && namedImports.includes(name));
  };

const constructIs = ({
  importStar,
  namedImports,
  keys,
}: {
  importStar?: string;
  namedImports: string[];
  keys: string[];
}) => {
  const isImported = constructIsImported({ importStar, namedImports });
  return (name?: string) => {
    if (
      name &&
      isImported(name) &&
      keys.includes(name.replace(new RegExp(`^${importStar}.`), ''))
    )
      return true;

    return !!(name && keys.includes(name) && isImported(name));
  };
};

export async function workflow({ jsFiles }: Api) {
  await jsFiles(async ({ astGrep, addImport, removeImport, getImports }) => {
    // Get wildcard import
    const importStar = (
      await getImports('import * as $IMPORT from "valibot"').map(
        ({ getMatch }) => getMatch('IMPORT')?.text()
      )
    ).shift();

    // Get direct imports
    const namedImports = (
      await getImports('import { $$$IMPORTS } from "valibot"').map(
        ({ getMultipleMatches }) =>
          getMultipleMatches('IMPORTS')
            .filter((node) => node.kind() === 'import_specifier')
            .map((node) => node.text())
      )
    ).reduce((allImports, imports) => {
      allImports.push(...imports);
      return allImports;
    }, [] as string[]);

    // Create util functions
    const isSchema = constructIs({ importStar, namedImports, keys: SCHEMAS });
    const isAction = constructIs({ importStar, namedImports, keys: ACTIONS });
    const isImported = constructIsImported({ importStar, namedImports });
    const isObject = constructIs({
      importStar,
      namedImports,
      keys: ['object'],
    });
    const isPipe = constructIs({
      importStar,
      namedImports,
      keys: ['pipe'],
    });
    const isTuple = constructIs({
      importStar,
      namedImports,
      keys: ['tuple'],
    });
    const isUnknown = constructIs({
      importStar,
      namedImports,
      keys: ['unknown'],
    });
    const isNever = constructIs({
      importStar,
      namedImports,
      keys: ['never'],
    });
    const isMerge = constructIs({
      importStar,
      namedImports,
      keys: ['merge'],
    });
    const isBrand = constructIs({
      importStar,
      namedImports,
      keys: ['brand'],
    });
    const isTransform = constructIs({
      importStar,
      namedImports,
      keys: ['transform'],
    });
    const isCoerce = constructIs({
      importStar,
      namedImports,
      keys: ['coerce'],
    });
    const isFlatten = constructIs({
      importStar,
      namedImports,
      keys: ['flatten'],
    });
    const isUnionLike = constructIs({
      importStar,
      namedImports,
      keys: [
        'union',
        'intersect',
        'tuple',
        'looseTuple',
        'strictTuple',
        'picklist',
        'variant',
      ],
    });
    const importStarOrNamed = importStar ? `${importStar}.` : '';

    // Rewrite names
    for (const [from, to] of [
      ...(importStar
        ? RENAMES.map(([f, t]) => [`${importStar}.${f}`, `${importStar}.${t}`])
        : []),
      ...RENAMES,
    ]) {
      if (!isImported(from)) continue;
      if (!from.startsWith(`${importStar}.`)) {
        removeImport(`import { ${from} } from "valibot"`);
        addImport(`import { ${to} } from "valibot"`);
        namedImports.push(to);
      }
      await astGrep(from).replace(() => to);
      await astGrep({
        rule: {
          regex: from,
          kind: 'type_identifier',
        },
      }).replace(() => to);
    }

    // Rewrite objects and tuples with rest
    await astGrep`$OBJECT($ARGUMENT, $SCHEMA)`.replace(({ getMatch }) => {
      const object = getMatch('OBJECT')?.text();
      const argument = getMatch('ARGUMENT')?.text();
      const schema = getMatch('SCHEMA');
      if (
        (isObject(object) || isTuple(object)) &&
        schema?.kind() === 'call_expression' &&
        isSchema(schema.child(0)?.text()) &&
        !(
          isUnknown(schema.child(0)?.text()) || isNever(schema.child(0)?.text())
        )
      ) {
        if (object && !object.startsWith(`${importStar}.`)) {
          addImport(`import { ${object}WithRest } from "valibot"`);
          removeImport(`import { ${object} } from "valibot"`);
          namedImports.push(`${object}WithRest`);
        }
        return `${object}WithRest(${argument}, ${schema.text()})`;
      }
    });

    // Rewrite loose and strict objects and tuples
    await astGrep`$OBJECT($ARGUMENT, $SCHEMA)`.replace(({ getMatch }) => {
      const object = getMatch('OBJECT')?.text();
      const argument = getMatch('ARGUMENT')?.text();
      const schema = getMatch('SCHEMA');
      let objectOrTuple: string | undefined;
      let looseOrStrict: string | undefined;
      const removeImports = [] as string[];
      if (isObject(object)) {
        objectOrTuple = 'Object';
        removeImports.push('object');
      }
      if (isTuple(object)) {
        objectOrTuple = 'Tuple';
        removeImports.push('tuple');
      }
      if (isUnknown(schema?.child(0)?.text())) {
        looseOrStrict = 'loose';
        removeImports.push('unknown');
      }
      if (isNever(schema?.child(0)?.text())) {
        looseOrStrict = 'strict';
        removeImports.push('never');
      }
      if (objectOrTuple && looseOrStrict) {
        if (!importStar) {
          addImport(
            `import { ${looseOrStrict}${objectOrTuple} } from "valibot"`
          );
          removeImport(`import { ${removeImports.join(', ')} } from "valibot"`);
          namedImports.push(`${looseOrStrict}${objectOrTuple}`);
        }
        return `${importStarOrNamed}${looseOrStrict}${objectOrTuple}(${argument})`;
      }
    });

    // Rewrite object merging
    await astGrep`$MERGE([$$$OBJECTS])`.replace(
      ({ getMultipleMatches, getMatch }) => {
        const merge = getMatch('MERGE')?.text();
        const objects = getMultipleMatches('OBJECTS').map((node) => {
          if (node.kind() === ',') {
            return node.text();
          }
          return `...${node.text()}.entries`;
        });
        if (isMerge(merge)) {
          if (!importStar) {
            addImport(`import { object } from "valibot"`);
            removeImport(`import { merge } from "valibot"`);
            namedImports.push(`object`);
          }
          return `${importStarOrNamed}object({${objects.join(' ')}})`;
        }
      }
    );

    // Rewrite coerce
    await astGrep`$COERCE($REMOVE, $LASTARG)`.replace(({ getMatch }) => {
      const coerce = getMatch('COERCE')?.text();
      const lastArg = getMatch('LASTARG')?.text();
      if (isCoerce(coerce)) {
        if (!importStar) {
          removeImport(`import { coerce } from "valibot"`);
          addImport(`import { pipe, unknown, transform } from "valibot"`);
        }
        return `${importStarOrNamed}pipe(${importStarOrNamed}unknown(), ${importStarOrNamed}transform(${lastArg}))`;
      }
    });

    // Rewrite platten
    await astGrep`$FLATTEN($ARG)`.replace(({ getMatch }) => {
      const flatten = getMatch('FLATTEN')?.text();
      if (isFlatten(flatten) && !getMatch('ARG')?.children().length) {
        return `$FLATTEN($ARG.issues)`;
      }
    });

    // Rewrite brand and transform
    let replaced = true;
    while (replaced) {
      replaced = false;
      await astGrep`$BRAND($SCHEMA, $ARGUMENT)`.replace(({ getMatch }) => {
        const brand = getMatch('BRAND')?.text();
        const schema = getMatch('SCHEMA')?.text();
        const argument = getMatch('ARGUMENT')?.text();
        if (isBrand(brand) || isTransform(brand)) {
          if (!importStar) {
            addImport(`import { pipe } from "valibot"`);
            namedImports.push(`pipe`);
          }
          replaced = true;
          return `${importStarOrNamed}pipe(${schema}, ${brand}(${argument}))`;
        }
      });
    }

    // Rewrite union
    replaced = true;
    while (replaced) {
      replaced = false;
      await astGrep`$SCHEMA([$$$ARGS1], $$$REST, [$$$ARGS2])`.replace(
        ({ getMatch, getMultipleMatches }) => {
          const schema = getMatch('SCHEMA')?.text();
          const args1 = getMultipleMatches('ARGS1').filter(
            (node) => node.kind() !== ','
          );
          const args2 = getMultipleMatches('ARGS2').filter(
            (node) => node.kind() !== ','
          );
          const rest = getMultipleMatches('REST');
          if (isUnionLike(schema)) {
            const pipeMethod = `${importStarOrNamed}pipe`;
            if (!importStar) {
              addImport(`import { pipe } from "valibot"`);
              namedImports.push(`pipe`);
            }
            const replacement = `${pipeMethod}(${schema}([${args1.map((node) => node.text()).join(', ')}]${rest.length ? `, ${rest.map((node) => node.text())}` : ''})${args2.length ? `, ${args2.map((node) => node.text()).join(', ')}` : ''})`;
            replaced = true;
            return replacement;
          }
        }
      );
    }

    // Rewrite pipelines
    replaced = true;
    while (replaced) {
      replaced = false;
      await astGrep`$SCHEMA($$$REST, [$$$ACTIONS])`.replace(
        ({ getMatch, getMultipleMatches }) => {
          const schema = getMatch('SCHEMA')?.text();
          const rest = getMultipleMatches('REST')
            .filter((node) => node.kind() !== ',')
            .map((node) => node.text());
          const actions = getMultipleMatches('ACTIONS').filter(
            (node) => node.kind() !== ','
          );
          if (
            isSchema(schema) &&
            actions.length &&
            actions.every((node) => {
              return (
                node.kind() === 'call_expression' &&
                isAction(node.child(0)?.text())
              );
            })
          ) {
            const pipeMethod = importStar ? `${importStar}.pipe` : 'pipe';
            if (!importStar) {
              addImport(`import { pipe } from "valibot"`);
              namedImports.push(`pipe`);
            }
            const replacement = `${pipeMethod}(${schema}(${rest.join(
              ', '
            )}), ${actions.map((node) => node.text()).join(', ')})`;
            replaced = true;
            return replacement;
          }
        }
      );
    }

    // Rewrite nested pipes
    replaced = true;
    while (replaced) {
      replaced = false;
      await astGrep`$OUTERPIPE($INNERPIPE($$$ARGS), $$$REST)`.replace(
        ({ getMatch, getMultipleMatches }) => {
          const outerPipe = getMatch('OUTERPIPE')?.text();
          const innerPipe = getMatch('INNERPIPE')?.text();
          if (isPipe(outerPipe) && isPipe(innerPipe)) {
            const importPipe = `${importStarOrNamed}pipe`;
            if (!importStar) {
              addImport(`import { pipe } from "valibot"`);
              namedImports.push(`pipe`);
            }
            replaced = true;
            return `${importPipe}(${[
              ...getMultipleMatches('ARGS')
                .filter((node) => node.kind() !== ',')
                .map((node) => node.text()),
              ...getMultipleMatches('REST')
                .filter((node) => node.kind() !== ',')
                .map((node) => node.text()),
            ].join(', ')})`;
          }
        }
      );
    }
  });
}
