import type {
  BaseIssue,
  BaseSchema,
  BaseTransformation,
  InferOutput,
} from '../../types/index.ts';
import { ValiError } from '../../utils/index.ts';

/**
 * Returns action type.
 *
 * @beta
 */
export interface ReturnsAction<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInput extends (...args: any[]) => unknown,
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
> extends BaseTransformation<
    TInput,
    (...args: Parameters<TInput>) => InferOutput<TSchema>,
    never
  > {
  /**
   * The action type.
   */
  readonly type: 'returns';
  /**
   * The action reference.
   */
  readonly reference: typeof returns;
  /**
   * The arguments schema.
   */
  readonly schema: TSchema;
}

/**
 * Creates a function return transformation action.
 *
 * @param schema The arguments schema.
 *
 * @returns An returns action.
 *
 * @beta
 */
export function returns<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInput extends (...args: any[]) => unknown,
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(schema: TSchema): ReturnsAction<TInput, TSchema>;

export function returns(
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>
): ReturnsAction<
  (...args: unknown[]) => unknown,
  BaseSchema<unknown, unknown, BaseIssue<unknown>>
> {
  return {
    kind: 'transformation',
    type: 'returns',
    reference: returns,
    async: false,
    schema,
    '~validate'(dataset, config) {
      const func = dataset.value;
      dataset.value = (...args_) => {
        const returnsDataset = this.schema['~validate'](
          { value: func(...args_) },
          config
        );
        if (returnsDataset.issues) {
          throw new ValiError(returnsDataset.issues);
        }
        return returnsDataset.value;
      };
      return dataset;
    },
  };
}
