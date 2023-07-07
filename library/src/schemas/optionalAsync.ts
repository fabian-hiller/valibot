import type { BaseSchema, BaseSchemaAsync, Input, Output } from '../types';

/**
 * Optional schema async type.
 */
export type OptionalSchemaAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync,
  TOutput = Output<TWrappedSchema> | undefined
> = BaseSchemaAsync<Input<TWrappedSchema> | undefined, TOutput> & {
  schema: 'optional';
  wrapped: TWrappedSchema;
};

/**
 * Creates an async optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async optional schema.
 */
export function optionalAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync
>(wrapped: TWrappedSchema): OptionalSchemaAsync<TWrappedSchema> {
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
      // Allow `undefined` values to pass
      if (input === undefined) {
        return input;
      }

      // Parse wrapped schema and return output
      return wrapped.parse(input, info);
    },
  };
}
