import { ValiError } from '../../error/index.ts';
import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Output,
  SchemaConfig,
} from '../../types/index.ts';

/**
 * Parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param config The parse configuration.
 *
 * @returns The parsed output.
 */
export async function parseAsync<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema,
  input: unknown,
  config?: SchemaConfig
): Promise<Output<TSchema>> {
  const result = await schema._parse(input, getGlobalConfig(config));
  if (result.issues) {
    throw new ValiError(result.issues);
  }
  return result.output;
}
