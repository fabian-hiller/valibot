import type {
  BaseIssue,
  BaseTransformation,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * To bigint issue interface.
 */
export interface ToBigintIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The issue type.
   */
  readonly type: 'to_bigint';
  /**
   * The expected property.
   */
  readonly expected: null;
}

/**
 * To bigint action interface.
 */
export interface ToBigintAction<
  TInput extends bigint | boolean | number | string,
> extends BaseTransformation<TInput, bigint, ToBigintIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'to_bigint';
  /**
   * The action reference.
   */
  readonly reference: typeof toBigint;
}

/**
 * Creates a to bigint transformation action.
 *
 * @returns A to bigint action.
 */
// @__NO_SIDE_EFFECTS__
export function toBigint<
  TInput extends bigint | boolean | number | string,
>(): ToBigintAction<TInput> {
  return {
    kind: 'transformation',
    type: 'to_bigint',
    reference: toBigint,
    async: false,
    '~run'(dataset, config) {
      try {
        // @ts-expect-error
        dataset.value = BigInt(dataset.value);
      } catch {
        _addIssue(this, 'bigint', dataset, config);
        // @ts-expect-error
        dataset.typed = false;
      }
      return dataset as OutputDataset<bigint, ToBigintIssue<TInput>>;
    },
  };
}
