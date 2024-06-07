import type {
  BaseIssue,
  BaseSchema,
  Config,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { parse } from '../parse/index.ts';

/**
 * The parser type.
 */
export interface Parser<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TConfig extends Omit<Config<InferIssue<TSchema>>, 'skipPipe'> | undefined,
> {
  /**
   * Parses an unknown input based on the schema.
   */
  (input: unknown): InferOutput<TSchema>;
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
export function parser<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(schema: TSchema): Parser<TSchema, undefined>;

/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
export function parser<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TConfig extends
    | Omit<Config<InferIssue<TSchema>>, 'skipPipe'>
    | undefined,
>(schema: TSchema, config: TConfig): Parser<TSchema, TConfig>;

export function parser(
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  config?: Omit<
    Config<InferIssue<BaseSchema<unknown, unknown, BaseIssue<unknown>>>>,
    'skipPipe'
  >
): Parser<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  Omit<Config<BaseIssue<unknown>>, 'skipPipe'> | undefined
> {
  const func: Parser<
    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    Omit<Config<BaseIssue<unknown>>, 'skipPipe'> | undefined
  > = (input: unknown) => parse(schema, input, config);
  // @ts-ignore
  func.schema = schema;
  // @ts-ignore
  func.config = config;
  return func;
}
