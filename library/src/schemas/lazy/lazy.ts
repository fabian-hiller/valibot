import type {
  BaseSchema,
  Input,
  Output,
  SchemaMetadata,
} from '../../types/index.ts';

/**
 * Lazy schema type.
 */
export type LazySchema<
  TGetter extends (input: unknown) => BaseSchema,
  TOutput = Output<ReturnType<TGetter>>
> = BaseSchema<Input<ReturnType<TGetter>>, TOutput> & {
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
 * Creates a lazy schema.
 *
 * @param getter The schema getter.
 * @param metadata The schema metadata.
 *
 * @returns A lazy schema.
 */
export function lazy<TGetter extends (input: unknown) => BaseSchema>(
  getter: TGetter,
  metadata?: SchemaMetadata
): LazySchema<TGetter> {
  return {
    type: 'lazy',
    expects: 'unknown',
    async: false,
    getter,
    metadata,
    _parse(input, config) {
      return this.getter(input)._parse(input, config);
    },
  };
}

/**
 * See {@link lazy}
 *
 * @deprecated Use `lazy` instead.
 */
export const recursive = lazy;
