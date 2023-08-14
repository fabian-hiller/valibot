import type { BaseSchema, Input, Output } from '../../types.ts';

/**
 * Nullable schema type.
 */
export type NullableSchema<
  TWrappedSchema extends BaseSchema,
  TOutput = Output<TWrappedSchema> | null
> = BaseSchema<Input<TWrappedSchema> | null, TOutput> & {
  schema: 'nullable';
  wrapped: TWrappedSchema;
};

/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullable schema.
 */
export function nullable<TWrappedSchema extends BaseSchema>(
  wrapped: TWrappedSchema
): NullableSchema<TWrappedSchema> {
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
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Allow `null` values to pass
      if (input === null) {
        return { output: input };
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
