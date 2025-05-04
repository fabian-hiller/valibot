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

function isPathCallExp(path: UnknownPath): path is j.ASTPath<j.CallExpression> {
  return path.value.type === 'CallExpression';
}

function isPathMemberExp(
  path: UnknownPath
): path is j.ASTPath<j.MemberExpression> {
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
  return coerceOptionVal.type === 'BooleanLiteral'
    ? coerceOptionVal.value
    : false;
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
    let transformedRelevantExp: j.CallExpression | null = null;
    let curPath: UnknownPath = relevantExp;
    let skipTransform = false;
    let rootCallExpPath: j.ASTPath<j.CallExpression> | null = null;
    let coerce = false;
    while (isPathMemberExp(curPath) || isPathCallExp(curPath)) {
      if (isPathMemberExp(curPath)) {
        coerce =
          coerce ||
          (curPath.value.property.type === 'Identifier' &&
            curPath.value.property.name === 'coerce');
        curPath = curPath.parentPath;
        continue;
      }
      // `curPath` is a CallExpression
      if (
        curPath.value.callee.type !== 'MemberExpression' ||
        curPath.value.callee.property.type !== 'Identifier'
      ) {
        /*
          should always be: <SOME_PATH>.<IDENTIFIER>() else it's ambiguous enough 
          for now
        */
        skipTransform = true;
        break;
      }
      rootCallExpPath = curPath;
      const propertyName = curPath.value.callee.property.name;
      if (transformedRelevantExp === null || isZodSchemaName(propertyName)) {
        if (!isZodSchemaName(propertyName)) {
          /*
            the start of the transformed call expression should always be a schema
            if it's not a schema, it's invalid
          */
          skipTransform = true;
          break;
        }
        const exp = isZodCoerceableSchemaName(propertyName)
          ? toValibotSchemaExp(
              valibotIdentifier,
              propertyName,
              coerce || getCoerce(curPath.value.arguments)
            )
          : toValibotSchemaExp(valibotIdentifier, propertyName);
        transformedRelevantExp =
          transformedRelevantExp === null
            ? exp
            : addToPipe(valibotIdentifier, transformedRelevantExp, exp);
      } else if (isZodValidatorName(propertyName)) {
        transformedRelevantExp = addToPipe(
          valibotIdentifier,
          transformedRelevantExp,
          toValibotActionExp(
            valibotIdentifier,
            propertyName,
            curPath.value.arguments
          )
        );
      } else if (isZodMethodName(propertyName)) {
        transformedRelevantExp = toValibotMethodExp(
          valibotIdentifier,
          propertyName,
          transformedRelevantExp,
          curPath.value.arguments
        );
      } else {
        /*
          `propertyName` is not a schema, validator, or method name
          it's not safe to transform the chain
        */
        skipTransform = true;
        break;
      }
      coerce = false;
      curPath = curPath.parentPath;
    }
    if (
      !skipTransform &&
      // If either of the values is null, it's a bug
      transformedRelevantExp !== null &&
      rootCallExpPath !== null
    ) {
      rootCallExpPath.replace(transformedRelevantExp);
    }
  }
}
