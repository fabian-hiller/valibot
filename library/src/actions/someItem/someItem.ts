import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { ArrayRequirement } from '../types.ts';

/**
 * Some item issue type.
 */
export interface SomeItemIssue<TInput extends unknown[]>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'some_item';
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
 * Some item action type.
 */
export interface SomeItemAction<
  TInput extends unknown[],
  TMessage extends ErrorMessage<SomeItemIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, SomeItemIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'some_item';
  /**
   * The action reference.
   */
  readonly reference: typeof someItem;
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
 * Creates a some item validation action.
 *
 * @param requirement The validation function.
 *
 * @returns A some item action.
 */
export function someItem<TInput extends unknown[]>(
  requirement: ArrayRequirement<TInput>
): SomeItemAction<TInput, undefined>;

/**
 * Creates a some item validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A some item action.
 */
export function someItem<
  TInput extends unknown[],
  const TMessage extends ErrorMessage<SomeItemIssue<TInput>> | undefined,
>(
  requirement: ArrayRequirement<TInput>,
  message: TMessage
): SomeItemAction<TInput, TMessage>;

export function someItem(
  requirement: ArrayRequirement<unknown[]>,
  message?: ErrorMessage<SomeItemIssue<unknown[]>>
): SomeItemAction<
  unknown[],
  ErrorMessage<SomeItemIssue<unknown[]>> | undefined
> {
  return {
    kind: 'validation',
    type: 'some_item',
    reference: someItem,
    async: false,
    expects: null,
    requirement,
    message,
    _run(dataset, config) {
      if (dataset.typed && !dataset.value.some(this.requirement)) {
        _addIssue(this, 'item', dataset, config);
      }
      return dataset;
    },
  };
}
