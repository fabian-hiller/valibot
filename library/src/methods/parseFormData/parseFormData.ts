import type {
  BaseIssue,
  BaseSchema,
  Config,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { FormError } from '../../utils/index.ts';
import { safeParseFormData } from '../safeParseFormData/safeParseFormData.ts';

/**
 * Parses an FormData input based on a schema.
 *
 * @param schema The schema to be used.
 * @param formData The FormData to be decoded and parsed.
 * @param config The parse configuration.
 *
 * @returns The parsed input.
 */
export function parseFormData<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  formData: FormData,
  config?: Config<InferIssue<TSchema>>
): InferOutput<TSchema> {
  const result = safeParseFormData(schema, formData, config);
  if (result.issues) {
    throw new FormError(result.issues);
  }
  return result.output;
}
