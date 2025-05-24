import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

export type Guard<TInput> = (input: TInput) => input is TInput;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferGuarded<TGuard extends Guard<any>> = TGuard extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any
) => input is infer TGuarded
  ? TGuarded
  : never;

/**
 * Guard action interface.
 */
export interface GuardAction<
  TInput,
  TGuard extends Guard<TInput>,
  TMessage extends ErrorMessage<GuardIssue<TInput, TGuard>> | undefined,
> extends BaseValidation<
    TInput,
    InferGuarded<TGuard>,
    GuardIssue<TInput, TGuard>
  > {
  /**
   * The action type.
   */
  readonly type: 'guard';
  /**
   * The action reference.
   */
  readonly reference: typeof guard;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The guard function.
   */
  readonly requirement: TGuard;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Guard issue interface.
 */
export interface GuardIssue<TInput, TGuard extends Guard<TInput>>
  extends BaseIssue<TInput> {
  /**
   * The validation type.
   */
  type: 'guard';
  /**
   * The validation requirement.
   */
  requirement: TGuard;
}

/**
 * Creates a guard validation action.
 *
 * @param requirement The guard function.
 *
 * @returns A guard action.
 */
// overload for a known input, i.e. within a pipe
export function guard<TInput, const TGuard extends Guard<TInput>>(
  requirement: TGuard
): GuardAction<TInput, TGuard, undefined>;

/**
 * Creates a guard validation action.
 *
 * @param requirement The guard function.
 * @param message The error message.
 *
 * @returns A guard action.
 */
// overload for a known input, i.e. within a pipe
export function guard<
  TInput,
  const TGuard extends Guard<TInput>,
  const TMessage extends ErrorMessage<GuardIssue<TInput, TGuard>> | undefined,
>(
  requirement: TGuard,
  message: TMessage
): GuardAction<TInput, TGuard, TMessage>;

/**
 * Creates a guard validation action.
 *
 * @param requirement The guard function.
 *
 * @returns A guard action.
 */
// overload for an unknown input, i.e. standalone
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function guard<const TGuard extends Guard<any>>(
  requirement: TGuard
): GuardAction<Parameters<TGuard>[0], TGuard, undefined>;

/**
 * Creates a guard validation action.
 *
 * @param requirement The guard function.
 * @param message The error message.
 *
 * @returns A guard action.
 */
// overload for an unknown input, i.e. standalone
export function guard<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TGuard extends Guard<any>,
  const TMessage extends
    | ErrorMessage<GuardIssue<Parameters<TGuard>[0], TGuard>>
    | undefined,
>(
  requirement: TGuard,
  message: TMessage
): GuardAction<Parameters<TGuard>[0], TGuard, TMessage>;

// @__NO_SIDE_EFFECTS__
export function guard(
  requirement: Guard<unknown>,
  message?: ErrorMessage<GuardIssue<unknown, Guard<unknown>>>
): GuardAction<
  unknown,
  Guard<unknown>,
  ErrorMessage<GuardIssue<unknown, Guard<unknown>>> | undefined
> {
  return {
    kind: 'validation',
    type: 'guard',
    reference: guard,
    async: false,
    expects: null,
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
