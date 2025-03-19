import type { BaseTransformation, SuccessDataset } from '../../types/index.ts';
import { camelCase } from '../toCamelCase/helpers.ts';
import type { ObjectInput, Output, SelectedStringKeys } from './types.ts';

/**
 * To camel case keys action interface.
 */
export interface ToCamelCaseKeysAction<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
> extends BaseTransformation<TInput, Output<TInput, TSelectedKeys>, never> {
  /**
   * The action type.
   */
  readonly type: 'to_camel_case_keys';
  /**
   * The action reference.
   */
  readonly reference: typeof toCamelCaseKeys;
  /**
   * The keys to be transformed.
   */
  readonly selectedKeys: TSelectedKeys;
}

/**
 * Creates a to camel case keys transformation action.
 *
 * @returns A to camel case keys action.
 */
export function toCamelCaseKeys<
  TInput extends ObjectInput,
>(): ToCamelCaseKeysAction<TInput, undefined>;

/**
 * Creates a to camel case keys transformation action.
 *
 * @param selectedKeys The keys to be transformed.
 *
 * @returns A to camel case keys action.
 */
export function toCamelCaseKeys<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput>,
>(
  selectedKeys: [...TSelectedKeys]
): ToCamelCaseKeysAction<TInput, TSelectedKeys>;

/**
 * Creates a to camel case keys transformation action.
 *
 * @param selectedKeys The keys to be transformed.
 *
 * @returns A to camel case keys action.
 */
// @__NO_SIDE_EFFECTS__
export function toCamelCaseKeys(
  selectedKeys?: SelectedStringKeys<ObjectInput>
): ToCamelCaseKeysAction<
  ObjectInput,
  SelectedStringKeys<ObjectInput> | undefined
> {
  return {
    kind: 'transformation',
    type: 'to_camel_case_keys',
    reference: toCamelCaseKeys,
    async: false,
    selectedKeys,
    '~run'(dataset) {
      const input = dataset.value;
      dataset.value = {};
      const allKeys = Object.keys(input);
      const selectedKeys = new Set(this.selectedKeys ?? allKeys);
      for (const key of allKeys) {
        dataset.value[selectedKeys.has(key) ? camelCase(key) : key] =
          input[key];
      }
      return dataset as SuccessDataset<
        Output<ObjectInput, SelectedStringKeys<ObjectInput> | undefined>
      >;
    },
  };
}
