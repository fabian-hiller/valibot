import type { BaseTransformation } from '../../types/index.ts';
import { camelCase } from './helpers.ts';

/**
 * To camel case action interface.
 */
export interface ToCamelCaseAction
  extends BaseTransformation<string, string, never> {
  /**
   * The action type.
   */
  readonly type: 'to_camel_case';
  /**
   * The action reference.
   */
  readonly reference: typeof toCamelCase;
}

/**
 * Creates a to camel case transformation action.
 *
 * @returns A to camel case action.
 */
// @__NO_SIDE_EFFECTS__
export function toCamelCase(): ToCamelCaseAction {
  return {
    kind: 'transformation',
    type: 'to_camel_case',
    reference: toCamelCase,
    async: false,
    '~run'(dataset) {
      dataset.value = camelCase(dataset.value);
      return dataset;
    },
  };
}
