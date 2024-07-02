import type { BaseMetadata } from '../../types/metadata';

/**
 * WithDescription metadata type.
 */
export interface WithDescriptionMetadata<TInput, TDescription extends string>
  extends BaseMetadata<TInput> {
  /**
   * The metadata type.
   */
  readonly type: 'with_description';
  /**
   * The metadata reference.
   */
  readonly reference: typeof withDescription;

  readonly extraProperties: {
    description: TDescription;
  };
}

/**
 * Creates a with-description metadata.
 *
 * @param description The description value.
 *
 * @returns A WithDescription metadata.
 */
export function withDescription<TInput, TDescription extends string>(
  description: TDescription
): WithDescriptionMetadata<TInput, TDescription> {
  return {
    kind: 'metadata',
    type: 'with_description',
    reference: withDescription,
    extraProperties: {
      description,
    },
  };
}
