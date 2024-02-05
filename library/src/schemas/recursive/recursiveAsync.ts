import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';

/**
 * Recursive schema async type.
 */
export interface RecursiveSchemaAsync<
  TGetter extends () => BaseSchema | BaseSchemaAsync,
  TOutput = Output<ReturnType<TGetter>>
> extends BaseSchemaAsync<Input<ReturnType<TGetter>>, TOutput> {
  /**
   * The schema type.
   */
  type: 'recursive';
  /**
   * The schema getter.
   */
  getter: TGetter;
}

/**
 * Creates an async recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns An async recursive schema.
 */
export function recursiveAsync<
  TGetter extends () => BaseSchema | BaseSchemaAsync
>(getter: TGetter): RecursiveSchemaAsync<TGetter> {
  return {
    type: 'recursive',
    expects: 'unknown',
    async: true,
    getter,
    async _parse(input, config) {
      return this.getter()._parse(input, config);
    },
  };
}
