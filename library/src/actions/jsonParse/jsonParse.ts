import type {
  BaseIssue,
  BaseTransformation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

export type JsonReviver = NonNullable<Parameters<typeof JSON.parse>[1]>;

/**
 * JSON parse issue interface.
 */
export interface JsonParseIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The issue type.
   */
  readonly type: 'json_parse';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
}

/**
 * JSON parse action interface.
 */
export interface JsonParseAction<
  TInput extends string,
  TReviver extends JsonReviver | undefined,
  TMessage extends ErrorMessage<JsonParseIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, unknown, JsonParseIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'json_parse';
  /**
   * The action reference.
   */
  readonly reference: typeof jsonParse;

  /**
   * The reviver function.
   */
  readonly reviver: TReviver;

  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a JSON parse action.
 *
 * @param reviver The reviver function.
 * @param message The error message.
 *
 * @returns A JSON parse action.
 */
export function jsonParse<
  TInput extends string,
  TReviver extends JsonReviver | undefined,
  const TMessage extends ErrorMessage<JsonParseIssue<TInput>> | undefined,
>(
  reviver: TReviver,
  message: TMessage
): JsonParseAction<TInput, TReviver, TMessage>;

/**
 * Creates a JSON parse action.
 *
 * @param reviver The reviver function.
 *
 * @returns A JSON parse action.
 */
export function jsonParse<TInput extends string, TReviver extends JsonReviver>(
  reviver: TReviver
): JsonParseAction<TInput, TReviver, undefined>;

/**
 * Creates a JSON parse action.
 *
 * @returns A JSON parse action.
 */
export function jsonParse<TInput extends string>(): JsonParseAction<
  TInput,
  undefined,
  undefined
>;

// @__NO_SIDE_EFFECTS__
export function jsonParse(
  reviver?: JsonReviver,
  message?: ErrorMessage<JsonParseIssue<string>>
): JsonParseAction<
  string,
  JsonReviver | undefined,
  ErrorMessage<JsonParseIssue<string>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'json_parse',
    reference: jsonParse,
    reviver,
    message,
    async: false,
    '~run'(dataset, config) {
      try {
        dataset.value = JSON.parse(dataset.value, reviver);
      } catch (error) {
        const parseError =
          error instanceof Error ? error.message : String(error);
        _addIssue(this, 'JSON', dataset, config, {
          received: `"${parseError}"`,
        });
        // @ts-expect-error
        dataset.typed = false;
      }
      return dataset;
    },
  };
}
