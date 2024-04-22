import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Every issue type.
 */
export interface EveryIssue<TInput extends unknown[]>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'every';
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
 * Every action type.
 */
export interface EveryAction<
  TInput extends unknown[],
  TMessage extends ErrorMessage<EveryIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, EveryIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'every';
  /**
   * The action reference.
   */
  readonly reference: typeof every;
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
 * Creates an every validation action.
 *
 * @param requirement The validation function.
 *
 * @returns An every action.
 */
export function every<TInput extends unknown[]>(
  requirement: (
    element: TInput[number],
    index: number,
    array: TInput
  ) => boolean
): EveryAction<TInput, undefined>;

/**
 * Creates an every validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns An every action.
 */
export function every<
  TInput extends unknown[],
  const TMessage extends ErrorMessage<EveryIssue<TInput>> | undefined,
>(
  requirement: (
    element: TInput[number],
    index: number,
    array: TInput
  ) => boolean,
  message: TMessage
): EveryAction<TInput, TMessage>;

export function every(
  requirement: (element: unknown, index: number, array: unknown[]) => boolean,
  message?: ErrorMessage<EveryIssue<unknown[]>>
): EveryAction<unknown[], ErrorMessage<EveryIssue<unknown[]>> | undefined> {
  return {
    kind: 'validation',
    type: 'every',
    async: false,
    reference: every,
    expects: null,
    message,
    requirement,
    _run(dataset, config) {
      if (dataset.typed && !dataset.value.every(this.requirement)) {
        _addIssue(this, 'input', dataset, config);
      }
      return dataset;
    },
  };
}
