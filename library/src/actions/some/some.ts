import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Some issue type.
 */
export interface SomeIssue<TInput extends unknown[]> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'some';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: (
    element: TInput[number],
    index: number,
    array: TInput
  ) => boolean;
}

/**
 * Some action type.
 */
export interface SomeAction<
  TInput extends unknown[],
  TMessage extends ErrorMessage<SomeIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, SomeIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'some';
  /**
   * The action reference.
   */
  readonly reference: typeof some;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (
    element: TInput[number],
    index: number,
    array: TInput
  ) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a some validation action.
 *
 * @param requirement The validation function.
 *
 * @returns A some action.
 */
export function some<TInput extends unknown[]>(
  requirement: (
    element: TInput[number],
    index: number,
    array: TInput
  ) => boolean
): SomeAction<TInput, undefined>;

/**
 * Creates a some validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A some action.
 */
export function some<
  TInput extends unknown[],
  const TMessage extends ErrorMessage<SomeIssue<TInput>> | undefined,
>(
  requirement: (
    element: TInput[number],
    index: number,
    array: TInput
  ) => boolean,
  message: TMessage
): SomeAction<TInput, TMessage>;

export function some(
  requirement: (element: unknown, index: number, array: unknown[]) => boolean,
  message?: ErrorMessage<SomeIssue<unknown[]>>
): SomeAction<unknown[], ErrorMessage<SomeIssue<unknown[]>> | undefined> {
  return {
    kind: 'validation',
    type: 'some',
    async: false,
    reference: some,
    expects: null,
    message,
    requirement,
    _run(dataset, config) {
      if (dataset.typed && !dataset.value.some(this.requirement)) {
        _addIssue(this, 'input', dataset, config);
      }
      return dataset;
    },
  };
}
