import j from 'jscodeshift';
import { assertNever, getIsTypeFn } from '../../utils';
import {
  ZOD_METHODS,
  ZOD_PROPERTIES,
  ZOD_SCHEMA_TO_TYPE,
  ZOD_SCHEMAS,
  ZOD_VALIDATORS,
  ZOD_VALUE_TYPE_SCHEMAS,
} from './constants';
import {
  transformArray as transformArrayMethod,
  transformDefault,
  transformExtract,
  transformKeyof,
  transformNullable as transformNullableMethod,
  transformNullish,
  transformOmit,
  transformOptional as transformOptionalMethod,
  transformParse,
  transformParseAsync,
  transformPartial,
  transformPassthrough,
  transformPick,
  transformRequired,
  transformSafeParse,
  transformSafeParseAsync,
  transformStrict,
  transformStrip,
  transformUnwrap,
} from './methods';
import {
  transformDescription,
  transformElement,
  transformShape,
} from './properties';
import {
  transformArray,
  transformBigint,
  transformBoolean,
  transformDate,
  transformDiscriminatedUnion,
  transformEnum,
  transformInstanceof,
  transformLiteral,
  transformMap,
  transformNativeEnum,
  transformNullable,
  transformNumber,
  transformObject,
  transformOptional,
  transformRecord,
  transformSet,
  transformString,
} from './schemas';
import { ZodSchemaType } from './types';
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
  transformReadonly,
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
const isZodValidatorName = getIsTypeFn(ZOD_VALIDATORS);
const isZodMethodName = getIsTypeFn(ZOD_METHODS);
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
    case 'array':
      return transformArray(...args);
    case 'string':
      return transformString(...argsWithCoerce);
    case 'boolean':
      return transformBoolean(...argsWithCoerce);
    case 'discriminatedUnion':
      return transformDiscriminatedUnion(...args);
    case 'instanceof':
      return transformInstanceof(...args);
    case 'map':
      return transformMap(...args);
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
    case 'record':
      return transformRecord(...args);
    case 'set':
      return transformSet(...args);
    default: {
      assertNever(zodSchemaName);
    }
  }
}

