import { getGlobalConfig } from '../../storages/index.ts';
import type { BaseSchema, Input, SchemaConfig } from '../../types/index.ts';

/**
 * Checks if the input matches the scheme. By using a type predicate, this
 * function can be used as a type guard.
 *
 * @param schema The schema to be used.
 * @param input The input to be tested.
 * @param config The parse configuration.
 *
 * @returns Whether the input matches the scheme.
 */
export function is<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown,
  config?: Pick<SchemaConfig, 'skipPipe'>
): input is Input<TSchema> {
  return !schema._parse(input, {
    abortEarly: true,
    skipPipe: getGlobalConfig(config)?.skipPipe,
  }).issues;
}
