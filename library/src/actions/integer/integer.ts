import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * Integer issue type.
 */
export interface IntegerIssue<TInput extends number> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'integer';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: number) => boolean;
}

/**
 * Integer validation type.
 */
export interface IntegerAction<
  TInput extends number,
  TMessage extends ErrorMessage<IntegerIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IntegerIssue<TInput>> {
  /**
   * The validation type.
   */
  readonly type: 'integer';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: number) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a integer validation action.
 *
 * @returns A integer action.
 */
export function integer<TInput extends number>(): IntegerAction<
  TInput,
  undefined
>;

/**
 * Creates a integer validation action.
 *
 * @param message The error message.
 *
 * @returns A integer action.
 */
export function integer<
  TInput extends number,
  const TMessage extends ErrorMessage<IntegerIssue<TInput>> | undefined,
>(message: TMessage): IntegerAction<TInput, TMessage>;

export function integer(
  message?: ErrorMessage<IntegerIssue<number>>
): IntegerAction<number, ErrorMessage<IntegerIssue<number>> | undefined> {
  return {
    kind: 'validation',
    type: 'integer',
    expects: null,
    async: false,
    message,
    requirement: Number.isInteger,
    _run(dataset, config) {
      return _validationDataset(
        this,
        integer,
        'integer',
        dataset.typed && !this.requirement(dataset.value),
        dataset,
        config
      );
    },
  };
}
