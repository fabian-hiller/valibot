import j from 'jscodeshift';
import { ZOD_METHODS, ZOD_SCHEMAS, ZOD_VALIDATORS } from './constants';

type UnknownPath = j.ASTPath<{ type: unknown }>;
type ZodSchemaName = (typeof ZOD_SCHEMAS)[number];
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

const zodSchemaNames = new Set<string>(ZOD_SCHEMAS);
const isZodSchemaName = (name: string): name is ZodSchemaName =>
  zodSchemaNames.has(name);

const zodValidatorNames = new Set<string>(ZOD_VALIDATORS);
const isZodValidatorName = (name: string): name is ZodValidatorName =>
  zodValidatorNames.has(name);

const zodMethodNames = new Set<string>(ZOD_METHODS);
const isZodMethodName = (name: string): name is ZodMethodName =>
  zodMethodNames.has(name);

function toValibotSchemaExp(
  valibotIdentifier: string,
  zodSchemaName: ZodSchemaName
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier(zodSchemaName)
    ),
    []
  );
}

function toValibotActionExp(
  valibotIdentifier: string,
  zodValidatorName: ZodValidatorName
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier(zodValidatorName)
    ),
    []
  );
}

function toValibotMethodExp(
  valibotIdentifier: string,
  zodMethodName: ZodMethodName,
  schemaExp: j.CallExpression,
  // todo: replace `any` with a suitable type
  args: any[]
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier(zodMethodName)
    ),
    [schemaExp, ...args]
  );
}

export function transformSchemas(
  root: j.Collection<unknown>,
  valibotIdentifier: string
) {
  // get the first call exps of the chain
  // example: v.string().email().trim() -> z.string()
  const callExps = root.find(j.CallExpression, {
    callee: { type: 'MemberExpression', object: { name: valibotIdentifier } },
  });
  for (const callExp of callExps.paths()) {
    let transformedCallExp: j.CallExpression | null = null;
    let curPath: UnknownPath = callExp;
    let skipTransform = false;
    let rootCallExpPath: j.ASTPath<j.CallExpression> | null = null;
    while (isPathMemberExp(curPath) || isPathCallExp(curPath)) {
      if (isPathMemberExp(curPath)) {
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
      if (transformedCallExp === null) {
        if (!isZodSchemaName(propertyName)) {
          /*
            the start of the transformed call expression should always be a schema
            if it's not a schema, it's invalid
          */
          skipTransform = true;
          break;
        }
        transformedCallExp = toValibotSchemaExp(
          valibotIdentifier,
          propertyName
        );
      } else if (
        isZodSchemaName(propertyName) ||
        isZodValidatorName(propertyName)
      ) {
        const exp = isZodSchemaName(propertyName)
          ? toValibotSchemaExp(valibotIdentifier, propertyName)
          : toValibotActionExp(valibotIdentifier, propertyName);
        if (isPipeSchemaExp(transformedCallExp)) {
          transformedCallExp.arguments.push(exp);
        } else {
          transformedCallExp = j.callExpression(
            j.memberExpression(
              j.identifier(valibotIdentifier),
              j.identifier('pipe')
            ),
            [transformedCallExp, exp]
          );
        }
      } else if (isZodMethodName(propertyName)) {
        const test = curPath.value.arguments;
        transformedCallExp = toValibotMethodExp(
          valibotIdentifier,
          propertyName,
          transformedCallExp,
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
      curPath = curPath.parentPath;
    }
    if (
      !skipTransform &&
      // If either of the values is null, it's a bug
      transformedCallExp !== null &&
      rootCallExpPath !== null
    ) {
      rootCallExpPath.replace(transformedCallExp);
    }
  }
}
