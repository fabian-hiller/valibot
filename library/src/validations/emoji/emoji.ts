import { EMOJI_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Emoji validation type.
 */
export interface EmojiValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'emoji';
  /**
   * The emoji regex.
   */
  requirement: RegExp;
}

/**
 * Creates a validation function that validates an emoji.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function emoji<TInput extends string>(
  message: ErrorMessage = 'Invalid emoji'
): EmojiValidation<TInput> {
  return {
    type: 'emoji',
    async: false,
    message,
    requirement: EMOJI_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
