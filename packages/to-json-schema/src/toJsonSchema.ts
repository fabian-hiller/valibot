import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import { createContext } from './context.ts';
import { convertSchema } from './convertSchema.ts';
import type { JsonSchemaConfig } from './type.ts';

/**
 * Converts a Valibot schema to the JSON schema format.
 *
 * @param schema The Valibot schema object.
 * @param config The JSON schema configuration.
 *
 * @returns The converted JSON schema.
 */
export function toJsonSchema(
  schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  config?: JsonSchemaConfig
): JSONSchema7 {
  const context = createContext(config);
  for (const [key, schema] of Object.entries(context.config.definitions)) {
    context.definitions[key] = convertSchema(
      {},
      // @ts-expect-error
      schema,
      context
    );
    context.definitionsPathMap.set(
      schema,
      `#/${context.config.definitionPath}/${key}`
    );
  }

  const converted = convertSchema(
    { $schema: 'http://json-schema.org/draft-07/schema#' },
    // @ts-expect-error
    schema,
    context
  );
  if (Object.keys(context.definitions).length > 0) {
    converted[context.config.definitionPath] = context.definitions;
  }
  return converted;
}
