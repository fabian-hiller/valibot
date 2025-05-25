import type {
  BaseIssue,
  BaseTransformation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

export type Guard<TInput, TOutput extends TInput> = (
  input: TInput
) => input is TOutput;

/**
 * Guard issue interface.
 */
export interface GuardIssue<TInput, TOutput extends TInput>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The validation type.
   */
  readonly type: 'guard';
  /**
   * The validation requirement.
   */
  readonly requirement: Guard<TInput, TOutput>;
}

/**
 * Guard action interface.
 */
export interface GuardAction<
  TInput,
  TOutput extends TInput,
  TMessage extends ErrorMessage<GuardIssue<TInput, TOutput>> | undefined,
> extends BaseTransformation<TInput, TOutput, GuardIssue<TInput, TOutput>> {
  /**
   * The action type.
   */
  readonly type: 'guard';
  /**
   * The action reference.
   */
  readonly reference: typeof guard;
  /**
   * The guard function.
   */
  readonly requirement: Guard<TInput, TOutput>;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
/**
 * Creates a guard validation action.
 *
 * @param requirement The guard function.
 *
 * @returns A guard action.
 */
export function guard<TInput, TOutput extends TInput>(
  requirement: Guard<TInput, TOutput>
): GuardAction<TInput, TOutput, undefined>;

/**
 * Creates a guard validation action.
 *
 * @param requirement The guard function.
 * @param message The error message.
 *
 * @returns A guard action.
 */
export function guard<
  TInput,
  TOutput extends TInput,
  const TMessage extends ErrorMessage<GuardIssue<TInput, TOutput>> | undefined,
>(
  requirement: Guard<TInput, TOutput>,
  message: TMessage
): GuardAction<TInput, TOutput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function guard(
  requirement: Guard<unknown, unknown>,
  message?: ErrorMessage<GuardIssue<unknown, unknown>>
): GuardAction<
  unknown,
  unknown,
  ErrorMessage<GuardIssue<unknown, unknown>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'guard',
    reference: guard,
    async: false,
    requirement,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'input', dataset, config);
        // @ts-expect-error
        dataset.typed = false;
      }
      return dataset;
    },
  };
}
