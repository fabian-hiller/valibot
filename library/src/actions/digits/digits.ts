import { DIGITS_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Digits issue type.
 */
export interface DigitsIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'digits';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The digits regex.
   */
  readonly requirement: RegExp;
}

/**
 * Digits action type.
 */
export interface DigitsAction<
  TInput extends string,
  TMessage extends ErrorMessage<DigitsIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, DigitsIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'digits';
  /**
   * The action reference.
   */
  readonly reference: typeof digits;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The digits regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [digits](https://en.wikipedia.org/wiki/Numerical_digit) validation action.
 *
 * @returns An digits action.
 */
export function digits<TInput extends string>(): DigitsAction<
  TInput,
  undefined
>;

/**
 * Creates a [digits](https://en.wikipedia.org/wiki/Numerical_digit) validation action.
 *
 * @param message The error message.
 *
 * @returns An digits action.
 */
export function digits<
  TInput extends string,
  const TMessage extends ErrorMessage<DigitsIssue<TInput>> | undefined,
>(message: TMessage): DigitsAction<TInput, TMessage>;

export function digits(
  message?: ErrorMessage<DigitsIssue<string>>
): DigitsAction<string, ErrorMessage<DigitsIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'digits',
    reference: digits,
    async: false,
    expects: null,
    requirement: DIGITS_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'digits', dataset, config);
      }
      return dataset;
    },
  };
}
