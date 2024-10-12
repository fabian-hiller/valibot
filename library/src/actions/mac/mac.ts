import { MAC_REGEX } from '../../regex.ts';
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
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The MAC regex.
   */
  readonly requirement: RegExp;
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
   * The action reference.
   */
  readonly reference: typeof mac;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The MAC regex.
   */
  readonly requirement: RegExp;
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
    reference: mac,
    async: false,
    expects: null,
    requirement: MAC_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'MAC', dataset, config);
      }
      return dataset;
    },
  };
}
