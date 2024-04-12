import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * Finite issue type.
 */
export interface FiniteIssue<TInput extends number> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'finite';
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
 * Finite validation type.
 */
export interface FiniteAction<
  TInput extends number,
  TMessage extends ErrorMessage<FiniteIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, FiniteIssue<TInput>> {
  /**
   * The validation type.
   */
  readonly type: 'finite';
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
 * Creates a pipeline validation action that validates whether a number is finite.
 *
 * @returns A validation action.
 */
export function finite<TInput extends number>(): FiniteAction<
  TInput,
  undefined
>;

/**
 * Creates a pipeline validation action that validates whether a number is finite.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function finite<
  TInput extends number,
  const TMessage extends ErrorMessage<FiniteIssue<TInput>> | undefined,
>(message: TMessage): FiniteAction<TInput, TMessage>;

export function finite(
  message?: ErrorMessage<FiniteIssue<number>>
): FiniteAction<number, ErrorMessage<FiniteIssue<number>> | undefined> {
  return {
    kind: 'validation',
    type: 'finite',
    expects: null,
    async: false,
    message,
    requirement: Number.isFinite,
    _run(dataset, config) {
      return _validationDataset(
        this,
        finite,
        'finite',
        dataset.typed && !this.requirement(dataset.value),
        dataset,
        config
      );
    },
  };
}
