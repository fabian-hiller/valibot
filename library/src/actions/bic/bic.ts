import { BIC_REGEX } from '../../regex.ts';
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
   * The BIC regex.
   */
  readonly requirement: RegExp;
}

/**
 * BIC action type.
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
   * The BIC regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [BIC](https://en.wikipedia.org/wiki/ISO_9362) validation action.
 *
 * @returns A BIC action.
 */
export function bic<TInput extends string>(): BicAction<TInput, undefined>;

/**
 * Creates a [BIC](https://en.wikipedia.org/wiki/ISO_9362) validation action.
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
    async: false,
    expects: null,
    requirement: BIC_REGEX,
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        bic,
        'BIC',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}
