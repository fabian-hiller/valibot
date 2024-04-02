import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntries,
} from '../../types/index.ts';
import { _addObjectRestIssues, _objectDataset } from '../../utils/index.ts';
import { never, type NeverIssue, type NeverSchema } from '../never/index.ts';

/**
 * Strict object issue type.
 */
export interface StrictObjectIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'strict_object';
  /**
   * The expected input.
   */
  readonly expected: 'Object';
}

/**
 * Strict object schema type.
 */
export interface StrictObjectSchema<
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<StrictObjectIssue | NeverIssue> | undefined,
> extends BaseSchema<
    InferObjectInput<TEntries, NeverSchema<TMessage>>,
    InferObjectOutput<TEntries, NeverSchema<TMessage>>,
    StrictObjectIssue | InferObjectIssue<TEntries, NeverSchema<TMessage>>
  > {
  /**
   * The schema type.
   */
  readonly type: 'strict_object';
  /**
   * The object entries.
   */
  readonly entries: TEntries;
  /**
   * The rest schema.
   */
  readonly rest: NeverSchema<TMessage>;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a strict object schema.
 *
 * @param entries The object entries.
 *
 * @returns A strict object schema.
 */
export function strictObject<const TEntries extends ObjectEntries>(
  entries: TEntries
): StrictObjectSchema<TEntries, undefined>;

/**
 * Creates a strict object schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 *
 * @returns A strict object schema.
 */
export function strictObject<
  const TEntries extends ObjectEntries,
  const TMessage extends
    | ErrorMessage<StrictObjectIssue | NeverIssue>
    | undefined,
>(entries: TEntries, message: TMessage): StrictObjectSchema<TEntries, TMessage>;

export function strictObject(
  entries: ObjectEntries,
  message?: ErrorMessage<StrictObjectIssue | NeverIssue>
): StrictObjectSchema<
  ObjectEntries,
  ErrorMessage<StrictObjectIssue | NeverIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'strict_object',
    expects: 'Object',
    async: false,
    entries,
    rest: never(message),
    message,
    _run(dataset, config) {
      return _objectDataset(
        this,
        strictObject,
        dataset,
        config,
        _addObjectRestIssues
      );
    },
  };
}
