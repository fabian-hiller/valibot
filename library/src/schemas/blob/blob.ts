import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

// TODO: Document that `Blob` is not available by default in Node.js <=v16.

/**
 * Blob issue type.
 */
export interface BlobIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'blob';
  /**
   * The expected property.
   */
  readonly expected: 'Blob';
}

/**
 * Blob schema type.
 */
export interface BlobSchema<
  TMessage extends ErrorMessage<BlobIssue> | undefined,
> extends BaseSchema<Blob, Blob, BlobIssue> {
  /**
   * The schema type.
   */
  readonly type: 'blob';
  /**
   * The schema reference.
   */
  readonly reference: typeof blob;
  /**
   * The expected property.
   */
  readonly expects: 'Blob';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a blob schema.
 *
 * @returns A blob schema.
 */
export function blob(): BlobSchema<undefined>;

/**
 * Creates a blob schema.
 *
 * @param message The error message.
 *
 * @returns A blob schema.
 */
export function blob<
  const TMessage extends ErrorMessage<BlobIssue> | undefined,
>(message: TMessage): BlobSchema<TMessage>;

export function blob(
  message?: ErrorMessage<BlobIssue>
): BlobSchema<ErrorMessage<BlobIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'blob',
    reference: blob,
    expects: 'Blob',
    async: false,
    message,
    _run(dataset, config) {
      if (dataset.value instanceof Blob) {
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as Dataset<Blob, BlobIssue>;
    },
  };
}
