import type {
  BaseSchemaAsync,
  ErrorMessage,
  InferTupleInput,
  InferTupleIssue,
  InferTupleOutput,
  TupleItemsAsync,
} from '../../types/index.ts';
import type { StrictTupleIssue } from './types.ts';

/**
 * Strict tuple schema async type.
 */
export interface StrictTupleSchemaAsync<
  TItems extends TupleItemsAsync,
  TMessage extends ErrorMessage<StrictTupleIssue> | undefined,
> extends BaseSchemaAsync<
    InferTupleInput<TItems>,
    InferTupleOutput<TItems>,
    StrictTupleIssue | InferTupleIssue<TItems>
  > {
  /**
   * The schema type.
   */
  readonly type: 'strict_tuple';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof strictTupleAsync;
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
