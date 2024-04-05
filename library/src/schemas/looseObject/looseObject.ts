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
import { unknown, type UnknownSchema } from '../unknown/index.ts';

/**
 * Strict object issue type.
 */
export interface LooseObjectIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'loose_object';
  /**
   * The expected input.
   */
  readonly expected: 'Object';
}

/**
 * Strict object schema type.
 */
export interface LooseObjectSchema<
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<LooseObjectIssue> | undefined,
> extends BaseSchema<
    InferObjectInput<TEntries, UnknownSchema>,
    InferObjectOutput<TEntries, UnknownSchema>,
    LooseObjectIssue | InferObjectIssue<TEntries, UnknownSchema>
  > {
  /**
   * The schema type.
   */
  readonly type: 'loose_object';
  /**
   * The object entries.
   */
  readonly entries: TEntries;
  /**
   * The rest schema.
   */
  readonly rest: UnknownSchema;
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
 * Creates a loose object schema.
 *
 * @param entries The object entries.
 *
 * @returns A loose object schema.
 */
export function looseObject<const TEntries extends ObjectEntries>(
  entries: TEntries
): LooseObjectSchema<TEntries, undefined>;

/**
 * Creates a loose object schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 *
 * @returns A loose object schema.
 */
export function looseObject<
  const TEntries extends ObjectEntries,
  const TMessage extends ErrorMessage<LooseObjectIssue> | undefined,
>(entries: TEntries, message: TMessage): LooseObjectSchema<TEntries, TMessage>;

export function looseObject(
  entries: ObjectEntries,
  message?: ErrorMessage<LooseObjectIssue>
): LooseObjectSchema<
  ObjectEntries,
  ErrorMessage<LooseObjectIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'loose_object',
    expects: 'Object',
    async: false,
    entries,
    rest: unknown(),
    message,
    _run(dataset, config) {
      return _objectDataset(
        this,
        looseObject,
        dataset,
        config,
        _addObjectRestIssues
      );
    },
  };
}
