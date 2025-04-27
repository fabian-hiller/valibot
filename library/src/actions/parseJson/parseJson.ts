import type {
  BaseIssue,
  BaseTransformation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * JSON reviver function type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonReviver = (this: any, key: string, value: any) => any;

/**
 * Parse JSON issue interface.
 *
 * @beta
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
  readonly type: 'parse_json';
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
 * Parse JSON action interface.
 *
 * @beta
 */
export interface ParseJsonAction<
  TInput extends string,
  TReviver extends JsonReviver | undefined,
  TMessage extends ErrorMessage<ParseJsonIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, unknown, ParseJsonIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'parse_json';
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
 * Creates a parse JSON transformation action.
 *
 * @returns A parse JSON action.
 *
 * @beta
 */
export function parseJson<TInput extends string>(): ParseJsonAction<
  TInput,
  undefined,
  undefined
>;

/**
 * Creates a parse JSON transformation action.
 *
 * @param reviver The reviver function.
 *
 * @returns A parse JSON action.
 *
 * @beta
 */
export function parseJson<
  TInput extends string,
  const TReviver extends JsonReviver | undefined,
>(reviver: TReviver): ParseJsonAction<TInput, TReviver, undefined>;

/**
 * Creates a parse JSON transformation action.
 *
 * @param reviver The reviver function.
 * @param message The error message.
 *
 * @returns A parse JSON action.
 *
 * @beta
 */
export function parseJson<
  TInput extends string,
  const TReviver extends JsonReviver | undefined,
  const TMessage extends ErrorMessage<ParseJsonIssue<TInput>> | undefined,
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
    type: 'parse_json',
    reference: parseJson,
    reviver,
    message,
    async: false,
    '~run'(dataset, config) {
      try {
        dataset.value = JSON.parse(dataset.value, reviver);
      } catch (error) {
        _addIssue(this, 'JSON', dataset, config, {
          // @ts-expect-error
          received: `"${error.message}"`,
        });
        // @ts-expect-error
        dataset.typed = false;
      }
      return dataset;
    },
  };
}
