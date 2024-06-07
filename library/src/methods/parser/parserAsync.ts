import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { parseAsync } from '../parse/index.ts';

/**
 * The parser async type.
 */
export interface ParserAsync<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TConfig extends Omit<Config<InferIssue<TSchema>>, 'skipPipe'> | undefined,
> {
  /**
   * Parses an unknown input based on the schema.
   */
  (input: unknown): Promise<InferOutput<TSchema>>;
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
export function parserAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(schema: TSchema): ParserAsync<TSchema, undefined>;

/**
 * Returns a function that parses an unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param config The parser configuration.
 *
 * @returns The parser function.
 */
export function parserAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TConfig extends
    | Omit<Config<InferIssue<TSchema>>, 'skipPipe'>
    | undefined,
>(schema: TSchema, config: TConfig): ParserAsync<TSchema, TConfig>;

export function parserAsync(
  schema:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  config?: Omit<
    Config<
      InferIssue<
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
      >
    >,
    'skipPipe'
  >
): ParserAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  Omit<Config<BaseIssue<unknown>>, 'skipPipe'> | undefined
> {
  const func: ParserAsync<
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
    Omit<Config<BaseIssue<unknown>>, 'skipPipe'> | undefined
  > = (input: unknown) => parseAsync(schema, input, config);
  // @ts-expect-error
  func.schema = schema;
  // @ts-expect-error
  func.config = config;
  return func;
}
