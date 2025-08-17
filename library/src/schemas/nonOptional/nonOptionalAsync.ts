import type { RequiredByModifierAsyncHKT } from '../../methods/requiredBy/requiredByAsync.ts';
import type {
  BaseHKTable,
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue, _getStandardProps } from '../../utils/index.ts';
import type { nonOptional } from './nonOptional.ts';
import type {
  InferNonOptionalInput,
  InferNonOptionalIssue,
  InferNonOptionalOutput,
  NonOptionalIssue,
} from './types.ts';

export interface NonOptionalRequiredAsyncHKT
  extends RequiredByModifierAsyncHKT {
  issue: NonOptionalIssue;
  result: NonOptionalSchemaAsync<this['schema'], this['message']>;
}

/**
 * Non optional schema async interface.
 */
export interface NonOptionalSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<NonOptionalIssue> | undefined,
> extends BaseSchemaAsync<
      InferNonOptionalInput<TWrapped>,
      InferNonOptionalOutput<TWrapped>,
      NonOptionalIssue | InferNonOptionalIssue<TWrapped>
    >,
    BaseHKTable<NonOptionalRequiredAsyncHKT> {
  /**
   * The schema type.
   */
  readonly type: 'non_optional';
  /**
   * The schema reference.
   */
  readonly reference: typeof nonOptional | typeof nonOptionalAsync;
  /**
   * The expected property.
   */
  readonly expects: '!undefined';
  /**
   * The wrapped schema.
   */
  readonly wrapped: TWrapped;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non optional schema.
 */
export function nonOptionalAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NonOptionalSchemaAsync<TWrapped, undefined>;

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non optional schema.
 */
export function nonOptionalAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<NonOptionalIssue> | undefined,
>(
  wrapped: TWrapped,
  message: TMessage
): NonOptionalSchemaAsync<TWrapped, TMessage>;

// @__NO_SIDE_EFFECTS__
export function nonOptionalAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<NonOptionalIssue> | undefined
): NonOptionalSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<NonOptionalIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'non_optional',
    reference: nonOptionalAsync,
    expects: '!undefined',
    async: true,
    wrapped,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    async '~run'(dataset, config) {
      // If value is not `undefined`, run wrapped schema
      if (dataset.value !== undefined) {
        // @ts-expect-error
        dataset = await this.wrapped['~run'](dataset, config);
      }

      // If value is `undefined`, add issue to dataset
      if (dataset.value === undefined) {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      // @ts-expect-error
      return dataset as OutputDataset<unknown, BaseIssue<unknown>>;
    },
    '~hktType': 'requiredByAsync',
  };
}
