import j from 'jscodeshift';
import { getSchema, getSchemaWithOptionalDescription } from '../helpers';
import type { SchemaOptionsToASTVal } from '../types';

export function transformLiteral(
  valibotIdentifier: string,
  schemaOptions: SchemaOptionsToASTVal,
  argsExceptOptions: j.CallExpression['arguments']
) {
  return getSchemaWithOptionalDescription(
    valibotIdentifier,
    getSchema(valibotIdentifier, 'literal', schemaOptions, argsExceptOptions),
    schemaOptions.description
  );
}
