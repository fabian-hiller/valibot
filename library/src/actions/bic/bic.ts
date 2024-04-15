import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * BIC issue type.
 */
export interface BicIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'bic';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * Credit card action type.
 */
export interface BicAction<
  TInput extends string,
  TMessage extends ErrorMessage<BicIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, BicIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'bic';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * [BIC] (https://en.wikipedia.org/wiki/ISO_9362) regex.
 */
export const BIC_REGEX = /^[A-Z]{6}(?!00)[A-Z\d]{2}(?:[A-Z\d]{3})?$/u;

/**
 * Creates an ISO 9362 BIC validation action.
 *
 * @returns A BIC action.
 */
export function bic<TInput extends string>(): BicAction<TInput, undefined>;

/**
 * Creates an ISO 9362 BIC validation action.
 *
 * @param message The error message.
 *
 * @returns A BIC action.
 */
export function bic<
  TInput extends string,
  const TMessage extends ErrorMessage<BicIssue<TInput>> | undefined,
>(message: TMessage): BicAction<TInput, TMessage>;

export function bic(
  message?: ErrorMessage<BicIssue<string>>
): BicAction<string, ErrorMessage<BicIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'bic',
    expects: null,
    async: false,
    message,
    requirement(input) {
      return BIC_REGEX.test(input);
    },
    _run(dataset, config) {
      return _validationDataset(
        this,
        bic,
        'BIC',
        dataset.typed && !this.requirement(dataset.value),
        dataset,
        config
      );
    },
  };
}
