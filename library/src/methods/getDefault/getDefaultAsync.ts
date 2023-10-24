import type {
  NullableSchema,
  NullableSchemaAsync,
  NullishSchema,
  NullishSchemaAsync,
  OptionalSchema,
  OptionalSchemaAsync,
} from '../../schemas/index.ts';

/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get the default value from.
 *
 * @returns The default value.
 */
export async function getDefaultAsync<
  TSchema extends
    | OptionalSchema<any, any>
    | OptionalSchemaAsync<any, any>
    | NullableSchema<any, any>
    | NullableSchemaAsync<any, any>
    | NullishSchema<any, any>
    | NullishSchemaAsync<any, any>
>(schema: TSchema): Promise<ReturnType<TSchema['getDefault']>> {
  return schema.getDefault();
}
