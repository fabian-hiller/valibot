import type { BaseTransformation, SuccessDataset } from '../../types/index.ts';
import type { ObjectInput } from '../types.ts';
import { snakeCase } from './helpers.ts';
import type { Output, SelectedStringKeys } from './types.ts';

/**
 * To snake case action interface.
 */
export interface ToSnakeCaseAction<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
> extends BaseTransformation<TInput, Output<TInput, TSelectedKeys>, never> {
  /**
   * The action type.
   */
  readonly type: 'to_snake_case';
  /**
   * The action reference.
   */
  readonly reference: typeof toSnakeCase;
  /**
   * The keys to be transformed.
   */
  readonly selectedKeys: TSelectedKeys;
}

/**
 * Creates a to snake case transformation action.
 *
 * @returns A to snake case action.
 */
export function toSnakeCase<TInput extends ObjectInput>(): ToSnakeCaseAction<
  TInput,
  undefined
>;

/**
 * Creates a to snake case transformation action.
 *
 * @param selectedKeys The keys to be transformed.
 *
 * @returns A to snake case action.
 */
export function toSnakeCase<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput>,
>(selectedKeys: TSelectedKeys): ToSnakeCaseAction<TInput, TSelectedKeys>;

/**
 * Creates a to snake case transformation action.
 *
 * @param selectedKeys The keys to be transformed.
 *
 * @returns A to snake case action.
 */
// @__NO_SIDE_EFFECTS__
export function toSnakeCase(
  selectedKeys?: SelectedStringKeys<ObjectInput>
): ToSnakeCaseAction<ObjectInput, SelectedStringKeys<ObjectInput> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_snake_case',
    reference: toSnakeCase,
    async: false,
    selectedKeys,
    '~run'(dataset) {
      const input = dataset.value;
      dataset.value = {};
      const allKeys = Object.keys(input);
      const selectedKeys = new Set(this.selectedKeys ?? allKeys);
      for (const key of allKeys) {
        let destKey = key;
        if (
          !selectedKeys.has(destKey) ||
          (destKey = snakeCase(key)) === key ||
          !Object.hasOwn(input, destKey)
        ) {
          dataset.value[destKey] = input[key];
        }
      }
      return dataset as SuccessDataset<
        Output<ObjectInput, SelectedStringKeys<ObjectInput> | undefined>
      >;
    },
  };
}
