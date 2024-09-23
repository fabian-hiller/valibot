import { CUID2_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Cuid2 issue type.
 */
export interface Cuid2Issue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'cuid2';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The Cuid2 regex.
   */
  readonly requirement: RegExp;
}

/**
 * Cuid2 action type.
 */
export interface Cuid2Action<
  TInput extends string,
  TMessage extends ErrorMessage<Cuid2Issue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, Cuid2Issue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'cuid2';
  /**
   * The action reference.
   */
  readonly reference: typeof cuid2;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The Cuid2 regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [Cuid2](https://github.com/paralleldrive/cuid2) validation action.
 *
 * @returns A Cuid2 action.
 */
export function cuid2<TInput extends string>(): Cuid2Action<TInput, undefined>;

/**
 * Creates a [Cuid2](https://github.com/paralleldrive/cuid2) validation action.
 *
 * @param message The error message.
 *
 * @returns A Cuid2 action.
 */
export function cuid2<
  TInput extends string,
  const TMessage extends ErrorMessage<Cuid2Issue<TInput>> | undefined,
>(message: TMessage): Cuid2Action<TInput, TMessage>;

export function cuid2(
  message?: ErrorMessage<Cuid2Issue<string>>
): Cuid2Action<string, ErrorMessage<Cuid2Issue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'cuid2',
    reference: cuid2,
    async: false,
    expects: null,
    requirement: CUID2_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'Cuid2', dataset, config);
      }
      return dataset as OutputDataset<string, Cuid2Issue<string>>;
    },
  };
}
