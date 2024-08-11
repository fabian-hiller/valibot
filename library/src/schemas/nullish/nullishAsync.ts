import { getDefault } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Dataset,
  DefaultAsync,
  InferInput,
  InferIssue,
} from '../../types/index.ts';
import type { InferNullishOutput } from './types.ts';

/**
 * Nullish schema async type.
 */
export interface NullishSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, null | undefined>,
> extends BaseSchemaAsync<
    InferInput<TWrapped> | null | undefined,
    InferNullishOutput<TWrapped, TDefault>,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'nullish';
  /**
   * The schema reference.
   */
  readonly reference: typeof nullishAsync;
  /**
   * The expected property.
   */
  readonly expects: `(${TWrapped['expects']} | null | undefined)`;
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
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A nullish schema.
 */
export function nullishAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NullishSchemaAsync<TWrapped, never>;

/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullish schema.
 */
export function nullishAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends DefaultAsync<TWrapped, null | undefined>,
>(
  wrapped: TWrapped,
  default_: TDefault
): NullishSchemaAsync<TWrapped, TDefault>;

export function nullishAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ...args: unknown[]
): NullishSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  unknown
> {
  // Create schema object
  // @ts-expect-error
  const schema: NullishSchemaAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
    unknown
  > = {
    kind: 'schema',
    type: 'nullish',
    reference: nullishAsync,
    expects: `(${wrapped.expects} | null | undefined)`,
    async: true,
    wrapped,
    async _run(dataset, config) {
      // If value is `null` or `undefined`, override it with default or return
      // dataset
      if (dataset.value === null || dataset.value === undefined) {
        // If default is specified, override value of dataset
        if ('default' in this) {
          dataset.value = await getDefault(
            this,
            dataset as Dataset<null | undefined, never>,
            config
          );
        }

        // If value is still `null` or `undefined`, return dataset
        if (dataset.value === null || dataset.value === undefined) {
          dataset.typed = true;
          return dataset;
        }
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped._run(dataset, config);
    },
  };

  // Add default if specified
  if (0 in args) {
    // @ts-expect-error
    schema.default = args[0];
  }

  // Return schema object
  return schema;
}
