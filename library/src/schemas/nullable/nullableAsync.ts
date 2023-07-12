import type { BaseSchema, BaseSchemaAsync, Input, Output } from '../../types';

/**
 * Nullable schema async type.
 */
export type NullableSchemaAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync,
  TOutput = Output<TWrappedSchema> | null
> = BaseSchemaAsync<Input<TWrappedSchema> | null, TOutput> & {
  schema: 'nullable';
  wrapped: TWrappedSchema;
};

/**
 * Creates an async nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async nullable schema.
 */
export function nullableAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync
>(wrapped: TWrappedSchema): NullableSchemaAsync<TWrappedSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'nullable',

    /**
     * The wrapped schema.
     */
    wrapped,

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async parse(input, info) {
      // Allow `null` values to pass
      if (input === null) {
        return input;
      }

      // Parse wrapped schema and return output
      return wrapped.parse(input, info);
    },
  };
}
