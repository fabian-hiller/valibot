import j from 'jscodeshift';
import {
  getDescription,
  getSchema,
  getSchemaWithOptionalDescription,
} from '../helpers';
import type { SchemaOptionsToASTVal } from '../types';

export function transformBoolean(
  valibotIdentifier: string,
  schemaOptions: SchemaOptionsToASTVal,
  coerce: boolean
) {
  const baseSchema = getSchema(valibotIdentifier, 'boolean', schemaOptions);
  if (coerce) {
    return j.callExpression(
      j.memberExpression(j.identifier(valibotIdentifier), j.identifier('pipe')),
      [
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('unknown')
          ),
          []
        ),
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('transform')
          ),
          [j.identifier('Boolean')]
        ),
        baseSchema,
        ...(schemaOptions.description
          ? [getDescription(valibotIdentifier, schemaOptions.description)]
          : []),
      ]
    );
  }
  return getSchemaWithOptionalDescription(
    valibotIdentifier,
    baseSchema,
    schemaOptions.description
  );
}
