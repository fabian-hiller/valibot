import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * Url issue type.
 */
export interface UrlIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'url';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * URL validation type.
 */
export interface UrlAction<
  TInput extends string,
  TMessage extends ErrorMessage<UrlIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, UrlIssue<TInput>> {
  /**
   * The validation type.
   */
  readonly type: 'url';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [URL](https://en.wikipedia.org/wiki/URL) validation action.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @returns A URL action.
 */
export function url<TInput extends string>(): UrlAction<TInput, undefined>;

/**
 * Creates a [URL](https://en.wikipedia.org/wiki/URL) validation action.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param message The error message.
 *
 * @returns A URL action.
 */
export function url<
  TInput extends string,
  const TMessage extends ErrorMessage<UrlIssue<TInput>> | undefined,
>(message: TMessage): UrlAction<TInput, TMessage>;

export function url(
  message?: ErrorMessage<UrlIssue<string>> | undefined
): UrlAction<string, ErrorMessage<UrlIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'url',
    async: false,
    expects: null,
    requirement(input) {
      try {
        new URL(input);
        return true;
      } catch {
        return false;
      }
    },
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        url,
        'URL',
        dataset.typed && !this.requirement(dataset.value),
        dataset,
        config
      );
    },
  };
}
