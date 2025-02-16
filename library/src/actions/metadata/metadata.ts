import type { BaseMetadata } from '../../types/index.ts';

/**
 * Metadata action interface.
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
// @__NO_SIDE_EFFECTS__
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
