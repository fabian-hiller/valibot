import { RFC_EMAIL_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Email issue type.
 */
export interface RfcEmailIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'rfc_email';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The rfc email regex.
   */
  readonly requirement: RegExp;
}

/**
 * RFC email action type.
 */
export interface RfcEmailAction<
  TInput extends string,
  TMessage extends ErrorMessage<RfcEmailIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, RfcEmailIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'rfc_email';
  /**
   * The action reference.
   */
  readonly reference: typeof rfcEmail;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The email regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [email](https://en.wikipedia.org/wiki/Email_address) validation
 * action.
 *
 * @returns An email action.
 */
export function rfcEmail<TInput extends string>(): RfcEmailAction<TInput, undefined>;

/**
 * Creates an [email](https://en.wikipedia.org/wiki/Email_address) validation
 * action.
 *
 * @param message The error message.
 *
 * @returns An rfc email action.
 */
export function rfcEmail<
  TInput extends string,
  const TMessage extends ErrorMessage<RfcEmailIssue<TInput>> | undefined,
>(message: TMessage): RfcEmailAction<TInput, TMessage>;

export function rfcEmail(
  message?: ErrorMessage<RfcEmailIssue<string>>
): RfcEmailAction<string, ErrorMessage<RfcEmailIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'rfc_email',
    reference: rfcEmail,
    expects: null,
    async: false,
    requirement: RFC_EMAIL_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'rfc_email', dataset, config);
      }
      return dataset;
    },
  };
}
