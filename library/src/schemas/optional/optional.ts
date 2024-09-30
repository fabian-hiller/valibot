import { getDefault } from '../../methods/index.ts';
import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  Default,
  InferInput,
  InferIssue,
  SuccessDataset,
} from '../../types/index.ts';
import type { InferOptionalOutput } from './types.ts';

/**
 * Optional schema type.
 */
export interface OptionalSchema<
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends Default<TWrapped, undefined>,
> extends BaseSchema<
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
  readonly reference: typeof optional;
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
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A optional schema.
 */
export function optional<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): OptionalSchema<TWrapped, never>;

/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A optional schema.
 */
export function optional<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TDefault extends Default<TWrapped, undefined>,
>(wrapped: TWrapped, default_: TDefault): OptionalSchema<TWrapped, TDefault>;

export function optional(
  wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  ...args: unknown[]
): OptionalSchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, unknown> {
  // Create schema object
  // @ts-expect-error
  const schema: OptionalSchema<
    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    unknown
  > = {
    kind: 'schema',
    type: 'optional',
    reference: optional,
    expects: `(${wrapped.expects} | undefined)`,
    async: false,
    wrapped,
    '~standard': 1,
    '~vendor': 'valibot',
    '~validate'(dataset, config = getGlobalConfig()) {
      // If value is `undefined`, override it with default or return dataset
      if (dataset.value === undefined) {
        // If default is specified, override value of dataset
        if ('default' in this) {
          dataset.value = getDefault(this, dataset, config);
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
