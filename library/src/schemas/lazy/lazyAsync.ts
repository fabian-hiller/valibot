import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  MaybePromise,
  Output,
} from '../../types/index.ts';

/**
 * Lazy schema async type.
 */
export interface LazySchemaAsync<
  TGetter extends (
    input: unknown
  ) => MaybePromise<BaseSchema | BaseSchemaAsync>,
  TOutput = Output<Awaited<ReturnType<TGetter>>>,
> extends BaseSchemaAsync<Input<Awaited<ReturnType<TGetter>>>, TOutput> {
  /**
   * The schema type.
   */
  type: 'lazy';
  /**
   * The schema getter.
   */
  getter: TGetter;
}

/**
 * Creates an async lazy schema.
 *
 * @param getter The schema getter.
 *
 * @returns An async lazy schema.
 */
export function lazyAsync<
  TGetter extends (
    input: unknown
  ) => MaybePromise<BaseSchema | BaseSchemaAsync>,
>(getter: TGetter): LazySchemaAsync<TGetter> {
  return {
    type: 'lazy',
    expects: 'unknown',
    async: true,
    getter,
    async _parse(input, config) {
      return (await this.getter(input))._parse(input, config);
    },
  };
}
