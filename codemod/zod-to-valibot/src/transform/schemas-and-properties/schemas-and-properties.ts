import j from 'jscodeshift';
import { assertNever, getIsTypeFn } from '../../utils';
import {
  VALIDATOR_TO_ACTION,
  ZOD_COERCEABLE_SCHEMAS,
  ZOD_METHODS,
  ZOD_PROPERTIES,
  ZOD_SCHEMAS,
  ZOD_UNCOERCEABLE_SCHEMAS,
  ZOD_VALIDATORS,
} from './constants';
import { transformDescription } from './properties';
import {
  transformBigint,
  transformBoolean,
  transformDate,
  transformNumber,
  transformString,
} from './schemas';

type UnknownPath = j.ASTPath<{ type: unknown }>;
type ZodSchemaName = (typeof ZOD_SCHEMAS)[number];
type ZodCoerceableSchemaName = (typeof ZOD_COERCEABLE_SCHEMAS)[number];
type ZodUncoerceableSchemaName = (typeof ZOD_UNCOERCEABLE_SCHEMAS)[number];
type ZodValidatorName = (typeof ZOD_VALIDATORS)[number];
type ZodMethodName = (typeof ZOD_METHODS)[number];
type ZodPropertyName = (typeof ZOD_PROPERTIES)[number];

function isCallExp(path: UnknownPath): path is j.ASTPath<j.CallExpression> {
  return path.value.type === 'CallExpression';
}

function isMemberExp(path: UnknownPath): path is j.ASTPath<j.MemberExpression> {
  return path.value.type === 'MemberExpression';
}

const isPipeSchemaExp = (callExp: j.CallExpression) =>
  callExp.callee.type === 'MemberExpression' &&
  callExp.callee.property.type === 'Identifier' &&
  callExp.callee.property.name === 'pipe';

const isZodSchemaName = getIsTypeFn(ZOD_SCHEMAS);
const isZodCoerceableSchemaName = getIsTypeFn(ZOD_COERCEABLE_SCHEMAS);
const isZodValidatorName = getIsTypeFn(ZOD_VALIDATORS);
const isZodMethodName = getIsTypeFn(ZOD_METHODS);
const isZodPropertyName = getIsTypeFn(ZOD_PROPERTIES);

function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodCoerceableSchemaName,
  coerce: boolean
): j.CallExpression;
function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodUncoerceableSchemaName
): j.CallExpression;
function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodSchemaName,
  coerce = false
): j.CallExpression {
  const args = [valibotIdentifier, coerce] as const;
  switch (zodSchemaName) {
    case 'string':
      return transformString(...args);
    case 'boolean':
      return transformBoolean(...args);
    case 'number':
      return transformNumber(...args);
    case 'bigint':
      return transformBigint(...args);
    case 'date':
      return transformDate(...args);
    default: {
      assertNever(zodSchemaName);
    }
  }
}

function toValibotActionExp(
  valibotIdentifier: string,
  zodValidatorName: ZodValidatorName,
  args: j.CallExpression['arguments']
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier(
        (zodValidatorName in VALIDATOR_TO_ACTION
          ? VALIDATOR_TO_ACTION[zodValidatorName]
          : null) ?? zodValidatorName
      )
    ),
    args
  );
}

function toValibotPropertyExp(
  valibotIdentifier: string,
  schema: j.CallExpression | j.Identifier,
  propertyName: ZodPropertyName
): j.CallExpression {
  const args = [valibotIdentifier, schema] as const;
  switch (propertyName) {
    case 'description':
      return transformDescription(...args);
    default:
      assertNever(propertyName);
  }
}

function toValibotMethodExp(
  valibotIdentifier: string,
  zodMethodName: ZodMethodName,
  schemaExp: j.CallExpression | j.Identifier,
  args: j.CallExpression['arguments']
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier(zodMethodName)
    ),
    [schemaExp, ...args]
  );
}

function addToPipe(
  valibotIdentifier: string,
  addTo: j.CallExpression | j.Identifier,
  add: j.CallExpression
): j.CallExpression {
  if (addTo.type === 'CallExpression' && isPipeSchemaExp(addTo)) {
    addTo.arguments.push(add);
    return addTo;
  }
  return j.callExpression(
    j.memberExpression(j.identifier(valibotIdentifier), j.identifier('pipe')),
    [addTo, add]
  );
}

// todo: support non boolean literal `coerce` values - z.string({coerce: someFuncCall()})
function getCoerce(schemaArgs: j.CallExpression['arguments']): boolean {
  if (schemaArgs.length === 0) {
    return false;
  }
  const [schemaArg] = schemaArgs;
  if (schemaArg.type !== 'ObjectExpression') {
    return false;
  }
  const coerceOptionVals = schemaArg.properties
    .map((p) =>
      p.type === 'ObjectProperty' &&
      p.key.type === 'Identifier' &&
      p.key.name === 'coerce'
        ? p.value
        : null
    )
    .filter((v) => v !== null);
  if (coerceOptionVals.length === 0) {
    return false;
  }
  const [coerceOptionVal] = coerceOptionVals;
  return coerceOptionVal.type === 'BooleanLiteral' && coerceOptionVal.value;
}

