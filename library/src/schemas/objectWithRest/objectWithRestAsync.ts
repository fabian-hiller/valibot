import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntriesAsync,
} from '../../types/index.ts';
import type { ObjectWithRestIssue } from './objectWithRest.ts';

/**
 * Object schema async type.
 */
export interface ObjectWithRestSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TRest extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined,
> extends BaseSchemaAsync<
    InferObjectInput<TEntries, TRest>,
    InferObjectOutput<TEntries, TRest>,
    ObjectWithRestIssue | InferObjectIssue<TEntries, TRest>
  > {
  /**
   * The schema type.
   */
  readonly type: 'object_with_rest';
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The object entries.
   */
  readonly entries: TEntries;
  /**
   * The rest schema.
   */
  readonly rest: TRest;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
