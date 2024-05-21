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
   * The expected property.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: Requirement<TInput>;
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
  readonly requirement: Requirement<TInput>;
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
  requirement: Requirement<TInput>
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
  requirement: Requirement<TInput>,
  message: TMessage
): EveryAction<TInput, TMessage>;

export function every(
  requirement: Requirement<unknown[]>,
  message?: ErrorMessage<EveryIssue<unknown[]>>
): EveryAction<unknown[], ErrorMessage<EveryIssue<unknown[]>> | undefined> {
  return {
    kind: 'validation',
    type: 'every',
    reference: every,
    async: false,
    expects: null,
    requirement,
    message,
    _run(dataset, config) {
      if (dataset.typed && !dataset.value.every(this.requirement)) {
        _addIssue(this, 'content', dataset, config);
      }
      return dataset;
    },
  };
}
