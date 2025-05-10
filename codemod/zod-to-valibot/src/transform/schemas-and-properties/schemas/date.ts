import j from 'jscodeshift';
import { getSchema, getSchemaWithOptionalDescription } from './helpers';
import type { SchemaOptionsToASTVal } from './types';

export function transformDate(
  valibotIdentifier: string,
  schemaOptions: SchemaOptionsToASTVal,
  coerce: boolean
) {
  const baseSchema = getSchema(valibotIdentifier, 'date', schemaOptions);
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
                      j.newExpression(j.identifier('Date'), [
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
          ? [getSchema(valibotIdentifier, 'description', schemaOptions)]
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
