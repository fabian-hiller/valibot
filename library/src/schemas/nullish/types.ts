import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  DefaultValue,
  InferOutput,
  NonNullish,
} from '../../types/index.ts';

/**
 * Infer nullish output type.
 */
export type InferNullishOutput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, undefined>,
> = [TDefault] extends [never]
  ? InferOutput<TWrapped> | null | undefined
  : // FIXME: For schemas that transform the input to `undefined`, this
    // implementation may result in an incorrect output type
    | NonNullish<InferOutput<TWrapped>>
      | Extract<DefaultValue<TDefault>, null | undefined>;
