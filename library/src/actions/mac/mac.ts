import { MAC48_REGEX, MAC64_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * MAC issue type.
 */
export interface MacIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'mac';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The 48-bit and 64-bit MAC regex.
   */
  readonly requirement: [RegExp, RegExp];
}

/**
 * MAC action type.
 */
export interface MacAction<
  TInput extends string,
  TMessage extends ErrorMessage<MacIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, MacIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'mac';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The 48-bit and 64-bit MAC regex.
   */
  readonly requirement: [RegExp, RegExp];
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @returns A MAC action.
 */
export function mac<TInput extends string>(): MacAction<TInput, undefined>;

/**
 * Creates a [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @param message The error message.
 *
 * @returns A MAC action.
 */
export function mac<
  TInput extends string,
  const TMessage extends ErrorMessage<MacIssue<TInput>> | undefined,
>(message: TMessage): MacAction<TInput, TMessage>;

export function mac(
  message?: ErrorMessage<MacIssue<string>>
): MacAction<string, ErrorMessage<MacIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'mac',
    async: false,
    expects: null,
    requirement: [MAC48_REGEX, MAC64_REGEX],
    message,
    _run(dataset, config) {
      if (dataset.typed) {
        const isMac48 = this.requirement[0].test(dataset.value);

        const isMac64 = this.requirement[1].test(dataset.value);

        if (!isMac48 && !isMac64) {
          _addIssue(this, mac, 'mac', dataset, config);
        }
      }
      return dataset;
    },
  };
}
