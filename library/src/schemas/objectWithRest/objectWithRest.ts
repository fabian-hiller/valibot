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

/**
 * Object with rest issue type.
 */
export interface ObjectWithRestIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'object_with_rest';
  /**
   * The expected input.
   */
  readonly expected: 'Object';
}

/**
 * Object with rest schema type.
 */
export interface ObjectWithRestSchema<
  TEntries extends ObjectEntries,
  TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined,
> extends BaseSchema<
    InferObjectInput<TEntries, TRest>,
    InferObjectOutput<TEntries, TRest>,
    ObjectWithRestIssue | InferObjectIssue<TEntries, TRest>
  > {
  /**
   * The schema type.
   */
  readonly type: 'object_with_rest';
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
  readonly rest: TRest;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param rest The rest schema.
 *
 * @returns An object schema.
 */
export function objectWithRest<
  const TEntries extends ObjectEntries,
  const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  entries: TEntries,
  rest: TRest
): ObjectWithRestSchema<TEntries, TRest, undefined>;

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param rest The rest schema.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function objectWithRest<
  const TEntries extends ObjectEntries,
  const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined,
>(
  entries: TEntries,
  rest: TRest,
  message: TMessage
): ObjectWithRestSchema<TEntries, TRest, TMessage>;

export function objectWithRest(
  entries: ObjectEntries,
  rest: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<ObjectWithRestIssue>
): ObjectWithRestSchema<
  ObjectEntries,
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<ObjectWithRestIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'object_with_rest',
    expects: 'Object',
    async: false,
    entries,
    rest,
    message,
    _run(dataset, config) {
      return _objectDataset(
        this,
        objectWithRest,
        dataset,
        config,
        _addObjectRestIssues
      );
    },
  };
}
