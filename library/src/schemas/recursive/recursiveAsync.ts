import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';

/**
 * Recursive schema async type.
 */
export type RecursiveSchemaAsync<
  TSchemaGetter extends () => BaseSchema | BaseSchemaAsync,
  TOutput = Output<ReturnType<TSchemaGetter>>
> = BaseSchemaAsync<Input<ReturnType<TSchemaGetter>>, TOutput> & {
  type: 'recursive';
  /**
   * The schema getter.
   */
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
    type: 'recursive',
    async: true,
    getter,
    async _parse(input, info) {
      return getter()._parse(input, info);
    },
  };
}
