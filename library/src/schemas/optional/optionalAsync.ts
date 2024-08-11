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
import type { InferOptionalOutput } from './types.ts';

/**
 * Optional schema async type.
 */
export interface OptionalSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, undefined>,
> extends BaseSchemaAsync<
    InferInput<TWrapped> | undefined,
    InferOptionalOutput<TWrapped, TDefault>,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'optional';
  /**
   * The schema reference.
   */
  readonly reference: typeof optionalAsync;
  /**
   * The expected property.
   */
  readonly expects: `(${TWrapped['expects']} | undefined)`;
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
 * Creates an optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An optional schema.
 */
export function optionalAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): OptionalSchemaAsync<TWrapped, never>;

/**
 * Creates an optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An optional schema.
 */
export function optionalAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends DefaultAsync<TWrapped, undefined>,
>(
  wrapped: TWrapped,
  default_: TDefault
): OptionalSchemaAsync<TWrapped, TDefault>;

export function optionalAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ...args: unknown[]
): OptionalSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  unknown
> {
  // Create schema object
  // @ts-expect-error
  const schema: OptionalSchemaAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
    unknown
  > = {
    kind: 'schema',
    type: 'optional',
    reference: optionalAsync,
    expects: `(${wrapped.expects} | undefined)`,
    async: true,
    wrapped,
    async _run(dataset, config) {
      // If value is `undefined`, override it with default or return dataset
      if (dataset.value === undefined) {
        // If default is specified, override value of dataset
        if ('default' in this) {
          dataset.value = await getDefault(
            this,
            dataset as Dataset<undefined, never>,
            config
          );
        }

        // If value is still `undefined`, return dataset
        if (dataset.value === undefined) {
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
