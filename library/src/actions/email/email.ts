import { EMAIL_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

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
    type: 'email',
    kind: 'validation',
    async: false,
    message,
    expects: null,
    requirement: EMAIL_REGEX,
    _run(dataset, config) {
      return _validationDataset(
        this,
        email,
        'email',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}
