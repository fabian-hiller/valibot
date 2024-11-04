import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  DefaultValue,
  InferOutput,
  NonNullable,
} from '../../types/index.ts';

/**
 * Infer nullable output type.
 */
export type InferNullableOutput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, null>,
> = undefined extends TDefault
  ? InferOutput<TWrapped> | null
  : // FIXME: For schemas that transform the input to `null`, this
    // implementation may result in an incorrect output type
    NonNullable<InferOutput<TWrapped>> | Extract<DefaultValue<TDefault>, null>;
