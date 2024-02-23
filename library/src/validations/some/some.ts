import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Some validation type.
 */
export interface SomeValidation<TInput extends any[]>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'some';
  /**
   * The validation function.
   */
  requirement: (
    element: TInput[number],
    index: number,
    array: TInput[number][]
  ) => boolean;
}

/**
 * Creates a pipeline validation action that validates the items of an array.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function some<TInput extends any[]>(
  requirement: (
    element: TInput[number],
    index: number,
    array: TInput[number][]
  ) => boolean,
  message?: ErrorMessage
): SomeValidation<TInput> {
  return {
    type: 'some',
    expects: null,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.some(this.requirement)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, some, input, 'input');
    },
  };
}
