import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferOutput,
  InferTupleInput,
  InferTupleIssue,
  InferTupleOutput,
  TupleItemsAsync,
} from '../../types/index.ts';
import type { TupleWithRestIssue } from './types.ts';

/**
 * Tuple with rest schema async type.
 */
export interface TupleWithRestSchemaAsync<
  TItems extends TupleItemsAsync,
  TRest extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<TupleWithRestIssue> | undefined,
> extends BaseSchemaAsync<
    [...InferTupleInput<TItems>, ...InferInput<TRest>[]],
    [...InferTupleOutput<TItems>, ...InferOutput<TRest>[]],
    TupleWithRestIssue | InferTupleIssue<TItems> | InferIssue<TRest>
  > {
  /**
   * The schema type.
   */
  readonly type: 'tuple_with_rest';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof tupleWithRestAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Array';
  /**
   * The items schema.
   */
  readonly items: TItems;
  /**
   * The rest schema.
   */
  readonly rest: TRest;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
