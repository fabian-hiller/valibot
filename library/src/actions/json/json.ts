import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * JSON issue type.
 */
export interface JsonIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'json';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The JSON validation requirement.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * JSON action type.
 */
export interface JsonAction<
  TInput extends string,
  TMessage extends ErrorMessage<JsonIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, JsonIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'json';
  /**
   * The action reference.
   */
  readonly reference: typeof json;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The JSON validation requirement.
   */
  readonly requirement: (input: string) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [JSON](https://en.wikipedia.org/wiki/JSON) validation action.
 *
 * @returns A JSON action.
 */
export function json<TInput extends string>(): JsonAction<TInput, undefined>;

/**
 * Creates a [JSON](https://en.wikipedia.org/wiki/JSON) validation action.
 *
 * @param message The error message.
 *
 * @returns A JSON action.
 */
export function json<
  TInput extends string,
  const TMessage extends ErrorMessage<JsonIssue<TInput>> | undefined,
>(message: TMessage): JsonAction<TInput, TMessage>;

export function json(
  message?: ErrorMessage<JsonIssue<string>>
): JsonAction<string, ErrorMessage<JsonIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'json',
    reference: json,
    async: false,
    expects: null,
    requirement(input) {
      try {
        JSON.parse(input);
        return true;
      } catch {
        return false;
      }
    },
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'JSON', dataset, config);
      }
      return dataset;
    },
  };
}
