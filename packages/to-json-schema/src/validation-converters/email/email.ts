import type { EmailAction, EmailIssue, ErrorMessage } from 'valibot';
import type { ValidationConverter } from '../types.ts';

export type SupportedEmailValidation = EmailAction<
  string,
  ErrorMessage<EmailIssue<string>> | undefined
>;

/**
 * Convert `email` validation action.
 *
 * @returns the converted validation
 */
export const email: ValidationConverter<SupportedEmailValidation> = () => ({
  type: 'string',
  format: 'email',
});
