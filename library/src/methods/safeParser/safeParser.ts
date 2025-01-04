import type {
  BaseIssue,
  BaseSchema,
  Config,
  InferIssue,
} from '../../types/index.ts';
import { safeParse, type SafeParseResult } from '../safeParse/index.ts';

/**
 * The safe parser type.
 */
export interface SafeParser<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TConfig extends Config<InferIssue<TSchema>> | undefined,
> {
  /**
   * Parses an unknown input based on the schema.
   */
  (input: unknown): SafeParseResult<TSchema>;
  /**
   * The schema to be used.
   */
  readonly schema: TSchema;
  /**
   * The parser configuration.
   */
  readonly config: TConfig;
}

/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 *
 * @returns The parser function.
 */
export function safeParser<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(schema: TSchema): SafeParser<TSchema, undefined>;

/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
export function safeParser<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TConfig extends Config<InferIssue<TSchema>> | undefined,
>(schema: TSchema, config: TConfig): SafeParser<TSchema, TConfig>;

// @__NO_SIDE_EFFECTS__
export function safeParser(
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  config?: Config<InferIssue<BaseSchema<unknown, unknown, BaseIssue<unknown>>>>
): SafeParser<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  Config<BaseIssue<unknown>> | undefined
> {
  const func: SafeParser<
    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    Config<BaseIssue<unknown>> | undefined
  > = (input: unknown) => safeParse(schema, input, config);
  // @ts-expect-error
  func.schema = schema;
  // @ts-expect-error
  func.config = config;
  return func;
}
