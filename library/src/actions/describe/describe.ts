import type { BaseMetadata } from '../../types/metadata';

/**
 * Describe action type.
 */
export interface DescribeAction<TInput, TDescription extends string>
  extends BaseMetadata<TInput> {
  /**
   * The metadata type.
   */
  readonly type: 'describe';
  /**
   * The metadata reference.
   */
  readonly reference: typeof describe;

  readonly extraProperties: {
    description: TDescription;
  };
}

/**
 * Describe metadata type.
 *
 * @param description The description value.
 *
 * @returns A describe action.
 */
export function describe<TInput, TDescription extends string>(
  description: TDescription
): DescribeAction<TInput, TDescription> {
  return {
    kind: 'metadata',
    type: 'describe',
    reference: describe,
    extraProperties: {
      description,
    },
  };
}
