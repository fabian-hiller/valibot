import type {
  NullableSchema,
  NullishSchema,
  ObjectSchema,
  OptionalSchema,
  TupleSchema,
} from '../../schemas/index.ts';
import type { BaseSchema } from '../../types.ts';
import type { DefaultValues } from './types.ts';

/**
 * Returns the default values of the schema.
 *
 * @param schema The schema to get the default values from.
 *
 * @returns The default values.
 */
export function getDefaults<TSchema extends BaseSchema>(
  schema: TSchema
): DefaultValues<TSchema> {
  // Create defaults variable
  let defaults: any;

  // If it is an optional, nullable or nullish schema, set its default value
  if (
    schema.schema === 'optional' ||
    schema.schema === 'nullable' ||
    schema.schema === 'nullish'
  ) {
    defaults = (
      schema as unknown as
        | OptionalSchema<any, unknown>
        | NullableSchema<any, unknown>
        | NullishSchema<any, unknown>
    ).getDefault();

    // If it is an object schema, set object with default value of each entry
  } else if (schema.schema === 'object') {
    defaults = {};
    for (const key in (
      schema as unknown as ObjectSchema<Record<string, BaseSchema>>
    ).object.entries) {
      defaults[key] = getDefaults(
        (schema as unknown as ObjectSchema<Record<string, BaseSchema>>).object
          .entries[key]
      );
    }

    // If it is a tuple schema, set array with default value of each item
  } else if (schema.schema === 'tuple') {
    defaults = [];
    for (
      let key = 0;
      key <
      (schema as unknown as TupleSchema<[BaseSchema, ...BaseSchema[]]>).tuple
        .items.length;
      key++
    ) {
      defaults.push(
        getDefaults(
          (schema as unknown as TupleSchema<[BaseSchema, ...BaseSchema[]]>)
            .tuple.items[key]
        )
      );
    }
  }

  // Return default values
  return defaults;
}