function transformSchemasAndPropertiesHelper(
  root: j.Collection<unknown>,
  valibotIdentifier: string,
  identifier: string
): void {
  const isValibotIdentifier = identifier === valibotIdentifier;
  const relevantExps: (
    | j.ASTPath<j.CallExpression>
    | j.ASTPath<j.MemberExpression>
  )[] =
    // the first call exp of the chain
    // example: v.string().email().trim() -> v.string()
    root
      .find(j.CallExpression, {
        callee: {
          type: 'MemberExpression',
          object: { name: identifier },
        },
      })
      .paths();
  if (isValibotIdentifier) {
    // the first member exp with `coerce` property access of the chain
    // example: v.coerce.string() -> v.coerce
    relevantExps.push(
      ...root
        .find(j.MemberExpression, {
          object: { name: identifier },
          property: { type: 'Identifier', name: 'coerce' },
        })
        .paths()
    );
  } else {
    // property access
    relevantExps.push(
      ...root
        .find(j.MemberExpression, { object: { name: identifier } })
        .filter(
          (p) =>
            p.value.property.type === 'Identifier' &&
            isZodPropertyName(p.value.property.name)
        )
        .paths()
    );
  }
  main: for (const relevantExp of relevantExps) {
    let transformedExp: j.CallExpression | null = null;
    let cur: UnknownPath = relevantExp;
    let skipTransform = false;
    let rootCallExpPath: j.ASTPath<j.CallExpression> | null = null;
    let coerce = false;
    while (isMemberExp(cur) || isCallExp(cur)) {
      if (isMemberExp(cur)) {
        if (cur.value.property.type !== 'Identifier') {
          // should always be an identifier
          skipTransform = true;
          break;
        }
        const propertyName = cur.value.property.name;
        // `coerce` is a special case
        if (propertyName === 'coerce') {
          coerce = true;
        } else if (isZodPropertyName(propertyName)) {
          if (coerce || isValibotIdentifier) {
            // 1. `coerce` directly before a property is invalid
            // 2. property access should always be from a schema not from the import identifier
            skipTransform = true;
            break;
          }
          relevantExp.replace(
            toValibotPropertyExp(
              valibotIdentifier,
              transformedExp ?? j.identifier(identifier),
              propertyName
            )
          );
          continue main;
        }
        cur = cur.parentPath;
        continue;
      }
      // `cur` is a CallExpression
      if (
        cur.value.callee.type !== 'MemberExpression' ||
        cur.value.callee.property.type !== 'Identifier'
      ) {
        // should always be: <SOME_PATH>.<IDENTIFIER>() else it's ambiguous enough for now
        skipTransform = true;
        break;
      }
      rootCallExpPath = cur;
      const propertyName = cur.value.callee.property.name;
      if (isZodSchemaName(propertyName)) {
        const exp = isZodCoerceableSchemaName(propertyName)
          ? toValibotSchemaExp(
              valibotIdentifier,
              propertyName,
              coerce || getCoerce(cur.value.arguments)
            )
          : toValibotSchemaExp(valibotIdentifier, propertyName);
        transformedExp =
          transformedExp === null
            ? exp
            : addToPipe(valibotIdentifier, transformedExp, exp);
      } else {
        if (isValibotIdentifier && transformedExp === null) {
          // the start of the transformed expression should always be a schema
          skipTransform = true;
          break;
        }
        const curSchema = transformedExp ?? j.identifier(identifier);
        if (isZodMethodName(propertyName)) {
          transformedExp = toValibotMethodExp(
            valibotIdentifier,
            propertyName,
            curSchema,
            cur.value.arguments
          );
        } else if (isZodValidatorName(propertyName)) {
          transformedExp = addToPipe(
            valibotIdentifier,
            curSchema,
            toValibotActionExp(
              valibotIdentifier,
              propertyName,
              cur.value.arguments
            )
          );
        } else {
          // `propertyName` is not a schema, validator, or method name
          // it's not safe to transform the chain
          skipTransform = true;
          break;
        }
      }
      coerce = false;
      cur = cur.parentPath;
    }
    if (
      !skipTransform &&
      // If either of the values is null, it's a bug
      transformedExp !== null &&
      rootCallExpPath !== null
    ) {
      rootCallExpPath.replace(transformedExp);
      if (
        rootCallExpPath.parentPath.value.type === 'VariableDeclarator' &&
        rootCallExpPath.parentPath.value.id.type === 'Identifier'
      ) {
        // transform links
        transformSchemasAndPropertiesHelper(
          root,
          valibotIdentifier,
          rootCallExpPath.parentPath.value.id.name
        );
      }
    }
  }
}

export function transformSchemasAndProperties(
  root: j.Collection<unknown>,
  valibotIdentifier: string
) {
  transformSchemasAndPropertiesHelper(
    root,
    valibotIdentifier,
    valibotIdentifier
  );
}
