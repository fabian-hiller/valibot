import j from 'jscodeshift';
import {
  getDescription,
  getSchema,
  getSchemaWithOptionalDescription,
} from './helpers';
import type { SchemaOptionsToASTVal } from './types';

export function transformBigint(
  valibotIdentifier: string,
  schemaOptions: SchemaOptionsToASTVal,
  coerce: boolean
) {
  const baseSchema = getSchema(valibotIdentifier, 'bigint', schemaOptions);
  if (coerce) {
    return j.callExpression(
      j.memberExpression(j.identifier(valibotIdentifier), j.identifier('pipe')),
      [
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('any')
          ),
          []
        ),
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('transform')
          ),
          [
            j.arrowFunctionExpression(
              [j.identifier('input')],
              j.blockStatement([
                j.tryStatement(
                  j.blockStatement([
                    j.returnStatement(
                      j.callExpression(j.identifier('BigInt'), [
                        j.identifier('input'),
                      ])
                    ),
                  ]),
                  j.catchClause(
                    null,
                    null,
                    j.blockStatement([j.returnStatement(j.identifier('input'))])
                  )
                ),
              ]),
              false
            ),
          ]
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
