import { CUID2_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

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
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `${number}`;
  /**
   * The minimum bytes.
   */
  readonly requirement: (input: string) => boolean;
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
   * The expected property.
   */
  readonly expects: null;
  /**
   * The minimum bytes.
   */
  readonly requirement: (input: string) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a Cuid2 validation action.
 *
 * @returns A Cuid2 action.
 */
export function cuid2<TInput extends string>(): Cuid2Action<TInput, undefined>;

/**
 * Creates a Cuid2 validation action.
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
    expects: null,
    async: false,
    message,
    requirement(input) {
      return CUID2_REGEX.test(input);
    },
    _run(dataset, config) {
      return _validationDataset(
        this,
        cuid2,
        'cuid2',
        dataset.typed && !this.requirement(dataset.value),
        dataset,
        config
      );
    },
  };
}
