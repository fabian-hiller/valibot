import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  DefaultValue,
  InferOutput,
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
  : InferOutput<TWrapped> | DefaultValue<TDefault>;
