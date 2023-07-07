import type { BaseSchema, Input, Output } from '../types';

/**
 * Optional schema type.
 */
export type OptionalSchema<
  TWrappedSchema extends BaseSchema,
  TOutput = Output<TWrappedSchema> | undefined
> = BaseSchema<Input<TWrappedSchema> | undefined, TOutput> & {
  schema: 'optional';
  wrapped: TWrappedSchema;
};

/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A optional schema.
 */
export function optional<TWrappedSchema extends BaseSchema>(
  wrapped: TWrappedSchema
): OptionalSchema<TWrappedSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'optional',

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
    parse(input, info) {
      // Allow `undefined` values to pass
      if (input === undefined) {
        return input;
      }

      // Parse wrapped schema and return output
      return wrapped.parse(input, info);
    },
  };
}
