import type {
  BaseSchemaAsync,
  ErrorMessage,
  InferTupleInput,
  InferTupleIssue,
  InferTupleOutput,
  TupleItemsAsync,
} from '../../types/index.ts';
import type { TupleIssue } from './types.ts';

/**
 * Tuple schema async type.
 */
export interface TupleSchemaAsync<
  TItems extends TupleItemsAsync,
  TMessage extends ErrorMessage<TupleIssue> | undefined,
> extends BaseSchemaAsync<
    InferTupleInput<TItems>,
    InferTupleOutput<TItems>,
    TupleIssue | InferTupleIssue<TItems>
  > {
  /**
   * The schema type.
   */
  readonly type: 'tuple';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof tupleAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Array';
  /**
   * The items schema.
   */
  readonly items: TItems;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
