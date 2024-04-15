import type {
  BaseSchemaAsync,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntriesAsync,
} from '../../types/index.ts';
import type { UnknownSchema } from '../unknown/index.ts';
import type { LooseObjectIssue } from './looseObject.ts';

/**
 * Object schema async type.
 */
export interface LooseObjectSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TMessage extends ErrorMessage<LooseObjectIssue> | undefined,
> extends BaseSchemaAsync<
    InferObjectInput<TEntries, UnknownSchema>,
    InferObjectOutput<TEntries, UnknownSchema>,
    LooseObjectIssue | InferObjectIssue<TEntries, UnknownSchema>
  > {
  /**
   * The schema type.
   */
  readonly type: 'loose_object';
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
  readonly rest: UnknownSchema;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
