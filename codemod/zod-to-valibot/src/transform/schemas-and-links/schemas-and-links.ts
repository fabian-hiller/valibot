import j from 'jscodeshift';
import { assertNever, getIsTypeFn } from '../../utils';
import {
  ZOD_METHODS,
  ZOD_PROPERTIES,
  ZOD_RESULT_PROPERTIES,
  ZOD_SCHEMA_PROPERTIES,
  ZOD_SCHEMAS,
  ZOD_VALIDATORS,
  ZOD_VALUE_TYPE_SCHEMAS,
} from './constants';
import {
  transformExtract,
  transformKeyof,
  transformNullable as transformNullableMethod,
  transformNullish,
  transformOptional as transformOptionalMethod,
  transformParse,
  transformParseAsync,
  transformSafeParse,
  transformSafeParseAsync,
  transformUnwrap,
} from './methods';
import { transformDescription, transformShape } from './properties';
import {
  transformBigint,
  transformBoolean,
  transformDate,
  transformEnum,
  transformLiteral,
  transformNativeEnum,
  transformNullable,
  transformNumber,
  transformObject,
  transformOptional,
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
  transformInt,
  transformIp,
  transformLength,
  transformLt,
  transformLte,
  transformMax,
  transformMin,
  transformMultipleOf,
  transformNanoid,
  transformNegative,
  transformNonEmpty,
  transformNonNegative,
  transformNonPositive,
  transformPositive,
  transformRegex,
  transformSafe,
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
const isZodValidatorName = getIsTypeFn(ZOD_VALIDATORS);
const isZodMethodName = getIsTypeFn(ZOD_METHODS);
const isZodResultPropertyName = getIsTypeFn(ZOD_RESULT_PROPERTIES);
const isZodPropertyName = getIsTypeFn(ZOD_PROPERTIES);
const isZodValueTypeSchemaName = getIsTypeFn(ZOD_VALUE_TYPE_SCHEMAS);

function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodSchemaName,
  inputArgs: j.CallExpression['arguments'],
  coerceOption = false
): j.CallExpression {
  const args = [valibotIdentifier, inputArgs] as const;
  const argsWithCoerce = [...args, coerceOption] as const;
  switch (zodSchemaName) {
    case 'string':
      return transformString(...argsWithCoerce);
    case 'boolean':
      return transformBoolean(...argsWithCoerce);
    case 'nativeEnum':
      return transformNativeEnum(...args);
    case 'nullable':
      return transformNullable(...args);
    case 'number':
      return transformNumber(...argsWithCoerce);
    case 'bigint':
      return transformBigint(...argsWithCoerce);
    case 'date':
      return transformDate(...argsWithCoerce);
    case 'enum':
      return transformEnum(...args);
    case 'literal':
      return transformLiteral(...args);
    case 'object':
      return transformObject(...args);
    case 'optional':
      return transformOptional(...args);
    default: {
      assertNever(zodSchemaName);
    }
  }
}

function toValibotActionExp(
  valibotIdentifier: string,
  zodValidatorName: ZodValidatorName,
  inputArgs: j.CallExpression['arguments'],
  isValueTypeSchema: boolean,
  useBigInt: boolean
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
    case 'int':
      return transformInt(...args);
    case 'ip':
      return transformIp(...args);
    case 'jwt':
      return transformUnimplemented(...args, 'jwt');
    case 'length':
      return transformLength(...args);
    case 'max':
      return transformMax(...args, isValueTypeSchema);
    case 'min':
      return transformMin(...args, isValueTypeSchema);
    case 'multipleOf':
      return transformMultipleOf(...args);
    case 'nanoid':
      return transformNanoid(...args);
    case 'negative':
      return transformNegative(...args, useBigInt);
    case 'nonempty':
      return transformNonEmpty(...args);
    case 'nonnegative':
      return transformNonNegative(...args, useBigInt);
    case 'nonpositive':
      return transformNonPositive(...args, useBigInt);
    case 'positive':
      return transformPositive(...args, useBigInt);
    case 'regex':
      return transformRegex(...args);
    case 'safe':
      return transformSafe(...args);
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
  obj: j.CallExpression | j.Identifier,
  propertyName: ZodSchemaPropertyName
): j.CallExpression | j.MemberExpression {
  const args = [valibotIdentifier, obj] as const;
  switch (propertyName) {
    case 'description':
      return transformDescription(...args);
    case 'shape':
      return transformShape(obj);
    default:
      assertNever(propertyName);
  }
}

