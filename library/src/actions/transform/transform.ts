import type { BaseTransformation, TypedDataset } from '../../types/index.ts';

/**
 * Action type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Action = (input: any) => unknown;

/**
 * Transform action type.
 */
export interface TransformAction<TAction extends Action>
  extends BaseTransformation<
    Parameters<TAction>[0],
    ReturnType<TAction>,
    never
  > {
  /**
   * The action type.
   */
  readonly type: 'transform';
  /**
   * The transformation action.
   */
  readonly action: TAction;
}

/**
 * Creates a custom transformation action.
 *
 * @param action The transformation logic.
 *
 * @returns A transform action.
 */
export function transform<TAction extends Action>(
  action: TAction
): TransformAction<TAction> {
  return {
    kind: 'transformation',
    type: 'transform',
    action,
    async: false,
    _run(dataset) {
      dataset.value = action(dataset.value);
      // @ts-expect-error
      return dataset as TypedDataset<TOutput, never>;
    },
  };
}
