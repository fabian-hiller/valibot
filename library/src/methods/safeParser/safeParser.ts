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
  TConfig extends Omit<Config<InferIssue<TSchema>>, 'skipPipe'> | undefined,
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
  const TConfig extends
    | Omit<Config<InferIssue<TSchema>>, 'skipPipe'>
    | undefined,
>(schema: TSchema, config: TConfig): SafeParser<TSchema, TConfig>;

export function safeParser(
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  config?: Omit<
    Config<InferIssue<BaseSchema<unknown, unknown, BaseIssue<unknown>>>>,
    'skipPipe'
  >
): SafeParser<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  | Omit<
      Config<InferIssue<BaseSchema<unknown, unknown, BaseIssue<unknown>>>>,
      'skipPipe'
    >
  | undefined
> {
  const func: SafeParser<
    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    | Omit<
        Config<InferIssue<BaseSchema<unknown, unknown, BaseIssue<unknown>>>>,
        'skipPipe'
      >
    | undefined
  > = (input: unknown) => safeParse(schema, input, config);
  // @ts-ignore
  func.schema = schema;
  // @ts-ignore
  func.config = config;
  return func;
}
