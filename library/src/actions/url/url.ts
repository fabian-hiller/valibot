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
export interface UrlValidation<
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
 * Creates a pipeline validation action that validates a URL.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @returns A validation action.
 */
export function url<TInput extends string>(): UrlValidation<TInput, undefined>;

/**
 * Creates a pipeline validation action that validates a URL.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function url<
  TInput extends string,
  const TMessage extends ErrorMessage<UrlIssue<TInput>> | undefined,
>(message: TMessage): UrlValidation<TInput, TMessage>;

export function url(
  message?: ErrorMessage<UrlIssue<string>> | undefined
): UrlValidation<string, ErrorMessage<UrlIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'url',
    expects: null,
    async: false,
    message,
    requirement(input) {
      try {
        new URL(input);
        return true;
      } catch {
        return false;
      }
    },
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
