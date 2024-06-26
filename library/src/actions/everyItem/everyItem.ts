import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { ArrayRequirement } from '../types.ts';

/**
 * Every item issue type.
 */
export interface EveryItemIssue<TInput extends readonly unknown[]>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'every_item';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: ArrayRequirement<TInput>;
}

/**
 * Every item action type.
 */
export interface EveryItemAction<
  TInput extends readonly unknown[],
  TMessage extends ErrorMessage<EveryItemIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, EveryItemIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'every_item';
  /**
   * The action reference.
   */
  readonly reference: typeof everyItem;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: ArrayRequirement<TInput>;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an every item validation action.
 *
 * @param requirement The validation function.
 *
 * @returns An every item action.
 */
export function everyItem<TInput extends readonly unknown[]>(
  requirement: ArrayRequirement<TInput>
): EveryItemAction<TInput, undefined>;

/**
 * Creates an every item validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns An every item action.
 */
export function everyItem<
  TInput extends readonly unknown[],
  const TMessage extends ErrorMessage<EveryItemIssue<TInput>> | undefined,
>(
  requirement: ArrayRequirement<TInput>,
  message: TMessage
): EveryItemAction<TInput, TMessage>;

export function everyItem(
  requirement: ArrayRequirement<unknown[]>,
  message?: ErrorMessage<EveryItemIssue<unknown[]>>
): EveryItemAction<
  unknown[],
  ErrorMessage<EveryItemIssue<unknown[]>> | undefined
> {
  return {
    kind: 'validation',
    type: 'every_item',
    reference: everyItem,
    async: false,
    expects: null,
    requirement,
    message,
    _run(dataset, config) {
      if (dataset.typed && !dataset.value.every(this.requirement)) {
        _addIssue(this, 'item', dataset, config);
      }
      return dataset;
    },
  };
}
