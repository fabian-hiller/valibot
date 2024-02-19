import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  MaybePromise,
  Output,
} from '../../types/index.ts';

/**
 * Recursive schema async type.
 */
export type RecursiveSchemaAsync<
  TGetter extends (
    input: unknown
  ) => MaybePromise<BaseSchema | BaseSchemaAsync>,
  TOutput = Output<Awaited<ReturnType<TGetter>>>
> = BaseSchemaAsync<Input<Awaited<ReturnType<TGetter>>>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'recursive';
  /**
   * The schema getter.
   */
  getter: TGetter;
};

/**
 * Creates an async recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns An async recursive schema.
 */
export function recursiveAsync<
  TGetter extends (input: unknown) => MaybePromise<BaseSchema | BaseSchemaAsync>
>(getter: TGetter): RecursiveSchemaAsync<TGetter> {
  return {
    type: 'recursive',
    expects: 'unknown',
    async: true,
    getter,
    async _parse(input, config) {
      return (await this.getter(input))._parse(input, config);
    },
  };
}
