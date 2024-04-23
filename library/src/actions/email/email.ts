import { EMAIL_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
  ErrorMessage,
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
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
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
 * Creates an email validation action.
 *
 * @returns An email action.
 */
export function email<TInput extends string>(): EmailAction<TInput, undefined>;

/**
 * Creates an email validation action.
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
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'email', dataset, config);
      }
      return dataset as Dataset<string, EmailIssue<string>>;
    },
  };
}
