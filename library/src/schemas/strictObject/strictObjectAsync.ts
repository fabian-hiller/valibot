import type {
  BaseSchemaAsync,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntriesAsync,
} from '../../types/index.ts';
import type { NeverIssue, NeverSchema } from '../never/index.ts';
import type { StrictObjectIssue } from './strictObject.ts';

/**
 * Object schema async type.
 */
export interface StrictObjectSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TMessage extends ErrorMessage<StrictObjectIssue | NeverIssue> | undefined,
> extends BaseSchemaAsync<
    InferObjectInput<TEntries, NeverSchema<TMessage>>,
    InferObjectOutput<TEntries, NeverSchema<TMessage>>,
    StrictObjectIssue | InferObjectIssue<TEntries, NeverSchema<TMessage>>
  > {
  /**
   * The schema type.
   */
  readonly type: 'strict_object';
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
  readonly rest: NeverSchema<TMessage>;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
