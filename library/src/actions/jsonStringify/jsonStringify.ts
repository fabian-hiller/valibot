import type {
  BaseIssue,
  BaseTransformation,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

export type JSONReplacer =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((this: any, key: string, value: any) => any) | (number | string)[];

/**
 * JSON stringify issue interface.
 */
export interface JsonStringifyIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The issue type.
   */
  readonly type: 'json_stringify';
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
 * JSON stringify action interface.
 */
export interface JsonStringifyAction<
  TInput,
  TReplacer extends JSONReplacer | undefined,
  TMessage extends ErrorMessage<JsonStringifyIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, string, JsonStringifyIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'json_stringify';
  /**
   * The action reference.
   */
  readonly reference: typeof jsonStringify;

  /**
   * The replacer function.
   */
  readonly replacer: TReplacer;

  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a JSON stringify transformation action.
 *
 * @returns A JSON stringify action.
 */
export function jsonStringify<TInput>(): JsonStringifyAction<
  TInput,
  undefined,
  undefined
>;

/**
 * Creates a JSON stringify transformation action.
 *
 * @param replacer The replacer function.
 *
 * @returns A JSON stringify action.
 */
export function jsonStringify<TInput, TReplacer extends JSONReplacer>(
  replacer: TReplacer
): JsonStringifyAction<TInput, TReplacer, undefined>;

/**
 * Creates a JSON stringify transformation action.
 *
 * @param replacer The replacer function.
 * @param message The error message.
 *
 * @returns A JSON stringify action.
 */
export function jsonStringify<
  TInput,
  const TReplacer extends JSONReplacer | undefined,
  const TMessage extends ErrorMessage<JsonStringifyIssue<TInput>>,
>(
  replacer: TReplacer,
  message: TMessage
): JsonStringifyAction<TInput, TReplacer, TMessage>;

// @__NO_SIDE_EFFECTS__
export function jsonStringify(
  replacer?: JSONReplacer,
  message?: ErrorMessage<JsonStringifyIssue<unknown>>
): JsonStringifyAction<
  unknown,
  JSONReplacer | undefined,
  ErrorMessage<JsonStringifyIssue<unknown>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'json_stringify',
    reference: jsonStringify,
    message,
    replacer,
    async: false,
    '~run'(dataset, config) {
      try {
        // @ts-expect-error different overloads
        const stringified = JSON.stringify(dataset.value, replacer);
        if (typeof stringified === 'undefined')
          throw new Error(typeof dataset.value);
        dataset.value = stringified;
      } catch (error) {
        const stringifyError =
          error instanceof Error ? error.message : String(error);
        _addIssue(this, 'JSON', dataset, config, {
          received: `"${stringifyError}"`,
        });
        // @ts-expect-error
        dataset.typed = false;
      }
      return dataset as OutputDataset<string, JsonStringifyIssue<unknown>>;
    },
  };
}
