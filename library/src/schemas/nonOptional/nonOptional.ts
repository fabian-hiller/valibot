import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  FailureDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type {
  InferNonOptionalInput,
  InferNonOptionalIssue,
  InferNonOptionalOutput,
  NonOptionalIssue,
} from './types.ts';

/**
 * Non optional schema type.
 */
export interface NonOptionalSchema<
  TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<NonOptionalIssue> | undefined,
> extends BaseSchema<
    InferNonOptionalInput<TWrapped>,
    InferNonOptionalOutput<TWrapped>,
    NonOptionalIssue | InferNonOptionalIssue<TWrapped>
  > {
  /**
   * The schema type.
   */
  readonly type: 'non_optional';
  /**
   * The schema reference.
   */
  readonly reference: typeof nonOptional;
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
export function nonOptional<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(wrapped: TWrapped): NonOptionalSchema<TWrapped, undefined>;

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non optional schema.
 */
export function nonOptional<
  const TWrapped extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<NonOptionalIssue> | undefined,
>(wrapped: TWrapped, message: TMessage): NonOptionalSchema<TWrapped, TMessage>;

export function nonOptional(
  wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<NonOptionalIssue> | undefined
): NonOptionalSchema<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<NonOptionalIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'non_optional',
    reference: nonOptional,
    expects: '!undefined',
    async: false,
    wrapped,
    message,
    '~standard': 1,
    '~vendor': 'valibot',
    '~validate'(dataset, config = getGlobalConfig()) {
      // If value is `undefined`, add issue and return dataset
      if (dataset.value === undefined) {
        _addIssue(this, 'type', dataset, config);
        // @ts-expect-error
        return dataset as FailureDataset<NonOptionalIssue>;
      }

      // Otherwise, return dataset of wrapped schema
      return this.wrapped['~validate'](dataset, config);
    },
  };
}
