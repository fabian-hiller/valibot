import type {
  BaseIssue,
  BaseSchema,
  Config,
  InferIssue,
} from '../../types/index.ts';
import { decodeFormData } from '../decodeFormData/decodeFormData.ts';
import { safeParse } from '../safeParse/safeParse.ts';
import type { SafeParseResult } from '../safeParse/types.ts';

/**
 * Parses a FormData input based on a schema.
 *
 * @param schema The schema to be used.
 * @param formData The FormData to be decoded and parsed.
 * @param config The parse configuration.
 *
 * @returns The parse result.
 */
export function safeParseFormData<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  formData: FormData,
  config?: Config<InferIssue<TSchema>>
): SafeParseResult<TSchema> {
  return safeParse(schema, decodeFormData(schema, formData), config);
}
