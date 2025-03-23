import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  InferIssue,
} from '../../types/index.ts';
import { _getStandardProps } from '../../utils/index.ts';

/**
 * Changes the message configuration of a schema.
 *
 * @param schema The schema to configure.
 * @param message The error message.
 *
 * @returns The configured schema.
 */
// @__NO_SIDE_EFFECTS__
export function message<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  message: NonNullable<Config<InferIssue<TSchema>>['message']>
): TSchema {
  return {
    ...schema,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config_) {
      return schema['~run'](dataset, { ...config_, message });
    },
  };
}
