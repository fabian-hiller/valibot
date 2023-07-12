import type { BaseSchema, BaseSchemaAsync, Input, Output } from '../../types';

/**
 * Recursive schema async type.
 */
export type RecursiveSchemaAsync<
  TSchemaGetter extends () => BaseSchema | BaseSchemaAsync,
  TOutput = Output<ReturnType<TSchemaGetter>>
> = BaseSchemaAsync<Input<ReturnType<TSchemaGetter>>, TOutput> & {
  schema: 'recursive';
  getter: TSchemaGetter;
};

/**
 * Creates an async recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns An async recursive schema.
 */
export function recursiveAsync<
  TSchemaGetter extends () => BaseSchema | BaseSchemaAsync
>(getter: TSchemaGetter): RecursiveSchemaAsync<TSchemaGetter> {
  return {
    /**
     * The schema type.
     */
    schema: 'recursive',

    /**
     * The schema getter.
     */
    getter,

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
      return getter().parse(input, info);
    },
  };
}
