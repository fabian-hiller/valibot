import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  FailureDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type {
  InferNonNullishInput,
  InferNonNullishIssue,
  InferNonNullishOutput,
  NonNullishIssue,
} from './types.ts';

/**
 * Non nullish schema async type.
 */
export interface NonNullishSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<NonNullishIssue> | undefined,
> extends BaseSchemaAsync<
    InferNonNullishInput<TWrapped>,
    InferNonNullishOutput<TWrapped>,
    NonNullishIssue | InferNonNullishIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'non_nullish';
  /**
   * The schema reference.
   */
  readonly reference: typeof nonNullishAsync;
  /**
   * The expected property.
   */
  readonly expects: '(!null & !undefined)';
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
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non nullish schema.
 */
export function nonNullishAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NonNullishSchemaAsync<TWrapped, undefined>;

/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullish schema.
 */
export function nonNullishAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<NonNullishIssue> | undefined,
>(
  wrapped: TWrapped,
  message: TMessage
): NonNullishSchemaAsync<TWrapped, TMessage>;

export function nonNullishAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<NonNullishIssue> | undefined
): NonNullishSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<NonNullishIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'non_nullish',
    reference: nonNullishAsync,
    expects: '(!null & !undefined)',
    async: true,
    wrapped,
    message,
    '~standard': 1,
    '~vendor': 'valibot',
    async '~validate'(dataset, config = getGlobalConfig()) {
      // If value is `null` or `undefined`, add issue and return dataset
      if (dataset.value === null || dataset.value === undefined) {
        _addIssue(this, 'type', dataset, config);
        // @ts-expect-error
        return dataset as FailureDataset<NonNullishIssue>;
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped['~validate'](dataset, config);
    },
  };
}
