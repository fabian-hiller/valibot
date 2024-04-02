import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntries,
} from '../../types/index.ts';
import { _objectDataset } from '../../utils/index.ts';

/**
 * Object issue type.
 */
export interface ObjectIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'object';
  /**
   * The expected input.
   */
  readonly expected: 'Object';
}

/**
 * Object schema type.
 */
export interface ObjectSchema<
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<ObjectIssue> | undefined,
> extends BaseSchema<
    InferObjectInput<TEntries, undefined>,
    InferObjectOutput<TEntries, undefined>,
    ObjectIssue | InferObjectIssue<TEntries, undefined>
  > {
  /**
   * The schema type.
   */
  readonly type: 'object';
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The object entries.
   */
  readonly entries: TEntries;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 *
 * @returns An object schema.
 */
export function object<const TEntries extends ObjectEntries>(
  entries: TEntries
): ObjectSchema<TEntries, undefined>;

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function object<
  const TEntries extends ObjectEntries,
  const TMessage extends ErrorMessage<ObjectIssue> | undefined,
>(entries: TEntries, message: TMessage): ObjectSchema<TEntries, TMessage>;

export function object(
  entries: ObjectEntries,
  message?: ErrorMessage<ObjectIssue>
): ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'object',
    expects: 'Object',
    async: false,
    entries,
    message,
    _run(dataset, config) {
      return _objectDataset(this, object, dataset, config);
    },
  };
}
