import { EMOJI_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Emoji issue type.
 */
export interface EmojiIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'emoji';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The emoji regex.
   */
  readonly requirement: RegExp;
}

/**
 * Emoji action type.
 */
export interface EmojiAction<
  TInput extends string,
  TMessage extends ErrorMessage<EmojiIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, EmojiIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'emoji';
  /**
   * The action reference.
   */
  readonly reference: typeof emoji;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The emoji regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an emoji validation action.
 *
 * @returns An emoji action.
 */
export function emoji<TInput extends string>(): EmojiAction<TInput, undefined>;

/**
 * Creates an emoji validation action.
 *
 * @param message The error message.
 *
 * @returns An emoji action.
 */
export function emoji<
  TInput extends string,
  const TMessage extends ErrorMessage<EmojiIssue<TInput>> | undefined,
>(message: TMessage): EmojiAction<TInput, TMessage>;

export function emoji(
  message?: ErrorMessage<EmojiIssue<string>>
): EmojiAction<string, ErrorMessage<EmojiIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'emoji',
    reference: emoji,
    async: false,
    expects: null,
    requirement: EMOJI_REGEX,
    message,
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'emoji', dataset, config);
      }
      return dataset as Dataset<string, EmojiIssue<string>>;
    },
  };
}
