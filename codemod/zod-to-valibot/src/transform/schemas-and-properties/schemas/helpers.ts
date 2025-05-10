import j from 'jscodeshift';
import type { SchemaOptionsToASTVal } from './types';

function getTransformedSchemaOptions(schemaOptions: SchemaOptionsToASTVal) {
  return schemaOptions.message
    ? [schemaOptions.message]
    : schemaOptions.required_error
      ? [
          j.arrowFunctionExpression(
            [j.identifier('issue')],
            j.conditionalExpression(
              j.binaryExpression(
                '===',
                j.memberExpression(
                  j.identifier('issue'),
                  j.identifier('input')
                ),
                j.identifier('undefined')
              ),
              schemaOptions.required_error,
              schemaOptions.invalid_type_error ??
                j.memberExpression(
                  j.identifier('issue'),
                  j.identifier('message')
                )
            ),
            true
          ),
        ]
      : schemaOptions.invalid_type_error
        ? [schemaOptions.invalid_type_error]
        : [];
}

export function getSchema(
  valibotIdentifier: string,
  schemaName: string,
  schemaOptions: SchemaOptionsToASTVal,
  argsExceptOptions?: j.CallExpression['arguments']
): j.CallExpression {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier(schemaName)
    ),
    [
      ...(argsExceptOptions ?? []),
      ...getTransformedSchemaOptions(schemaOptions),
    ]
  );
}

export function getDescription(
  valibotIdentifier: string,
  description: SchemaOptionsToASTVal['description'] & {}
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier('description')
    ),
    [description]
  );
}

export function getSchemaWithOptionalDescription(
  valibotIdentifier: string,
  schema: j.CallExpression,
  description: SchemaOptionsToASTVal['description']
) {
  return description
    ? j.callExpression(
        j.memberExpression(
          j.identifier(valibotIdentifier),
          j.identifier('pipe')
        ),
        [schema, getDescription(valibotIdentifier, description)]
      )
    : schema;
}
