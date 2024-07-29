import type {
  BaseIssue,
  BaseSchema,
  Config,
  Dataset,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { getFallback } from '../getFallback/index.ts';

/**
 * Fallback type.
 */
export type Fallback<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
> =
  | InferOutput<TSchema>
  | ((
      dataset?: Dataset<InferOutput<TSchema>, InferIssue<TSchema>>,
      config?: Config<InferIssue<TSchema>>
    ) => InferOutput<TSchema>);

/**
 * Schema with fallback type.
 */
export type SchemaWithFallback<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TFallback extends Fallback<TSchema>,
> = TSchema & {
  /**
   * The fallback value.
   */
  readonly fallback: TFallback;
};

/**
 * Returns a fallback value as output if the input does not match the schema.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
export function fallback<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TFallback extends Fallback<TSchema>,
>(
  schema: TSchema,
  fallback: TFallback
): SchemaWithFallback<TSchema, TFallback> {
  return {
    ...schema,
    fallback,
    _run(dataset, config) {
      const outputDataset = schema._run(dataset, config);
      return outputDataset.issues
        ? { typed: true, value: getFallback(this, outputDataset, config) }
        : outputDataset;
    },
  };
}