function toValibotActionExp(
  valibotIdentifier: string,
  zodValidatorName: ZodValidatorName,
  inputArgs: j.CallExpression['arguments'],
  schemaType: ZodSchemaType,
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
      return transformMax(...args, schemaType);
    case 'min':
      return transformMin(...args, schemaType);
    case 'multipleOf':
      return transformMultipleOf(...args);
    case 'nanoid':
      return transformNanoid(...args);
    case 'negative':
      return transformNegative(...args, useBigInt);
    case 'nonempty':
      return transformNonEmpty(...args, schemaType === 'size');
    case 'nonnegative':
      return transformNonNegative(...args, useBigInt);
    case 'nonpositive':
      return transformNonPositive(...args, useBigInt);
    case 'positive':
      return transformPositive(...args, useBigInt);
    case 'readonly':
      return transformReadonly(valibotIdentifier);
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

function toValiPropExp(
  valibotIdentifier: string,
  exp: j.CallExpression | j.MemberExpression | j.Identifier,
  propertyName: ZodPropertyName
) {
  switch (propertyName) {
    case 'data':
      return j.memberExpression(exp, j.identifier('output'));
    case 'description':
      return transformDescription(valibotIdentifier, exp);
    case 'element':
      return transformElement(exp);
    case 'error':
      return j.memberExpression(exp, j.identifier('issues'));
    case 'shape':
      return transformShape(exp);
    default:
      assertNever(propertyName);
  }
}

function toValibotMethodExp(
  valibotIdentifier: string,
  zodMethodName: ZodMethodName,
  schemaExp: j.CallExpression | j.MemberExpression | j.Identifier,
  inputArgs: j.CallExpression['arguments']
) {
  const args = [valibotIdentifier, schemaExp, inputArgs] as const;
  switch (zodMethodName) {
    case 'array':
      return transformArrayMethod(...args);
    case 'default':
      return transformDefault(...args);
    case 'extract':
      return transformExtract(valibotIdentifier, inputArgs);
    case 'keyof':
      return transformKeyof(...args);
    case 'omit':
      return transformOmit(...args);
    case 'optional':
      return transformOptionalMethod(...args);
    case 'nullable':
      return transformNullableMethod(...args);
    case 'parse':
      return transformParse(...args);
    case 'parseAsync':
      return transformParseAsync(...args);
    case 'partial':
      return transformPartial(...args);
    case 'passthrough':
      return transformPassthrough(valibotIdentifier, schemaExp);
    case 'pick':
      return transformPick(...args);
    case 'required':
      return transformRequired(...args);
    case 'safeParse':
      return transformSafeParse(...args);
    case 'safeParseAsync':
    case 'spa':
      return transformSafeParseAsync(...args);
    case 'strict':
      return transformStrict(valibotIdentifier, schemaExp);
    case 'strip':
      return transformStrip(valibotIdentifier, schemaExp);
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
  addTo: j.CallExpression | j.MemberExpression | j.Identifier,
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
  schemaType: ZodSchemaType | null
) {
  const relevantExps = root
    .find(j.MemberExpression, {
      object: { name: identifier },
    })
    .paths()
    // to make sure nested schemas are transformed first
    .reverse();
  main: for (const relevantExp of relevantExps) {
    let transformedExp:
      | j.CallExpression
      | j.MemberExpression
      | j.Identifier
      | null = null;
    let transformLinks = true;
    let coerce = false;
    let useBigInt = false;
    let curSchemaType = schemaType;
    let cur: UnknownPath = relevantExp;
    let rootExp:
      | j.ASTPath<j.CallExpression>
      | j.ASTPath<j.MemberExpression>
      | null = null;
    let knownRootExp:
      | j.ASTPath<j.CallExpression>
      | j.ASTPath<j.MemberExpression>
      | null = null;
    while (isMemberExp(cur) || isCallExp(cur)) {
      rootExp = cur;
      if (isMemberExp(cur)) {
        if (cur.value.property.type !== 'Identifier') {
          // the property name must always be an indentifier as
          // extracting the property name might get tricky otherwise
          transformLinks = false;
          break;
        }
        const propertyName = cur.value.property.name;
        // `coerce` is a special case
        if (propertyName === 'coerce') {
          coerce = true;
        } else if (isZodPropertyName(propertyName)) {
          coerce = false;
          transformedExp = toValiPropExp(
            valibotIdentifier,
            transformedExp ?? j.identifier(identifier),
            propertyName
          );
        } else if (!isCallExp(cur.parentPath)) {
          // unknown property name
          transformLinks = false;
          break;
        }
        knownRootExp = cur;
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
        transformLinks = false;
        break;
      }
      const propertyName = cur.value.callee.property.name;
      if (curSchemaType === null && isZodSchemaName(propertyName)) {
        curSchemaType = ZOD_SCHEMA_TO_TYPE[propertyName];
        useBigInt = propertyName === 'bigint';
        transformedExp = toValibotSchemaExp(
          valibotIdentifier,
          propertyName,
          cur.value.arguments,
          coerce
        );
      } else if (isZodMethodName(propertyName)) {
        transformedExp = toValibotMethodExp(
          valibotIdentifier,
          propertyName,
          transformedExp ?? j.identifier(identifier),
          cur.value.arguments
        );
      } else if (isZodValidatorName(propertyName)) {
        if (curSchemaType === null) {
          // validators can only be applied to parsed schemas
          transformLinks = false;
          break;
        }
        transformedExp = addToPipe(
          valibotIdentifier,
          transformedExp ?? j.identifier(identifier),
          toValibotActionExp(
            valibotIdentifier,
            propertyName,
            cur.value.arguments,
            curSchemaType,
            useBigInt
          )
        );
      } else {
        // `propertyName` is not a schema, validator, or method name
        // it's not safe to transform the chain
        transformLinks = false;
        break;
      }
      coerce = false;
      knownRootExp = cur;
      cur = cur.parentPath;
    }
    if (transformedExp !== null) {
      knownRootExp?.replace(transformedExp);
    }
    if (transformLinks && rootExp !== null) {
      const nxtPath = j.AwaitExpression.check(rootExp.parentPath.value)
        ? rootExp.parentPath
        : rootExp;
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
