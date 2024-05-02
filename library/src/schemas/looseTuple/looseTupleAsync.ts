import type {
  BaseSchemaAsync,
  ErrorMessage,
  InferTupleInput,
  InferTupleIssue,
  InferTupleOutput,
  TupleItemsAsync,
} from '../../types/index.ts';
import type { LooseTupleIssue } from './types.ts';

/**
 * Loose tuple schema async type.
 */
export interface LooseTupleSchemaAsync<
  TItems extends TupleItemsAsync,
  TMessage extends ErrorMessage<LooseTupleIssue> | undefined,
> extends BaseSchemaAsync<
    [...InferTupleInput<TItems>, ...unknown[]],
    [...InferTupleOutput<TItems>, ...unknown[]],
    LooseTupleIssue | InferTupleIssue<TItems>
  > {
  /**
   * The schema type.
   */
  readonly type: 'loose_tuple';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof looseTupleAsync;
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
