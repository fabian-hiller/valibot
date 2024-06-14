import type {
  BaseTransformationAsync,
  Dataset,
  MaybePromise,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { Context, RawTransformIssue } from './types.ts';

/**
 * Raw transform action async type.
 */
export interface RawTransformActionAsync<TInput, TOutput>
  extends BaseTransformationAsync<TInput, TOutput, RawTransformIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'raw_transform';
  /**
   * The action reference.
   */
  readonly reference: typeof rawTransformAsync;
}

/**
 * Creates a raw transformation action.
 *
 * @param action The transformation action.
 *
 * @returns A raw transform action.
 */
export function rawTransformAsync<TInput, TOutput>(
  action: (context: Context<TInput>) => MaybePromise<TOutput>
): RawTransformActionAsync<TInput, TOutput> {
  return {
    kind: 'transformation',
    type: 'raw_transform',
    reference: rawTransformAsync,
    async: true,
    async _run(dataset, config) {
      // Execute action and get its output
      const output = await action({
        dataset,
        config,
        addIssue: (info) =>
          _addIssue(this, info?.label ?? 'input', dataset, config, info),
        NEVER: null as never,
      });

      // Update dataset depending on issues
      if (dataset.issues) {
        // @ts-expect-error
        dataset.typed = false;
      } else {
        // @ts-expect-error
        dataset.value = output;
      }

      // Return output dataset
      // @ts-expect-error
      return dataset as Dataset<TOutput, RawTransformIssue<TInput>>;
    },
  };
}
