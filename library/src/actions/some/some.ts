import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Requirement type.
 */
type Requirement<TInput extends unknown[]> = (
  element: TInput[number],
  index: number,
  array: TInput
) => boolean;

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
   * The expected property.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: Requirement<TInput>;
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
  readonly requirement: Requirement<TInput>;
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
  requirement: Requirement<TInput>
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
  requirement: Requirement<TInput>,
  message: TMessage
): SomeAction<TInput, TMessage>;

export function some(
  requirement: Requirement<unknown[]>,
  message?: ErrorMessage<SomeIssue<unknown[]>>
): SomeAction<unknown[], ErrorMessage<SomeIssue<unknown[]>> | undefined> {
  return {
    kind: 'validation',
    type: 'some',
    reference: some,
    async: false,
    expects: null,
    requirement,
    message,
    _run(dataset, config) {
      if (dataset.typed && !dataset.value.some(this.requirement)) {
        _addIssue(this, 'content', dataset, config);
      }
      return dataset;
    },
  };
}
