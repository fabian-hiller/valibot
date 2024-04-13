import type { BaseIssue, BaseSchema, ErrorMessage } from '../../types/index.ts';
import { _schemaDataset } from '../../utils/index.ts';

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
   * The expected input.
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
    expects: 'Blob',
    async: false,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        blob,
        dataset.value instanceof Blob,
        dataset,
        config
      );
    },
  };
}
