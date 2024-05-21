import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Undefined issue type.
 */
export interface UndefinedIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'undefined';
  /**
   * The expected property.
   */
  readonly expected: 'undefined';
}

/**
 * Undefined schema type.
 */
export interface UndefinedSchema<
  TMessage extends ErrorMessage<UndefinedIssue> | undefined,
> extends BaseSchema<undefined, undefined, UndefinedIssue> {
  /**
   * The schema type.
   */
  readonly type: 'undefined';
  /**
   * The schema reference.
   */
  readonly reference: typeof undefined_;
  /**
   * The expected property.
   */
  readonly expects: 'undefined';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an undefined schema.
 *
 * @returns An undefined schema.
 */
export function undefined_(): UndefinedSchema<undefined>;

/**
 * Creates an undefined schema.
 *
 * @param message The error message.
 *
 * @returns An undefined schema.
 */
export function undefined_<
  const TMessage extends ErrorMessage<UndefinedIssue> | undefined,
>(message: TMessage): UndefinedSchema<TMessage>;

export function undefined_(
  message?: ErrorMessage<UndefinedIssue>
): UndefinedSchema<ErrorMessage<UndefinedIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'undefined',
    reference: undefined_,
    expects: 'undefined',
    async: false,
    message,
    _run(dataset, config) {
      if (dataset.value === undefined) {
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as Dataset<undefined, UndefinedIssue>;
    },
  };
}
