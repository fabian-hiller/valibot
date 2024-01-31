import { ValiError } from '../../error/index.ts';
import { getGlobalConfig } from '../../storages/index.ts';
import type { BaseSchema, Config } from '../../types/index.ts';
import type { SafeParseResult } from './types.ts';

/**
 * Parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param config The parse configuration.
 *
 * @returns The parsed output.
 */
export function safeParse<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown,
  config?: Config
): SafeParseResult<TSchema> {
  const result = schema._parse(input, getGlobalConfig(config));
  return {
    typed: result.typed,
    success: !result.issues,
    data: result.output,
    output: result.output,
    error: result.issues && new ValiError(result.issues),
    issues: result.issues,
  } as unknown as SafeParseResult<TSchema>;
}
