import { ValiError } from '../../error/index.ts';
import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  Config,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * Parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param config The parse configuration.
 *
 * @returns The parsed input.
 */
export function parse<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  input: unknown,
  config?: Omit<Config<InferIssue<TSchema>>, 'skipPipe'>
): InferOutput<TSchema> {
  const dataset = schema._run(
    { typed: false, value: input },
    getGlobalConfig(config)
  );
  if (dataset.issues) {
    throw new ValiError(dataset.issues);
  }
  return dataset.value;
}
