import type { BaseSchema, Input, Output } from '../../types.ts';

/**
 * Nullish schema type.
 */
export type NullishSchema<
  TWrappedSchema extends BaseSchema,
  TOutput = Output<TWrappedSchema> | null | undefined
> = BaseSchema<Input<TWrappedSchema> | null | undefined, TOutput> & {
  schema: 'nullish';
  wrapped: TWrappedSchema;
};

/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullish schema.
 */
export function nullish<TWrappedSchema extends BaseSchema>(
  wrapped: TWrappedSchema
): NullishSchema<TWrappedSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'nullish',

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
      // Allow `null` or `undefined` values to pass
      if (input === null || input === undefined) {
        return { output: input };
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
