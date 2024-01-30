import { ValiError } from '../../error/index.ts';
import { getGlobalConfig } from '../../storages/index.ts';
import type { BaseSchema, Config, Output } from '../../types/index.ts';

/**
 * Parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param config The parse configuration.
 *
 * @returns The parsed output.
 */
export function parse<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown,
  config?: Config
): Output<TSchema> {
  const result = schema._parse(input, getGlobalConfig(config));
  if (result.issues) {
    throw new ValiError(result.issues);
  }
  return result.output;
}
