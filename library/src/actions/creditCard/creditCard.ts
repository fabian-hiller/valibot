import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _isLuhnAlgo, _validationDataset } from '../../utils/index.ts';

/**
 * Credit card issue type.
 */
export interface CreditCardIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'credit_card';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `${number}`;
  /**
   * The minimum bytes.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * Credit card action type.
 */
export interface CreditCardAction<
  TInput extends string,
  TMessage extends ErrorMessage<CreditCardIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, CreditCardIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'credit_card';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The minimum bytes.
   */
  readonly requirement: (input: string) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Sanitize regex.
 */
const SANITIZE_REGEX = /[- ]+/gu;

/**
 * Provider regex list.
 */
const PROVIDER_REGEX_LIST = [
  // American Express
  /^3[47]\d{13}$/u,
  // Diners Club
  /^3(?:0[0-5]|[68]\d)\d{11}$/u,
  // Discover
  /^6(?:011|5\d{2})\d{12,15}$/u,
  // JCB
  /^(?:2131|1800|35\d{3})\d{11}$/u,
  // Mastercard
  /^5[1-5]\d{2}|(222\d|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/u,
  // UnionPay
  /^(6[27]\d{14}|81\d{14,17})$/u,
  // Visa
  /^4\d{12}(?:\d{3,6})?$/u,
];

/**
 * Creates a credit card validation action.
 *
 * @returns A Credit card action.
 */
export function creditCard<TInput extends string>(): CreditCardAction<
  TInput,
  undefined
>;

/**
 * Creates a credit card validation action.
 *
 * @param message The error message.
 *
 * @returns A credit card action.
 */
export function creditCard<
  TInput extends string,
  const TMessage extends ErrorMessage<CreditCardIssue<TInput>> | undefined,
>(message: TMessage): CreditCardAction<TInput, TMessage>;

export function creditCard(
  message?: ErrorMessage<CreditCardIssue<string>>
): CreditCardAction<string, ErrorMessage<CreditCardIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'credit_card',
    expects: null,
    async: false,
    message,
    requirement(input) {
      const sanitized = input.replace(SANITIZE_REGEX, '');
      const hasACreditCardFormat = PROVIDER_REGEX_LIST.some((regex) =>
        regex.test(sanitized)
      );
      const passLuhnAlgorithm = _isLuhnAlgo(sanitized);

      return hasACreditCardFormat && passLuhnAlgorithm;
    },
    _run(dataset, config) {
      return _validationDataset(
        this,
        creditCard,
        'credit_card',
        dataset.typed && !this.requirement(dataset.value),
        dataset,
        config
      );
    },
  };
}
