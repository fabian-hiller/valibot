import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

// TODO: Document that `File` is not available by default in Node.js <=v18.

/**
 * File issue type.
 */
export interface FileIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'file';
  /**
   * The expected property.
   */
  readonly expected: 'File';
}

/**
 * File schema type.
 */
export interface FileSchema<
  TMessage extends ErrorMessage<FileIssue> | undefined,
> extends BaseSchema<File, File, FileIssue> {
  /**
   * The schema type.
   */
  readonly type: 'file';
  /**
   * The schema reference.
   */
  readonly reference: typeof file;
  /**
   * The expected property.
   */
  readonly expects: 'File';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a file schema.
 *
 * @returns A file schema.
 */
export function file(): FileSchema<undefined>;

/**
 * Creates a file schema.
 *
 * @param message The error message.
 *
 * @returns A file schema.
 */
export function file<
  const TMessage extends ErrorMessage<FileIssue> | undefined,
>(message: TMessage): FileSchema<TMessage>;

export function file(
  message?: ErrorMessage<FileIssue>
): FileSchema<ErrorMessage<FileIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'file',
    reference: file,
    expects: 'File',
    async: false,
    message,
    _run(dataset, config) {
      if (dataset.value instanceof File) {
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as Dataset<File, FileIssue>;
    },
  };
}
