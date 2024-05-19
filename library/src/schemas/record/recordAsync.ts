import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferIssue,
} from '../../types/index.ts';
import type {
  InferRecordInput,
  InferRecordOutput,
  RecordIssue,
} from './types.ts';

/**
 * Record schema async type.
 */
export interface RecordSchemaAsync<
  TKey extends
    | BaseSchema<string, string | number | symbol, BaseIssue<unknown>>
    | BaseSchemaAsync<string, string | number | symbol, BaseIssue<unknown>>,
  TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<RecordIssue> | undefined,
> extends BaseSchemaAsync<
    InferRecordInput<TKey, TValue>,
    InferRecordOutput<TKey, TValue>,
    RecordIssue | InferIssue<TKey> | InferIssue<TValue>
  > {
  /**
   * The schema type.
   */
  readonly type: 'record';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof recordAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The record key schema.
   */
  readonly key: TKey;
  /**
   * The record value schema.
   */
  readonly value: TValue;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
