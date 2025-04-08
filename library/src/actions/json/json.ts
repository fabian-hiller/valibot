import type {
  BaseIssue,
  BaseTransformation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

export type JsonReviver = NonNullable<Parameters<typeof JSON.parse>[1]>;

/**
 * JSON issue interface.
 */
export interface JsonIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
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
}

/**
 * JSON action interface.
 */
export interface JSONAction<
  TInput extends string,
  TReviver extends JsonReviver | undefined,
  TMessage extends ErrorMessage<JsonIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, unknown, JsonIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'json';
  /**
   * The action reference.
   */
  readonly reference: typeof json;

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
 * Creates a JSON transformation action.
 *
 * @param reviver The reviver function.
 * @param message The error message.
 *
 * @returns A JSON action.
 */
export function json<
  TInput extends string,
  TReviver extends JsonReviver | undefined,
  const TMessage extends ErrorMessage<JsonIssue<TInput>> | undefined,
>(reviver: TReviver, message: TMessage): JSONAction<TInput, TReviver, TMessage>;

/**
 * Creates a JSON transformation action.
 *
 * @param reviver The reviver function.
 *
 * @returns A JSON action.
 */
export function json<TInput extends string, TReviver extends JsonReviver>(
  reviver: TReviver
): JSONAction<TInput, TReviver, undefined>;

/**
 * Creates a JSON transformation action.
 *
 * @returns A JSON action.
 */
export function json<TInput extends string>(): JSONAction<
  TInput,
  undefined,
  undefined
>;

// @__NO_SIDE_EFFECTS__
export function json(
  reviver?: JsonReviver,
  message?: ErrorMessage<JsonIssue<string>>
): JSONAction<
  string,
  JsonReviver | undefined,
  ErrorMessage<JsonIssue<string>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'json',
    reference: json,
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
