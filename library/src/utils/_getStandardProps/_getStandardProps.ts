import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  InferOutput,
  StandardResult,
  StandardSchemaProps,
} from '../../types/index.ts';

/**
 * Returns the Standard Schema properties.
 *
 * @param context The schema context.
 *
 * @returns The Standard Schema properties.
 */
// @__NO_SIDE_EFFECTS__
export function _getStandardProps<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  context: TSchema
): StandardSchemaProps<InferInput<TSchema>, InferOutput<TSchema>> {
  return {
    version: 1,
    vendor: 'valibot',
    validate(value) {
      return context['~run']({ value }, getGlobalConfig()) as
        | StandardResult<InferOutput<TSchema>>
        | Promise<StandardResult<InferOutput<TSchema>>>;
    },
  };
}
