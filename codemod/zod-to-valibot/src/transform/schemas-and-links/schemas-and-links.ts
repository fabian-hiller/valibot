import j from 'jscodeshift';
import { assertNever, getIsTypeFn } from '../../utils';
import {
  VALIDATOR_TO_ACTION,
  VALIDATOR_TO_NUM_ARGS,
  ZOD_COERCEABLE_SCHEMAS,
  ZOD_METHODS,
  ZOD_PROPERTIES,
  ZOD_RESULT_PROPERTIES,
  ZOD_SCHEMA_PROPERTIES,
  ZOD_SCHEMAS,
  ZOD_TO_VALI_METHOD,
  ZOD_UNCOERCEABLE_SCHEMAS,
  ZOD_VALIDATORS,
} from './constants';
import { transformDescription } from './properties';
import {
  type SchemaOptionsToASTVal,
  transformBigint,
  transformBoolean,
  transformDate,
  transformLiteral,
  transformNumber,
  transformString,
} from './schemas';

type UnknownPath = j.ASTPath<{ type: unknown }>;
type ZodSchemaName = (typeof ZOD_SCHEMAS)[number];
type ZodCoerceableSchemaName = (typeof ZOD_COERCEABLE_SCHEMAS)[number];
type ZodUncoerceableSchemaName = (typeof ZOD_UNCOERCEABLE_SCHEMAS)[number];
type ZodValidatorName = (typeof ZOD_VALIDATORS)[number];
type ZodMethodName = (typeof ZOD_METHODS)[number];
type ZodResultPropertyName = (typeof ZOD_RESULT_PROPERTIES)[number];
type ZodSchemaPropertyName = (typeof ZOD_SCHEMA_PROPERTIES)[number];

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
const isZodResultPropertyName = getIsTypeFn(ZOD_RESULT_PROPERTIES);
const isZodPropertyName = getIsTypeFn(ZOD_PROPERTIES);

function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodCoerceableSchemaName,
  options: SchemaOptionsToASTVal,
  argsExceptOptions: j.CallExpression['arguments'],
  coerceOption: boolean
): j.CallExpression;
function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodUncoerceableSchemaName,
  options: SchemaOptionsToASTVal,
  argsExceptOptions: j.CallExpression['arguments']
): j.CallExpression;
function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodSchemaName,
  options: SchemaOptionsToASTVal,
  argsExceptOptions: j.CallExpression['arguments'],
  coerceOption = false
): j.CallExpression {
  const args = [valibotIdentifier, options] as const;
  const argsWithCoerce = [...args, coerceOption] as const;
  switch (zodSchemaName) {
    case 'string':
      return transformString(...argsWithCoerce);
    case 'boolean':
      return transformBoolean(...argsWithCoerce);
    case 'number':
      return transformNumber(...argsWithCoerce);
    case 'bigint':
      return transformBigint(...argsWithCoerce);
    case 'date':
      return transformDate(...argsWithCoerce);
    case 'literal':
      return transformLiteral(...args, argsExceptOptions);
    default: {
      assertNever(zodSchemaName);
    }
  }
}

function getValidatorMsg(msgArg: j.CallExpression['arguments'][number]) {
  if (msgArg.type !== 'ObjectExpression') {
    return msgArg;
  }
  const msgVals = msgArg.properties
    .map((p) =>
      p.type === 'ObjectProperty' &&
      p.key.type === 'Identifier' &&
      p.key.name === 'message'
        ? p.value
        : null
    )
    .filter((v) => v !== null);
  const msgVal = msgVals.at(0);
  return msgVal === undefined ||
    msgVal.type === 'RestElement' ||
    msgVal.type === 'SpreadElementPattern' ||
    msgVal.type === 'PropertyPattern' ||
    msgVal.type === 'ObjectPattern' ||
    msgVal.type === 'ArrayPattern' ||
    msgVal.type === 'AssignmentPattern' ||
    msgVal.type === 'SpreadPropertyPattern' ||
    msgVal.type === 'TSParameterProperty'
    ? null
    : msgVal;
}

function toValibotActionExp(
  valibotIdentifier: string,
  zodValidatorName: ZodValidatorName,
  args: j.CallExpression['arguments']
) {
  const numArgs = VALIDATOR_TO_NUM_ARGS[zodValidatorName] ?? 1;
  let argsExceptMsg = args;
  const msgArg: j.CallExpression['arguments'] = [];
  if (args.length === numArgs) {
    argsExceptMsg = args.slice(0, args.length - 1);
    const msgVal = getValidatorMsg(args[args.length - 1]);
    if (msgVal !== null) {
      msgArg.push(msgVal);
    }
  }
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier(
        (zodValidatorName in VALIDATOR_TO_ACTION
          ? VALIDATOR_TO_ACTION[zodValidatorName]
          : null) ?? zodValidatorName
      )
    ),
    [...argsExceptMsg, ...msgArg]
  );
}

