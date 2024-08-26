import type { JSONSchema7 } from 'json-schema';
import type {
  BaseIssue,
  GenericSchema,
  PipeItem,
  SchemaWithPipe,
} from 'valibot';
import type { ConversionOptions } from '../types.ts';
import { convertValidation } from '../validation-converters/index.ts';
import { any, type SupportedAnySchema } from './any/index.ts';
import { null_, type SupportedNullSchema } from './null/index.ts';
import { object, type SupportedObjectSchema } from './object/index.ts';
import { string, type SupportedStringSchema } from './string/index.ts';
import type { SchemaConverter, SchemaConverters } from './types.ts';

/** Union type of all supported schema */
export type SupportedSchema =
  | SupportedAnySchema
  | SupportedNullSchema
  | SupportedStringSchema
  | SupportedObjectSchema;

/** Map schema types to converters */
export const SCHEMA_CONVERTERS: SchemaConverters<SupportedSchema> = {
  any,
  null: null_,
  string,
  object,
};

function getSchemaConverter(
  schema: GenericSchema
): SchemaConverter<GenericSchema> | undefined {
  return SCHEMA_CONVERTERS[(schema as SupportedSchema).type] as
    | SchemaConverter<GenericSchema>
    | undefined;
}

/**
 * Check if schema has a pipe
 *
 * @param schema schema to test
 *
 * @returns whether the schema has pipe or not
 */
function hasPipe<TSchema extends GenericSchema>(
  schema: TSchema
): schema is TSchema &
  SchemaWithPipe<
    [TSchema, ...PipeItem<unknown, unknown, BaseIssue<unknown>>[]]
  > {
  return 'pipe' in schema;
}

/**
 * Convert any supported schema into JSON schema
 *
 * @param schema validation to convert
 * @param options    conversion options
 *
 * @returns converted JSON schema
 */
export function convertSchema(
  schema: GenericSchema,
  options?: ConversionOptions
): JSONSchema7 {
  const converter = getSchemaConverter(schema);
  if (!converter) {
    // Force conversion => output an empty JSON Schema
    if (options?.force) return {};
    throw new Error(`Unknown schema type '${schema.type}'`);
  }

  // Convert base schema
  const converted = converter(schema, convertSchema);

  // Convert pipe items
  if (hasPipe(schema)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, ...pipeItems] = schema.pipe;
    for (const pipeItem of pipeItems) {
      if (pipeItem.kind === 'validation') {
        // Merge converted validation into it's base schema
        Object.assign(converted, convertValidation(pipeItem, options));
      } else if (!options?.force) {
        throw new Error(`Unknown action kind '${pipeItem.kind}'`);
      }
    }
  }

  return converted;
}
