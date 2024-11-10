import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  DefaultValue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Infer optional output type.
 */
export type InferOptionalOutput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, undefined>,
> = undefined extends TDefault
  ? InferOutput<TWrapped> | undefined
  : InferOutput<TWrapped> | DefaultValue<TDefault>;
