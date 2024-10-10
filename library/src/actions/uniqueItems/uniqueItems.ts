import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { ArrayInput } from '../types.ts';

/**
 * Unique items issue type.
 */
export interface UniqueItemsIssue<TInput extends ArrayInput>
  extends BaseIssue<TInput[number]> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'unique_items';
  /**
   * The expected input.
   */
  readonly expected: null;
}

/**
 * Unique items action type.
 */
export interface UniqueItemsAction<
  TInput extends ArrayInput,
  TMessage extends ErrorMessage<UniqueItemsIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, UniqueItemsIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'unique_items';
  /**
   * The action reference.
   */
  readonly reference: typeof uniqueItems;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an unique items validation action.
 *
 * @returns An unique items action.
 */
export function uniqueItems<TInput extends ArrayInput>(): UniqueItemsAction<
  TInput,
  undefined
>;

/**
 * Creates an unique items validation action.
 *
 * @param message The error message.
 *
 * @returns An unique items action.
 */
export function uniqueItems<
  TInput extends ArrayInput,
  const TMessage extends ErrorMessage<UniqueItemsIssue<TInput>> | undefined,
>(message: TMessage): UniqueItemsAction<TInput, TMessage>;

export function uniqueItems(
  message?: ErrorMessage<UniqueItemsIssue<unknown[]>>
): UniqueItemsAction<
  unknown[],
  ErrorMessage<UniqueItemsIssue<unknown[]>> | undefined
> {
  return {
    kind: 'validation',
    type: 'unique_items',
    reference: uniqueItems,
    async: false,
    expects: null,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed) {
        const checkMap = new Map<unknown, number[]>();
        for (let index = 0; index < dataset.value.length; index++) {
          const item = dataset.value[index];
          if (checkMap.has(item)) {
            _addIssue(this, 'item', dataset, config, {
              input: item,
              path: [
                // TODO: this is a placeholder value.
                // I would appreciate it if you could take a look at the questions in the PR.
                {
                  type: 'array',
                  origin: 'value',
                  input: dataset.value,
                  key: 5,
                  value: item,
                },
              ],
            });
          } else {
            checkMap.set(item, []);
          }
        }
      }
      return dataset;
    },
  };
}
