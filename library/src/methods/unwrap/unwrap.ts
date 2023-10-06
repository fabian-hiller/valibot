import type {
  NonNullableSchema,
  NonNullableSchemaAsync,
  NonNullishSchema,
  NonNullishSchemaAsync,
  NonOptionalSchema,
  NonOptionalSchemaAsync,
  NullableSchema,
  NullableSchemaAsync,
  NullishSchema,
  NullishSchemaAsync,
  OptionalSchema,
  OptionalSchemaAsync,
} from '../../schemas/index.ts';

/**
 * Unwraps the wrapped schema.
 *
 * @param schema The schema to be unwrapped.
 *
 * @returns The unwrapped schema.
 */
export function unwrap<
  TSchema extends
    | OptionalSchema<any, any>
    | OptionalSchemaAsync<any, any>
    | NullableSchema<any, any>
    | NullableSchemaAsync<any, any>
    | NullishSchema<any, any>
    | NullishSchemaAsync<any, any>
    | NonOptionalSchema<any>
    | NonOptionalSchemaAsync<any>
    | NonNullableSchema<any>
    | NonNullableSchemaAsync<any>
    | NonNullishSchema<any>
    | NonNullishSchemaAsync<any>
>(schema: TSchema): TSchema['wrapped'] {
  return schema.wrapped;
}