function toValibotMethodExp(
  valibotIdentifier: string,
  zodMethodName: ZodMethodName,
  schemaExp: j.CallExpression | j.Identifier,
  inputArgs: j.CallExpression['arguments']
) {
  const args = [valibotIdentifier, schemaExp, inputArgs] as const;
  switch (zodMethodName) {
    case 'extract':
      return transformExtract(valibotIdentifier, inputArgs);
    case 'keyof':
      return transformKeyof(...args);
    case 'optional':
      return transformOptionalMethod(...args);
    case 'nullable':
      return transformNullableMethod(...args);
    case 'parse':
      return transformParse(...args);
    case 'parseAsync':
      return transformParseAsync(...args);
    case 'safeParse':
      return transformSafeParse(...args);
    case 'safeParseAsync':
    case 'spa':
      return transformSafeParseAsync(...args);
    case 'unwrap':
      return transformUnwrap(...args);
    case 'nullish':
      return transformNullish(...args);
    default:
      assertNever(zodMethodName);
  }
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

function transformSchemasAndLinksHelper(
  root: j.Collection<unknown>,
  valibotIdentifier: string,
  identifier: string,
  isValueTypeSchema: boolean | null
): void {
  const isValibotIdentifier = identifier === valibotIdentifier;
  const relevantExps = root
    .find(j.MemberExpression, {
      object: { name: identifier },
    })
    .paths()
    // to make sure nested schemas are transformed first
    .reverse();
  main: for (const relevantExp of relevantExps) {
    let transformedExp: j.CallExpression | null = null;
    let skipTransform = false;
    let rootCallExp: j.ASTPath<j.CallExpression> | null = null;
    let coerce = false;
    let isCurValueTypeSchema = isValueTypeSchema;
    let useBigInt = false;
    let cur: UnknownPath = relevantExp;
    while (isMemberExp(cur) || isCallExp(cur)) {
      if (isMemberExp(cur)) {
        if (cur.value.property.type !== 'Identifier') {
          // the property name must always be an indentifier as
          // extracting the property name might get tricky otherwise
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
                transformedExp ?? j.identifier(identifier),
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
        // the property name must always be an indentifier as
        // extracting the property name might get tricky otherwise
        skipTransform = true;
        break;
      }
      const prevRootCallExp = rootCallExp;
      rootCallExp = cur;
      const propertyName = cur.value.callee.property.name;
      if (
        isValibotIdentifier &&
        prevRootCallExp === null &&
        isZodSchemaName(propertyName)
      ) {
        // the schema is already parsed
        if (transformedExp !== null || isCurValueTypeSchema !== null) {
          skipTransform = true;
          break;
        }
        isCurValueTypeSchema = isZodValueTypeSchemaName(propertyName);
        useBigInt = propertyName === 'bigint';
        transformedExp = toValibotSchemaExp(
          valibotIdentifier,
          propertyName,
          cur.value.arguments,
          coerce
        );
      } else {
        if (isValibotIdentifier && transformedExp === null) {
          // the schema should be known
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
          if (isCurValueTypeSchema === null) {
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
              isCurValueTypeSchema,
              useBigInt
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
      // the values should be set
      transformedExp !== null &&
      rootCallExp !== null
    ) {
      rootCallExp.replace(transformedExp);
      const nxtPath = j.AwaitExpression.check(rootCallExp.parentPath.value)
        ? rootCallExp.parentPath
        : rootCallExp;
      if (
        j.VariableDeclarator.check(nxtPath.parentPath.value) &&
        j.Identifier.check(nxtPath.parentPath.value.id)
      ) {
        // transform links
        transformSchemasAndLinksHelper(
          root,
          valibotIdentifier,
          nxtPath.parentPath.value.id.name,
          isCurValueTypeSchema
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
