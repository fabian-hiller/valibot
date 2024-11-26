import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  DefaultValue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Infer undefinedable output type.
 */
export type InferUndefinedableOutput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, undefined>,
> = undefined extends TDefault
  ? InferOutput<TWrapped> | undefined
  : InferOutput<TWrapped> | Extract<DefaultValue<TDefault>, undefined>;
