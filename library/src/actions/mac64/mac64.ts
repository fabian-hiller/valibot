import { MAC64_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * 64-bit MAC issue type.
 */
export interface Mac64Issue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'mac64';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
    /**
     * The 64-bit MAC regex.
     */
  readonly requirement: RegExp;
}

/**
 * 64-bit MAC action type.
 */
export interface Mac64Action<
  TInput extends string,
  TMessage extends ErrorMessage<Mac64Issue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, Mac64Issue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'mac64';
  /**
   * The expected property.
   */
  readonly expects: null;
   /**
    * The 64-bit MAC regex.
    */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a 64-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @returns A MAC action.
 */
export function mac64<TInput extends string>(): Mac64Action<TInput, undefined>;

/**
 * Creates a 64-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address) validation action.
 *
 * @param message The error message.
 *
 * @returns A MAC action.
 */
export function mac64<
  TInput extends string,
  const TMessage extends ErrorMessage<Mac64Issue<TInput>> | undefined,
>(message: TMessage): Mac64Action<TInput, TMessage>;

export function mac64(
  message?: ErrorMessage<Mac64Issue<string>>
): Mac64Action<string, ErrorMessage<Mac64Issue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'mac64',
    async: false,
    expects: null,
    requirement: MAC64_REGEX,
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        mac64,
        'mac64',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}
