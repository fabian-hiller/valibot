import type { BaseIssue, BaseSchema, ErrorMessage } from '../../types/index.ts';
import { _schemaDataset } from '../../utils/index.ts';

/**
 * Void issue type.
 */
export interface VoidIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'void';
  /**
   * The expected input.
   */
  readonly expected: 'void';
}

/**
 * Void schema type.
 */
export interface VoidSchema<
  TMessage extends ErrorMessage<VoidIssue> | undefined,
> extends BaseSchema<void, void, VoidIssue> {
  /**
   * The schema type.
   */
  readonly type: 'void';
  /**
   * The expected property.
   */
  readonly expects: 'void';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a void schema.
 *
 * @returns A void schema.
 */
export function void_(): VoidSchema<undefined>;

/**
 * Creates a void schema.
 *
 * @param message The error message.
 *
 * @returns A void schema.
 */
export function void_<
  const TMessage extends ErrorMessage<VoidIssue> | undefined,
>(message: TMessage): VoidSchema<TMessage>;

export function void_(
  message?: ErrorMessage<VoidIssue>
): VoidSchema<ErrorMessage<VoidIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'void',
    expects: 'void',
    async: false,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        void_,
        dataset.value === undefined,
        dataset,
        config
      );
    },
  };
}
