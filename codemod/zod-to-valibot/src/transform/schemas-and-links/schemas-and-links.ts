import j from 'jscodeshift';
import { assertNever, getIsTypeFn } from '../../utils';
import {
  ZOD_COERCEABLE_SCHEMAS,
  ZOD_METHODS,
  ZOD_PROPERTIES,
  ZOD_RESULT_PROPERTIES,
  ZOD_SCHEMA_PROPERTIES,
  ZOD_SCHEMA_TO_NUM_ARGS,
  ZOD_SCHEMA_TO_TYPE,
  ZOD_SCHEMAS,
  ZOD_TO_VALI_METHOD,
  ZOD_UNCOERCEABLE_SCHEMAS,
  ZOD_VALIDATORS,
} from './constants';
import { transformDescription } from './properties';
import {
  transformBigint,
  transformBoolean,
  transformDate,
  transformLiteral,
  transformNumber,
  transformString,
} from './schemas';
import {
  transformBase64,
  transformCUID2,
  transformDateTime,
  transformDate as transformDateValidator,
  transformDescribe,
  transformEmail,
  transformEmoji,
  transformEndsWith,
  transformFinite,
  transformGt,
  transformGte,
  transformIncludes,
  transformIp,
  transformLength,
  transformLt,
  transformLte,
  transformMax,
  transformMin,
  transformMultipleOf,
  transformNanoid,
  transformNonEmpty,
  transformRegex,
  transformSize,
  transformStartsWith,
  transformTime,
  transformToLowerCase,
  transformToUpperCase,
  transformTrim,
  transformULID,
  transformUnimplemented,
  transformUrl,
  transformUUID,
} from './validators';

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
  inputArgs: j.CallExpression['arguments'],
  coerceOption: boolean
): j.CallExpression;
function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodUncoerceableSchemaName,
  inputArgs: j.CallExpression['arguments']
): j.CallExpression;
function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodSchemaName,
  inputArgs: j.CallExpression['arguments'],
  coerceOption = false
): j.CallExpression {
  const { firstArgs: argsExceptOptions, lastArg } = splitLastArg(
    ZOD_SCHEMA_TO_NUM_ARGS[zodSchemaName],
    inputArgs
  );
  const options = lastArg !== null ? getSchemaOptions(lastArg) : {};
  const args = [valibotIdentifier, options] as const;
  const argsWithCoerce = [
    ...args,
    coerceOption ||
      (options.coerce?.type === 'BooleanLiteral' && options.coerce.value),
  ] as const;
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

function splitLastArg(
  maxArgs: number,
  args: j.CallExpression['arguments']
): {
  firstArgs: j.CallExpression['arguments'];
  lastArg: j.CallExpression['arguments'][number] | null;
} {
  let firstArgs = args;
  let lastArg: j.CallExpression['arguments'][number] | null = null;
  if (args.length === maxArgs && maxArgs > 0) {
    firstArgs = args.slice(0, args.length - 1);
    lastArg = args[args.length - 1];
  }
  return { firstArgs, lastArg };
}

function toValibotActionExp(
  valibotIdentifier: string,
  zodValidatorName: ZodValidatorName,
  inputArgs: j.CallExpression['arguments'],
  schemaType: 'value' | 'length'
) {
  const args = [valibotIdentifier, inputArgs] as const;
  switch (zodValidatorName) {
    case 'base64':
      return transformBase64(...args);
    case 'base64url':
      return transformUnimplemented(...args, 'base64url');
    case 'cidr':
      return transformUnimplemented(...args, 'cidr');
    case 'cuid':
      return transformUnimplemented(...args, 'cuid');
    case 'cuid2':
      return transformCUID2(...args);
    case 'date':
      return transformDateValidator(...args);
    case 'datetime':
      return transformDateTime(...args);
    case 'describe':
      return transformDescribe(...args);
    case 'duration':
      return transformUnimplemented(...args, 'duration');
    case 'email':
      return transformEmail(...args);
    case 'emoji':
      return transformEmoji(...args);
    case 'endsWith':
      return transformEndsWith(...args);
    case 'finite':
      return transformFinite(...args);
    case 'includes':
      return transformIncludes(...args);
    case 'ip':
      return transformIp(...args);
    case 'jwt':
      return transformUnimplemented(...args, 'jwt');
    case 'length':
      return transformLength(...args);
    case 'max':
      return transformMax(...args, schemaType);
    case 'min':
      return transformMin(...args, schemaType);
    case 'multipleOf':
      return transformMultipleOf(...args);
    case 'nanoid':
      return transformNanoid(...args);
    case 'nonempty':
      return transformNonEmpty(...args);
    case 'regex':
      return transformRegex(...args);
    case 'size':
      return transformSize(...args);
    case 'startsWith':
      return transformStartsWith(...args);
    case 'toLowerCase':
      return transformToLowerCase(...args);
    case 'toUpperCase':
      return transformToUpperCase(...args);
    case 'trim':
      return transformTrim(...args);
    case 'url':
      return transformUrl(...args);
    case 'gt':
      return transformGt(...args);
    case 'gte':
      return transformGte(...args);
    case 'lt':
      return transformLt(...args);
    case 'lte':
      return transformLte(...args);
    case 'time':
      return transformTime(...args);
    case 'ulid':
      return transformULID(...args);
    case 'uuid':
      return transformUUID(...args);
    default:
      assertNever(zodValidatorName);
  }
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

function getSchemaOption(
  optionsArgs: j.CallExpression['arguments'][number],
  optionName: string
) {
  if (optionsArgs.type !== 'ObjectExpression') {
    return null;
  }
  const optionVals = optionsArgs.properties
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

function getSchemaOptions(
  optionsArgs: j.CallExpression['arguments'][number]
): Partial<
  Record<
    | 'description'
    | 'invalid_type_error'
    | 'required_error'
    | 'message'
    | 'coerce',
    ReturnType<typeof getSchemaOption>
  >
> {
  return {
    description: getSchemaOption(optionsArgs, 'description'),
    invalid_type_error: getSchemaOption(optionsArgs, 'invalid_type_error'),
    required_error: getSchemaOption(optionsArgs, 'required_error'),
    message: getSchemaOption(optionsArgs, 'message'),
    coerce: getSchemaOption(optionsArgs, 'coerce'),
  };
}

function transformSchemasAndLinksHelper(
  root: j.Collection<unknown>,
  valibotIdentifier: string,
  identifier: string,
  schemaType: 'value' | 'length' | null
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
    let curSchemaType = schemaType;
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
      // null check is needed for transforming validators that have same name as a schema
      // example: v.date(), v.string().date()
      if (transformedExp === null && isZodSchemaName(propertyName)) {
        // if the schema is already parsed, it's not safe to proceed
        if (curSchemaType !== null) {
          skipTransform = true;
          break;
        }
        curSchemaType = ZOD_SCHEMA_TO_TYPE[propertyName];
        transformedExp = isZodCoerceableSchemaName(propertyName)
          ? toValibotSchemaExp(
              valibotIdentifier,
              propertyName,
              cur.value.arguments,
              coerce
            )
          : toValibotSchemaExp(
              valibotIdentifier,
              propertyName,
              cur.value.arguments
            );
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
          if (curSchemaType === null) {
            // validators can only be applied to parsed schemas
            skipTransform = true;
            break;
          }
          transformedExp = addToPipe(
            valibotIdentifier,
            curSchema,
            toValibotActionExp(
              valibotIdentifier,
              propertyName,
              cur.value.arguments,
              curSchemaType
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
          nxtPath.parentPath.value.id.name,
          curSchemaType
        );
      }
    }
  }
}

export function transformSchemasAndLinks(
  root: j.Collection<unknown>,
  valibotIdentifier: string
) {
  transformSchemasAndLinksHelper(
    root,
    valibotIdentifier,
    valibotIdentifier,
    null
  );
}
