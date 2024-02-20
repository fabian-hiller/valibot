import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  MaybePromise,
  Output,
  SchemaMetadata,
} from '../../types/index.ts';

/**
 * Lazy schema async type.
 */
export type LazySchemaAsync<
  TGetter extends (
    input: unknown
  ) => MaybePromise<BaseSchema | BaseSchemaAsync>,
  TOutput = Output<Awaited<ReturnType<TGetter>>>
> = BaseSchemaAsync<Input<Awaited<ReturnType<TGetter>>>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'lazy';
  /**
   * The schema getter.
   */
  getter: TGetter;
};

/**
 * Creates an async lazy schema.
 *
 * @param getter The schema getter.
 * @param metadata The schema metadata.
 *
 * @returns An async lazy schema.
 */
export function lazyAsync<
  TGetter extends (input: unknown) => MaybePromise<BaseSchema | BaseSchemaAsync>
>(getter: TGetter, metadata?: SchemaMetadata): LazySchemaAsync<TGetter> {
  return {
    type: 'lazy',
    expects: 'unknown',
    async: true,
    getter,
    metadata,
    async _parse(input, config) {
      return (await this.getter(input))._parse(input, config);
    },
  };
}

/**
 * See {@link lazyAsync}
 *
 * @deprecated Use `lazyAsync` instead.
 */
export const recursiveAsync = lazyAsync;
