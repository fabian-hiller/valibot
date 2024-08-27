import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  DefaultValue,
  InferOutput,
  NonOptional,
} from '../../types/index.ts';

/**
 * Infer undefinedable output type.
 */
export type InferUndefinedableOutput<
  TWrapped extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TWrapped, undefined>,
> = [TDefault] extends [never]
  ? InferOutput<TWrapped> | undefined
  : // FIXME: For schemas that transform the input to `undefined`, this
    // implementation may result in an incorrect output type
    | NonOptional<InferOutput<TWrapped>>
      | Extract<DefaultValue<TDefault>, undefined>;
