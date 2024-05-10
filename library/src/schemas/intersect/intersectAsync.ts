import type {
  BaseSchemaAsync,
  ErrorMessage,
  InferIssue,
} from '../../types/index.ts';
import type {
  InferIntersectInput,
  InferIntersectOutput,
  IntersectIssue,
  IntersectOptionsAsync,
} from './types.ts';

/**
 * Intersect schema async type.
 */
export interface IntersectSchemaAsync<
  TOptions extends IntersectOptionsAsync,
  TMessage extends ErrorMessage<IntersectIssue> | undefined,
> extends BaseSchemaAsync<
    InferIntersectInput<TOptions>,
    InferIntersectOutput<TOptions>,
    IntersectIssue | InferIssue<TOptions[number]>
  > {
  /**
   * The schema type.
   */
  readonly type: 'intersect';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof intersectAsync;
  /**
   * The intersect options.
   */
  readonly options: TOptions;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
