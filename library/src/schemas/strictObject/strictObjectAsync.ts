import type {
  BaseSchemaAsync,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntriesAsync,
} from '../../types/index.ts';
import type { StrictObjectIssue } from './types.ts';

/**
 * Object schema async type.
 */
export interface StrictObjectSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TMessage extends ErrorMessage<StrictObjectIssue> | undefined,
> extends BaseSchemaAsync<
    InferObjectInput<TEntries>,
    InferObjectOutput<TEntries>,
    StrictObjectIssue | InferObjectIssue<TEntries>
  > {
  /**
   * The schema type.
   */
  readonly type: 'strict_object';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof strictObjectAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The entries schema.
   */
  readonly entries: TEntries;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
