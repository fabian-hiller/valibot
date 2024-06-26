import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Function issue type.
 */
export interface FunctionIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'function';
  /**
   * The expected property.
   */
  readonly expected: 'Function';
}

/**
 * Function schema type.
 */
export interface FunctionSchema<
  TMessage extends ErrorMessage<FunctionIssue> | undefined,
> extends BaseSchema<
    (...args: unknown[]) => unknown,
    (...args: unknown[]) => unknown,
    FunctionIssue
  > {
  /**
   * The schema type.
   */
  readonly type: 'function';
  /**
   * The schema reference.
   */
  readonly reference: typeof function_;
  /**
   * The expected property.
   */
  readonly expects: 'Function';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a function schema.
 *
 * @returns A function schema.
 */
export function function_(): FunctionSchema<undefined>;

/**
 * Creates a function schema.
 *
 * @param message The error message.
 *
 * @returns A function schema.
 */
export function function_<
  const TMessage extends ErrorMessage<FunctionIssue> | undefined,
>(message: TMessage): FunctionSchema<TMessage>;

export function function_(
  message?: ErrorMessage<FunctionIssue>
): FunctionSchema<ErrorMessage<FunctionIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'function',
    reference: function_,
    expects: 'Function',
    async: false,
    message,
    _run(dataset, config) {
      if (typeof dataset.value === 'function') {
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as Dataset<(...args: unknown[]) => unknown, FunctionIssue>;
    },
  };
}

export { function_ as function };
