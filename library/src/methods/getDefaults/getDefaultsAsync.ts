import type {
  NullableSchema,
  NullableSchemaAsync,
  NullishSchema,
  NullishSchemaAsync,
  ObjectSchema,
  OptionalSchema,
  OptionalSchemaAsync,
  TupleSchema,
} from '../../schemas/index.ts';
import type { BaseSchema, BaseSchemaAsync } from '../../types.ts';
import type { DefaultValues } from './types.ts';

/**
 * Returns the default values of the schema.
 *
 * @param schema The schema to get the default values from.
 *
 * @returns The default values.
 */
export async function getDefaultsAsync<
  TSchema extends BaseSchema | BaseSchemaAsync
>(schema: TSchema): Promise<DefaultValues<TSchema>> {
  // Create defaults variable
  let defaults: any;

  // If it is an optional, nullable or nullish schema, set its default value
  if (
    schema.schema === 'optional' ||
    schema.schema === 'nullable' ||
    schema.schema === 'nullish'
  ) {
    defaults = await (
      schema as unknown as
        | OptionalSchema<any, unknown>
        | OptionalSchemaAsync<any, unknown>
        | NullableSchema<any, unknown>
        | NullableSchemaAsync<any, unknown>
        | NullishSchema<any, unknown>
        | NullishSchemaAsync<any, unknown>
    ).getDefault();

    // If it is an object schema, set object with default value of each entry
  } else if (schema.schema === 'object') {
    defaults = {};
    await Promise.all(
      Object.entries(
        (schema as unknown as ObjectSchema<Record<string, BaseSchema>>).object
          .entries
      ).map(async ([key, schema]) => {
        defaults[key] = await getDefaultsAsync(schema);
      })
    );

    // If it is a tuple schema, set array with default value of each item
  } else if (schema.schema === 'tuple') {
    defaults = await Promise.all(
      (
        schema as unknown as TupleSchema<[BaseSchema, ...BaseSchema[]]>
      ).tuple.items.map((schema) => getDefaultsAsync(schema))
    );
  }

  // Return default values
  return defaults;
}
