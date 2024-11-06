import { RFC_EMAIL_REGEX } from '../../regex.ts';
import type {
  ErrorMessage,
} from '../../types/index.ts';
import { email, type EmailAction, type EmailIssue } from '../email/email.ts';

/**
 * Creates an [email](https://en.wikipedia.org/wiki/Email_address) validation
 * action.
 *
 * @returns An email action.
 */
export function rfcEmail<TInput extends string>(): EmailAction<TInput, undefined>;

/**
 * Creates an [email](https://en.wikipedia.org/wiki/Email_address) validation
 * action.
 *
 * @param message The error message.
 *
 * @returns An email action.
 */
export function rfcEmail<
  TInput extends string,
  const TMessage extends ErrorMessage<EmailIssue<TInput>> | undefined,
>(message: TMessage): EmailAction<TInput, TMessage>;

export function rfcEmail(
  message?: ErrorMessage<EmailIssue<string>>
): EmailAction<string, ErrorMessage<EmailIssue<string>> | undefined> {
  return {
    ...email(message),
    requirement: RFC_EMAIL_REGEX,
  };
}
