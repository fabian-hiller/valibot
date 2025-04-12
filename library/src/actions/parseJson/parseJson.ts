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
export interface ParseJsonIssue<TInput extends string>
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
export interface ParseJsonAction<
  TInput extends string,
  TReviver extends JsonReviver | undefined,
  TMessage extends ErrorMessage<ParseJsonIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, unknown, ParseJsonIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'json_parse';
  /**
   * The action reference.
   */
  readonly reference: typeof parseJson;

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
 * @returns A JSON parse action.
 */
export function parseJson<TInput extends string>(): ParseJsonAction<
  TInput,
  undefined,
  undefined
>;

/**
 * Creates a JSON parse action.
 *
 * @param reviver The reviver function.
 *
 * @returns A JSON parse action.
 */
export function parseJson<TInput extends string, TReviver extends JsonReviver>(
  reviver: TReviver
): ParseJsonAction<TInput, TReviver, undefined>;

/**
 * Creates a JSON parse action.
 *
 * @param reviver The reviver function.
 * @param message The error message.
 *
 * @returns A JSON parse action.
 */
export function parseJson<
  TInput extends string,
  TReviver extends JsonReviver | undefined,
  const TMessage extends ErrorMessage<ParseJsonIssue<TInput>>,
>(
  reviver: TReviver,
  message: TMessage
): ParseJsonAction<TInput, TReviver, TMessage>;

// @__NO_SIDE_EFFECTS__
export function parseJson(
  reviver?: JsonReviver,
  message?: ErrorMessage<ParseJsonIssue<string>>
): ParseJsonAction<
  string,
  JsonReviver | undefined,
  ErrorMessage<ParseJsonIssue<string>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'json_parse',
    reference: parseJson,
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
