import { EMAIL_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Email issue type.
 */
export interface EmailIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'email';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The email regex.
   */
  readonly requirement: RegExp;
}

/**
 * Email action type.
 */
export interface EmailAction<
  TInput extends string,
  TMessage extends ErrorMessage<EmailIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, EmailIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'email';
  /**
   * The action reference.
   */
  readonly reference: typeof email;
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
 * Hint: This validation action intentionally only validates common email
 * addresses. If you are interested in an action that covers the entire
 * specification, please see issue [#204](https://github.com/fabian-hiller/valibot/issues/204).
 *
 * @returns An email action.
 */
export function email<TInput extends string>(): EmailAction<TInput, undefined>;

/**
 * Creates an [email](https://en.wikipedia.org/wiki/Email_address) validation
 * action.
 *
 * Hint: This validation action intentionally only validates common email
 * addresses. If you are interested in an action that covers the entire
 * specification, please see issue [#204](https://github.com/fabian-hiller/valibot/issues/204).
 *
 * @param message The error message.
 *
 * @returns An email action.
 */
export function email<
  TInput extends string,
  const TMessage extends ErrorMessage<EmailIssue<TInput>> | undefined,
>(message: TMessage): EmailAction<TInput, TMessage>;

export function email(
  message?: ErrorMessage<EmailIssue<string>>
): EmailAction<string, ErrorMessage<EmailIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'email',
    reference: email,
    expects: null,
    async: false,
    requirement: EMAIL_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'email', dataset, config);
      }
      return dataset as OutputDataset<string, EmailIssue<string>>;
    },
  };
}
