import type { BaseTransformation, SuccessDataset } from '../../types/index.ts';
import type { ObjectInput, SelectedStringKeys } from '../types.ts';
import { snakeCase } from './helpers.ts';
import type { Output } from './types.ts';

/**
 * To snake case keys action interface.
 */
export interface ToSnakeCaseKeysAction<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
> extends BaseTransformation<TInput, Output<TInput, TSelectedKeys>, never> {
  /**
   * The action type.
   */
  readonly type: 'to_snake_case_keys';
  /**
   * The action reference.
   */
  readonly reference: typeof toSnakeCaseKeys;
  /**
   * The keys to be transformed.
   */
  readonly selectedKeys: TSelectedKeys;
}

/**
 * Creates a to snake case keys transformation action.
 *
 * @returns A to snake case keys action.
 */
export function toSnakeCaseKeys<
  TInput extends ObjectInput,
>(): ToSnakeCaseKeysAction<TInput, undefined>;

/**
 * Creates a to snake case keys transformation action.
 *
 * @param selectedKeys The keys to be transformed.
 *
 * @returns A to snake case keys action.
 */
export function toSnakeCaseKeys<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput>,
>(
  selectedKeys: [...TSelectedKeys]
): ToSnakeCaseKeysAction<TInput, TSelectedKeys>;

/**
 * Creates a to snake case keys transformation action.
 *
 * @param selectedKeys The keys to be transformed.
 *
 * @returns A to snake case keys action.
 */
// @__NO_SIDE_EFFECTS__
export function toSnakeCaseKeys(
  selectedKeys?: SelectedStringKeys<ObjectInput>
): ToSnakeCaseKeysAction<
  ObjectInput,
  SelectedStringKeys<ObjectInput> | undefined
> {
  return {
    kind: 'transformation',
    type: 'to_snake_case_keys',
    reference: toSnakeCaseKeys,
    async: false,
    selectedKeys,
    '~run'(dataset) {
      const input = dataset.value;
      dataset.value = {};
      const allKeys = Object.keys(input);
      const selectedKeys = new Set(this.selectedKeys ?? allKeys);
      for (const key of allKeys) {
        dataset.value[selectedKeys.has(key) ? snakeCase(key) : key] =
          input[key];
      }
      return dataset as SuccessDataset<
        Output<ObjectInput, SelectedStringKeys<ObjectInput> | undefined>
      >;
    },
  };
}
