import { NANO_ID_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Nano ID issue interface.
 */
export interface NanoIDIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'nanoid';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: string;
  /**
   * The Nano ID regex.
   */
  readonly requirement: RegExp;
}

/**
 * Nano ID action interface.
 */
export interface NanoIDAction<
  TInput extends string,
  TMessage extends ErrorMessage<NanoIDIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, NanoIDIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'nanoid';
  /**
   * The action reference.
   */
  readonly reference: typeof nanoid;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The Nano ID regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [Nano ID](https://github.com/ai/nanoid) validation action.
 *
 * @returns A Nano ID action.
 */
export function nanoid<TInput extends string>(): NanoIDAction<
  TInput,
  undefined
>;

/**
 * Creates a [Nano ID](https://github.com/ai/nanoid) validation action.
 *
 * @param message The error message.
 *
 * @returns A Nano ID action.
 */
export function nanoid<
  TInput extends string,
  const TMessage extends ErrorMessage<NanoIDIssue<TInput>> | undefined,
>(message: TMessage): NanoIDAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function nanoid(
  message?: ErrorMessage<NanoIDIssue<string>>
): NanoIDAction<string, ErrorMessage<NanoIDIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'nanoid',
    reference: nanoid,
    async: false,
    expects: null,
    requirement: NANO_ID_REGEX,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'Nano ID', dataset, config);
      }
      return dataset;
    },
  };
}
