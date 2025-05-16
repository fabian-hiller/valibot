import j from 'jscodeshift';
import { getSchema, getSchemaWithOptionalDescription } from '../helpers';
import type { SchemaOptionsToASTVal } from '../types';

export function transformLiteral(
  valibotIdentifier: string,
  schemaOptions: SchemaOptionsToASTVal,
  argsExceptOptions: j.CallExpression['arguments']
) {
  let schemaName: 'null' | 'undefined' | 'literal' = 'literal';
  // The `literal` schema has at least one argument
  // todo: find a way to check the assumption is correct and bail out if required
  const [valArg] = argsExceptOptions;
  if (
    valArg.type === 'NullLiteral' ||
    (valArg.type === 'Identifier' && valArg.name === 'undefined')
  ) {
    argsExceptOptions = argsExceptOptions.slice(1);
    schemaName = valArg.type === 'NullLiteral' ? 'null' : 'undefined';
  }
  return getSchemaWithOptionalDescription(
    valibotIdentifier,
    getSchema(valibotIdentifier, schemaName, schemaOptions, argsExceptOptions),
    schemaOptions.description
  );
}