function toResultValiPropExp(
  objIdentifier: string,
  propertyName: ZodResultPropertyName
): j.MemberExpression {
  const codeShiftIdentifier = j.identifier(objIdentifier);
  switch (propertyName) {
    case 'data':
      return j.memberExpression(codeShiftIdentifier, j.identifier('output'));
    case 'error':
      return j.memberExpression(codeShiftIdentifier, j.identifier('issues'));
    default:
      assertNever(propertyName);
  }
}

function toSchemaValiPropExp(
  valibotIdentifier: string,
  obj: j.CallExpression | string,
  propertyName: ZodSchemaPropertyName
): j.CallExpression {
  const args = [
    valibotIdentifier,
    typeof obj === 'string' ? j.identifier(obj) : obj,
  ] as const;
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
      j.identifier(ZOD_TO_VALI_METHOD[zodMethodName] ?? zodMethodName)
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

export function getSchemaOptionVal(
  schemaArgs: j.CallExpression['arguments'],
  optionName: string
) {
  if (schemaArgs.length === 0) {
    return null;
  }
  const schemaArg = schemaArgs[schemaArgs.length - 1];
  if (schemaArg.type !== 'ObjectExpression') {
    return null;
  }
  const optionVals = schemaArg.properties
    .map((p) =>
      p.type === 'ObjectProperty' &&
      p.key.type === 'Identifier' &&
      p.key.name === optionName
        ? p.value
        : null
    )
    .filter((v) => v !== null);
  const optionVal = optionVals.at(0);
  return optionVal === undefined ||
    optionVal.type === 'RestElement' ||
    optionVal.type === 'SpreadElementPattern' ||
    optionVal.type === 'PropertyPattern' ||
    optionVal.type === 'ObjectPattern' ||
    optionVal.type === 'ArrayPattern' ||
    optionVal.type === 'AssignmentPattern' ||
    optionVal.type === 'SpreadPropertyPattern' ||
    optionVal.type === 'TSParameterProperty'
    ? null
    : optionVal;
}

// todo: support non boolean literal `coerce` values - z.string({coerce: someFuncCall()})
function getCoerce(schemaArgs: j.CallExpression['arguments']): boolean {
  const optionVal = getSchemaOptionVal(schemaArgs, 'coerce');
  return (
    optionVal !== null && optionVal.type === 'BooleanLiteral' && optionVal.value
  );
}

function transformSchemasAndLinksHelper(
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
          if (isZodResultPropertyName(propertyName)) {
            // should always be a direct property access
            if (transformedExp !== null) {
              skipTransform = true;
              break;
            }
            relevantExp.replace(toResultValiPropExp(identifier, propertyName));
          } else {
            relevantExp.replace(
              toSchemaValiPropExp(
                valibotIdentifier,
                transformedExp ?? identifier,
                propertyName
              )
            );
          }
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
        const schemaArgs = cur.value.arguments;
        const schemaOptionsToASTVal = {
          description: getSchemaOptionVal(schemaArgs, 'description'),
          invalid_type_error: getSchemaOptionVal(
            schemaArgs,
            'invalid_type_error'
          ),
          required_error: getSchemaOptionVal(schemaArgs, 'required_error'),
          message: getSchemaOptionVal(schemaArgs, 'message'),
        };
        const schemaArgsExceptOptions = schemaArgs.slice(
          0,
          schemaArgs.length - 1
        );
        const exp = isZodCoerceableSchemaName(propertyName)
          ? toValibotSchemaExp(
              valibotIdentifier,
              propertyName,
              schemaOptionsToASTVal,
              schemaArgsExceptOptions,
              coerce || getCoerce(cur.value.arguments)
            )
          : toValibotSchemaExp(
              valibotIdentifier,
              propertyName,
              schemaOptionsToASTVal,
              schemaArgsExceptOptions
            );
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
      const nxtPath = j.AwaitExpression.check(rootCallExpPath.parentPath.value)
        ? rootCallExpPath.parentPath
        : rootCallExpPath;
      if (
        j.VariableDeclarator.check(nxtPath.parentPath.value) &&
        j.Identifier.check(nxtPath.parentPath.value.id)
      ) {
        // transform links
        transformSchemasAndLinksHelper(
          root,
          valibotIdentifier,
          nxtPath.parentPath.value.id.name
        );
      }
    }
  }
}

export function transformSchemasAndLinks(
  root: j.Collection<unknown>,
  valibotIdentifier: string
) {
  transformSchemasAndLinksHelper(root, valibotIdentifier, valibotIdentifier);
}
