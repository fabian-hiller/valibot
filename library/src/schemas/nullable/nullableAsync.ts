import { getDefault } from '../../methods/index.ts';
import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  InferInput,
  InferIssue,
  SuccessDataset,
} from '../../types/index.ts';
import type { InferNullableOutput } from './types.ts';

/**
 * Nullable schema async type.
 */
export interface NullableSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, null>,
> extends BaseSchemaAsync<
    InferInput<TWrapped> | null,
    InferNullableOutput<TWrapped, TDefault>,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'nullable';
  /**
   * The schema reference.
   */
  readonly reference: typeof nullableAsync;
  /**
   * The expected property.
   */
  readonly expects: `(${TWrapped['expects']} | null)`;
  /**
   * The wrapped schema.
   */
  readonly wrapped: TWrapped;
  /**
   * The default value.
   */
  readonly default: TDefault;
}

/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullable schema.
 */
export function nullableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NullableSchemaAsync<TWrapped, undefined>;

/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullable schema.
 */
export function nullableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends DefaultAsync<TWrapped, null>,
>(
  wrapped: TWrapped,
  default_: TDefault
): NullableSchemaAsync<TWrapped, TDefault>;

export function nullableAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  default_?: unknown
): NullableSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  unknown
> {
  return {
    kind: 'schema',
    type: 'nullable',
    reference: nullableAsync,
    expects: `(${wrapped.expects} | null)`,
    async: true,
    wrapped,
    default: default_,
    '~standard': 1,
    '~vendor': 'valibot',
    async '~validate'(dataset, config = getGlobalConfig()) {
      // If value is `null`, override it with default or return dataset
      if (dataset.value === null) {
        // If default is specified, override value of dataset
        if (this.default !== undefined) {
          dataset.value = await getDefault(this, dataset, config);
        }

        // If value is still `null`, return dataset
        if (dataset.value === null) {
          // @ts-expect-error
          dataset.typed = true;
          // @ts-expect-error
          return dataset as SuccessDataset<unknown>;
        }
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped['~validate'](dataset, config);
    },
  };
}
