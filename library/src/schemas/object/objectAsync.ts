import type {
  BaseSchemaAsync,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntriesAsync,
} from '../../types/index.ts';
import type { ObjectIssue } from './object.ts';

/**
 * Object schema async type.
 */
export interface ObjectSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TMessage extends ErrorMessage<ObjectIssue> | undefined,
> extends BaseSchemaAsync<
    InferObjectInput<TEntries, undefined>,
    InferObjectOutput<TEntries, undefined>,
    ObjectIssue | InferObjectIssue<TEntries, undefined>
  > {
  /**
   * The schema type.
   */
  readonly type: 'object';
  /**
   * The object entries.
   */
  readonly entries: TEntries;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The error message.
   */
  readonly message: TMessage;
}
