import { MAC48_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * 48-bit MAC issue type.
 */
export interface Mac48Issue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'mac48';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The 48-bit MAC regex.
   */
  readonly requirement: RegExp;
}

/**
 * 48-bit MAC action type.
 */
export interface Mac48Action<
  TInput extends string,
  TMessage extends ErrorMessage<Mac48Issue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, Mac48Issue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'mac48';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The 48-bit MAC regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a 48-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @returns A MAC action.
 */
export function mac48<TInput extends string>(): Mac48Action<TInput, undefined>;

/**
 * Creates a 48-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @param message The error message.
 *
 * @returns A MAC action.
 */
export function mac48<
  TInput extends string,
  const TMessage extends ErrorMessage<Mac48Issue<TInput>> | undefined,
>(message: TMessage): Mac48Action<TInput, TMessage>;

export function mac48(
  message?: ErrorMessage<Mac48Issue<string>>
): Mac48Action<string, ErrorMessage<Mac48Issue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'mac48',
    async: false,
    expects: null,
    requirement: MAC48_REGEX,
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        mac48,
        'mac48',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}
