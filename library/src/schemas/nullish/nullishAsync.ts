import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';

/**
 * Nullish schema async type.
 */
export type NullishSchemaAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync,
  TOutput = Output<TWrappedSchema> | null | undefined
> = BaseSchemaAsync<Input<TWrappedSchema> | null | undefined, TOutput> & {
  schema: 'nullish';
  wrapped: TWrappedSchema;
};

/**
 * Creates an async nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async nullish schema.
 */
export function nullishAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync
>(wrapped: TWrappedSchema): NullishSchemaAsync<TWrappedSchema> {
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
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Allow `null` or `undefined` values to pass
      if (input === null || input === undefined) {
        return { output: input };
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
