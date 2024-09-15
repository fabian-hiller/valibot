import type { BaseMetadata } from '../../types/index.ts';

/**
 * Metadata action type.
 */
export interface MetadataAction<
  TInput,
  TMetadata extends Record<string, unknown>,
> extends BaseMetadata<TInput> {
  /**
   * The action type.
   */
  readonly type: 'metadata';
  /**
   * The action reference.
   */
  readonly reference: typeof metadata;
  /**
   * The metadata object.
   */
  readonly metadata: TMetadata;
}

/**
 * Creates a custom metadata action.
 *
 * @param metadata_ The metadata object.
 *
 * @returns A metadata action.
 */
export function metadata<
  TInput,
  const TMetadata extends Record<string, unknown>,
>(metadata_: TMetadata): MetadataAction<TInput, TMetadata> {
  return {
    kind: 'metadata',
    type: 'metadata',
    reference: metadata,
    metadata: metadata_,
  };
}
