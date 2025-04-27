import type {
  BaseIssue,
  BaseTransformation,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * JSON replacer type.
 */
export type JsonReplacer =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((this: any, key: string, value: any) => any) | (number | string)[] | null;

/**
 * Stringify JSON issue interface.
 *
 * @beta
 */
export interface StringifyJsonIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The issue type.
   */
  readonly type: 'stringify_json';
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
 * Stringify JSON action interface.
 *
 * @beta
 */
export interface StringifyJsonAction<
  TInput,
  TReplacer extends JsonReplacer | undefined,
  TMessage extends ErrorMessage<StringifyJsonIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, string, StringifyJsonIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'stringify_json';
  /**
   * The action reference.
   */
  readonly reference: typeof stringifyJson;
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
 * Creates a stringify JSON transformation action.
 *
 * @returns A stringify JSON action.
 *
 * @beta
 */
export function stringifyJson<TInput>(): StringifyJsonAction<
  TInput,
  undefined,
  undefined
>;

/**
 * Creates a stringify JSON transformation action.
 *
 * @param replacer The replacer function.
 *
 * @returns A stringify JSON action.
 *
 * @beta
 */
export function stringifyJson<
  TInput,
  const TReplacer extends JsonReplacer | undefined,
>(replacer: TReplacer): StringifyJsonAction<TInput, TReplacer, undefined>;

/**
 * Creates a stringify JSON transformation action.
 *
 * @param replacer The replacer function.
 * @param message The error message.
 *
 * @returns A stringify JSON action.
 *
 * @beta
 */
export function stringifyJson<
  TInput,
  const TReplacer extends JsonReplacer | undefined,
  const TMessage extends ErrorMessage<StringifyJsonIssue<TInput>> | undefined,
>(
  replacer: TReplacer,
  message: TMessage
): StringifyJsonAction<TInput, TReplacer, TMessage>;

// @__NO_SIDE_EFFECTS__
export function stringifyJson(
  replacer?: JsonReplacer,
  message?: ErrorMessage<StringifyJsonIssue<unknown>>
): StringifyJsonAction<
  unknown,
  JsonReplacer | undefined,
  ErrorMessage<StringifyJsonIssue<unknown>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'stringify_json',
    reference: stringifyJson,
    message,
    replacer,
    async: false,
    '~run'(dataset, config) {
      try {
        // @ts-expect-error
        const output = JSON.stringify(dataset.value, this.replacer);
        if (output === undefined) {
          _addIssue(this, 'JSON', dataset, config);
          // @ts-expect-error
          dataset.typed = false;
        }
        dataset.value = output;
      } catch (error) {
        if (error instanceof Error) {
          _addIssue(this, 'JSON', dataset, config, {
            received: `"${error.message}"`,
          });
          // @ts-expect-error
          dataset.typed = false;
        } else {
          throw error;
        }
      }
      return dataset as OutputDataset<string, StringifyJsonIssue<unknown>>;
    },
  };
}
