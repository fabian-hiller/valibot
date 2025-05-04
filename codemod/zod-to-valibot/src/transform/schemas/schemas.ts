import j from 'jscodeshift';
import { getIsTypeFn } from '../../utils';
import { transformBigint } from './bigint';
import { transformBoolean } from './boolean';
import {
  VALIDATOR_TO_ACTION,
  ZOD_COERCEABLE_SCHEMAS,
  ZOD_METHODS,
  ZOD_SCHEMAS,
  ZOD_UNCOERCEABLE_SCHEMAS,
  ZOD_VALIDATORS,
} from './constants';
import { transformDate } from './date';
import { transformNumber } from './number';
import { transformString } from './string';

type UnknownPath = j.ASTPath<{ type: unknown }>;
type ZodSchemaName = (typeof ZOD_SCHEMAS)[number];
type ZodCoerceableSchemaName = (typeof ZOD_COERCEABLE_SCHEMAS)[number];
type ZodUncoerceableSchemaName = (typeof ZOD_UNCOERCEABLE_SCHEMAS)[number];
type ZodValidatorName = (typeof ZOD_VALIDATORS)[number];
type ZodMethodName = (typeof ZOD_METHODS)[number];

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
  let transformFn: (
    valibotIdentifier: string,
    coerce: boolean
  ) => j.CallExpression;
  switch (zodSchemaName) {
    case 'string':
      transformFn = transformString;
      break;
    case 'boolean':
      transformFn = transformBoolean;
      break;
    case 'number':
      transformFn = transformNumber;
      break;
    case 'bigint':
      transformFn = transformBigint;
      break;
    case 'date':
      transformFn = transformDate;
      break;
    default: {
      const _x: never = zodSchemaName;
      transformFn = () =>
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier(zodSchemaName)
          ),
          []
        );
    }
  }
  return transformFn(valibotIdentifier, coerce);
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

function toValibotMethodExp(
  valibotIdentifier: string,
  zodMethodName: ZodMethodName,
  schemaExp: j.CallExpression,
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
  addTo: j.CallExpression,
  add: j.CallExpression
): j.CallExpression {
  if (isPipeSchemaExp(addTo)) {
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

export function transformSchemas(
  root: j.Collection<unknown>,
  valibotIdentifier: string
) {
  // get the first call exp of the chain
  // example: v.string().email().trim() -> v.string()
  // or
  // get the first member exp with `coerce` property access of the chain
  // example: v.coerce.string() -> v.coerce
  const relevantExps = [
    ...root
      .find(j.CallExpression, {
        callee: {
          type: 'MemberExpression',
          object: { name: valibotIdentifier },
        },
      })
      .paths(),
    ...root
      .find(j.MemberExpression, {
        object: { name: valibotIdentifier },
        property: { type: 'Identifier', name: 'coerce' },
      })
      .paths(),
  ];
  for (const relevantExp of relevantExps) {
    let transformedExp: j.CallExpression | null = null;
    let cur: UnknownPath = relevantExp;
    let skipTransform = false;
    let rootCallExpPath: j.ASTPath<j.CallExpression> | null = null;
    let coerce = false;
    while (isMemberExp(cur) || isCallExp(cur)) {
      if (isMemberExp(cur)) {
        coerce =
          coerce ||
          (cur.value.property.type === 'Identifier' &&
            cur.value.property.name === 'coerce');
        cur = cur.parentPath;
        continue;
      }
      // `cur` is a CallExpression
      if (
        cur.value.callee.type !== 'MemberExpression' ||
        cur.value.callee.property.type !== 'Identifier'
      ) {
        // should always be: <SOME_PATH>.<IDENTIFIER>() else it's ambiguous enough
        // for now
        skipTransform = true;
        break;
      }
      rootCallExpPath = cur;
      const propertyName = cur.value.callee.property.name;
      if (transformedExp === null || isZodSchemaName(propertyName)) {
        if (!isZodSchemaName(propertyName)) {
          // the start of the transformed expression should always be a schema
          // if it's not a schema, it's invalid
          skipTransform = true;
          break;
        }
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
      } else if (isZodValidatorName(propertyName)) {
        transformedExp = addToPipe(
          valibotIdentifier,
          transformedExp,
          toValibotActionExp(
            valibotIdentifier,
            propertyName,
            cur.value.arguments
          )
        );
      } else if (isZodMethodName(propertyName)) {
        transformedExp = toValibotMethodExp(
          valibotIdentifier,
          propertyName,
          transformedExp,
          cur.value.arguments
        );
      } else {
        // `propertyName` is not a schema, validator, or method name
        // it's not safe to transform the chain
        skipTransform = true;
        break;
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
    }
  }
}
