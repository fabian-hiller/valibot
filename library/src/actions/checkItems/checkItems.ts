import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { ArrayRequirement } from '../types.ts';

// TODO: Also add `checkItemsAsync` action

/**
 * Check items issue type.
 */
export interface CheckItemsIssue<TInput extends readonly unknown[]>
  extends BaseIssue<TInput[number]> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'check_items';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: ArrayRequirement<TInput>;
}

/**
 * Check items action type.
 */
export interface CheckItemsAction<
  TInput extends readonly unknown[],
  TMessage extends ErrorMessage<CheckItemsIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, CheckItemsIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'check_items';
  /**
   * The action reference.
   */
  readonly reference: typeof checkItems;
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
 * Creates an check items validation action.
 *
 * @param requirement The validation function.
 *
 * @returns An check items action.
 */
export function checkItems<TInput extends readonly unknown[]>(
  requirement: ArrayRequirement<TInput>
): CheckItemsAction<TInput, undefined>;

/**
 * Creates an check items validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns An check items action.
 */
export function checkItems<
  TInput extends readonly unknown[],
  const TMessage extends ErrorMessage<CheckItemsIssue<TInput>> | undefined,
>(
  requirement: ArrayRequirement<TInput>,
  message: TMessage
): CheckItemsAction<TInput, TMessage>;

export function checkItems(
  requirement: ArrayRequirement<unknown[]>,
  message?: ErrorMessage<CheckItemsIssue<unknown[]>>
): CheckItemsAction<
  unknown[],
  ErrorMessage<CheckItemsIssue<unknown[]>> | undefined
> {
  return {
    kind: 'validation',
    type: 'check_items',
    reference: checkItems,
    async: false,
    expects: null,
    requirement,
    message,
    _run(dataset, config) {
      if (dataset.typed) {
        for (let index = 0; index < dataset.value.length; index++) {
          const item = dataset.value[index];
          if (!this.requirement(item, index, dataset.value)) {
            _addIssue(this, 'item', dataset, config, {
              input: item,
              path: [
                {
                  type: 'array',
                  origin: 'value',
                  input: dataset.value,
                  key: index,
                  value: item,
                },
              ],
            });
          }
        }
      }
      return dataset;
    },
  };
}
