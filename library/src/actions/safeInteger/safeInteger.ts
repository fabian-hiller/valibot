import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * Safe integer issue type.
 */
export interface SafeIntegerIssue<TInput extends number>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'safe_integer';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `${number}`;
  /**
   * The validation function.
   */
  readonly requirement: (input: number) => boolean;
}

/**
 * Safe integer validation type.
 */
export interface SafeIntegerAction<
  TInput extends number,
  TMessage extends ErrorMessage<SafeIntegerIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, SafeIntegerIssue<TInput>> {
  /**
   * The validation type.
   */
  readonly type: 'safe_integer';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: number) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a safe integer validation action.
 *
 * @returns A safe integer action.
 */
export function safeInteger<TInput extends number>(): SafeIntegerAction<
  TInput,
  undefined
>;

/**
 * Creates a safe integer validation action.
 *
 * @param message The error message.
 *
 * @returns A safe integer action.
 */
export function safeInteger<
  TInput extends number,
  const TMessage extends ErrorMessage<SafeIntegerIssue<TInput>> | undefined,
>(message: TMessage): SafeIntegerAction<TInput, TMessage>;

export function safeInteger(
  message?: ErrorMessage<SafeIntegerIssue<number>>
): SafeIntegerAction<
  number,
  ErrorMessage<SafeIntegerIssue<number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'safe_integer',
    expects: null,
    async: false,
    message,
    requirement: Number.isSafeInteger,
    _run(dataset, config) {
      return _validationDataset(
        this,
        safeInteger,
        'safeInteger',
        dataset.typed && !this.requirement(dataset.value),
        dataset,
        config
      );
    },
  };
}
