import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

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
   * The expected property.
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
   * The schema reference.
   */
  readonly reference: typeof void_;
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
    reference: void_,
    expects: 'void',
    async: false,
    message,
    _run(dataset, config) {
      if (dataset.value === undefined) {
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as Dataset<void, VoidIssue>;
    },
  };
}
