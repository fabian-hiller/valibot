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
import type { InferUndefinedableOutput } from './types.ts';

/**
 * Undefinedable schema async type.
 */
export interface UndefinedableSchemaAsync<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, undefined>,
> extends BaseSchemaAsync<
    InferInput<TWrapped> | undefined,
    InferUndefinedableOutput<TWrapped, TDefault>,
    InferIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'undefinedable';
  /**
   * The schema reference.
   */
  readonly reference: typeof undefinedableAsync;
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
 * Creates an undefinedable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An undefinedable schema.
 */
export function undefinedableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): UndefinedableSchemaAsync<TWrapped, never>;

/**
 * Creates an undefinedable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An undefinedable schema.
 */
export function undefinedableAsync<
  const TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends DefaultAsync<TWrapped, undefined>,
>(
  wrapped: TWrapped,
  default_: TDefault
): UndefinedableSchemaAsync<TWrapped, TDefault>;

export function undefinedableAsync(
  wrapped:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ...args: unknown[]
): UndefinedableSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  unknown
> {
  // Create schema object
  // @ts-expect-error
  const schema: UndefinedableSchemaAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
    unknown
  > = {
    kind: 'schema',
    type: 'undefinedable',
    reference: undefinedableAsync,
    expects: `(${wrapped.expects} | undefined)`,
    async: true,
    wrapped,
    '~standard': 1,
    '~vendor': 'valibot',
    async '~validate'(dataset, config = getGlobalConfig()) {
      // If value is `undefined`, override it with default or return dataset
      if (dataset.value === undefined) {
        // If default is specified, override value of dataset
        if ('default' in this) {
          dataset.value = await getDefault(this, dataset, config);
        }

        // If value is still `undefined`, return dataset
        if (dataset.value === undefined) {
          // @ts-expect-error
          dataset.typed = true;
          return dataset as unknown as SuccessDataset<unknown>;
        }
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped['~validate'](dataset, config);
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
