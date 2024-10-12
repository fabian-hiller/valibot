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
  InferNonNullableInput,
  InferNonNullableIssue,
  InferNonNullableOutput,
  NonNullableIssue,
} from './types.ts';

/**
 * Non nullable schema async type.
 */
export interface NonNullableSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<NonNullableIssue> | undefined,
> extends BaseSchemaAsync<
    InferNonNullableInput<TWrapped>,
    InferNonNullableOutput<TWrapped>,
    NonNullableIssue | InferNonNullableIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'non_nullable';
  /**
   * The schema reference.
   */
  readonly reference: typeof nonNullableAsync;
  /**
   * The expected property.
   */
  readonly expects: '!null';
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
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A non nullable schema.
 */
export function nonNullableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NonNullableSchemaAsync<TWrapped, undefined>;

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullable schema.
 */
export function nonNullableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<NonNullableIssue> | undefined,
>(
  wrapped: TWrapped,
  message: TMessage
): NonNullableSchemaAsync<TWrapped, TMessage>;

export function nonNullableAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<NonNullableIssue> | undefined
): NonNullableSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<NonNullableIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'non_nullable',
    reference: nonNullableAsync,
    expects: '!null',
    async: true,
    wrapped,
    message,
    '~standard': 1,
    '~vendor': 'valibot',
    async '~validate'(dataset, config = getGlobalConfig()) {
      // If value is `null`, add issue and return dataset
      if (dataset.value === null) {
        _addIssue(this, 'type', dataset, config);
        // @ts-expect-error
        return dataset as FailureDataset<NonNullableIssue>;
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped['~validate'](dataset, config);
    },
  };
}
