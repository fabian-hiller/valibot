import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  Dataset,
  FirstTupleItem,
  InferInput,
  InferIssue,
  InferOutput,
  LastTupleItem,
  PipeAction,
  PipeActionAsync,
  PipeItem,
  PipeItemAsync,
} from '../../types/index.ts';
import type { ExtraProperties } from '../../types/metadata.ts';

/**
 * Schema with pipe async type.
 */
export type SchemaWithPipeAsync<
  TPipe extends [
    (
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    ),
    ...(
      | PipeItem<unknown, unknown, BaseIssue<unknown>>
      | PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
    )[],
  ],
> = Omit<FirstTupleItem<TPipe>, 'async' | '_run' | '_types'> & {
  /**
   * The pipe items.
   */
  readonly pipe: TPipe;
  /**
   * Whether it's async.
   */
  readonly async: true;
  /**
   * Parses unknown input.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  _run(
    dataset: Dataset<unknown, never>,
    config: Config<InferIssue<FirstTupleItem<TPipe>>>
  ): Promise<
    Dataset<InferOutput<LastTupleItem<TPipe>>, InferIssue<TPipe[number]>>
  >;
  /**
   * Input, output and issue type.
   *
   * @internal
   */
  readonly _types?: {
    readonly input: InferInput<FirstTupleItem<TPipe>>;
    readonly output: InferOutput<LastTupleItem<TPipe>>;
    readonly issue: InferIssue<TPipe[number]>;
  };
} & ExtraProperties<TPipe>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >
): SchemaWithPipeAsync<[TSchema, TItem1]>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
  const TItem2 extends
    | PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >,
  item2:
    | TItem2
    | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>
    | PipeActionAsync<
        InferOutput<TItem1>,
        InferOutput<TItem2>,
        InferIssue<TItem2>
      >
): SchemaWithPipeAsync<[TSchema, TItem1, TItem2]>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
  const TItem2 extends
    | PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>,
  const TItem3 extends
    | PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >,
  item2:
    | TItem2
    | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>
    | PipeActionAsync<
        InferOutput<TItem1>,
        InferOutput<TItem2>,
        InferIssue<TItem2>
      >,
  item3:
    | TItem3
    | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>
    | PipeActionAsync<
        InferOutput<TItem2>,
        InferOutput<TItem3>,
        InferIssue<TItem3>
      >
): SchemaWithPipeAsync<[TSchema, TItem1, TItem2, TItem3]>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
  const TItem2 extends
    | PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>,
  const TItem3 extends
    | PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>,
  const TItem4 extends
    | PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >,
  item2:
    | TItem2
    | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>
    | PipeActionAsync<
        InferOutput<TItem1>,
        InferOutput<TItem2>,
        InferIssue<TItem2>
      >,
  item3:
    | TItem3
    | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>
    | PipeActionAsync<
        InferOutput<TItem2>,
        InferOutput<TItem3>,
        InferIssue<TItem3>
      >,
  item4:
    | TItem4
    | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>
    | PipeActionAsync<
        InferOutput<TItem3>,
        InferOutput<TItem4>,
        InferIssue<TItem4>
      >
): SchemaWithPipeAsync<[TSchema, TItem1, TItem2, TItem3, TItem4]>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
  const TItem2 extends
    | PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>,
  const TItem3 extends
    | PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>,
  const TItem4 extends
    | PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>,
  const TItem5 extends
    | PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >,
  item2:
    | TItem2
    | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>
    | PipeActionAsync<
        InferOutput<TItem1>,
        InferOutput<TItem2>,
        InferIssue<TItem2>
      >,
  item3:
    | TItem3
    | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>
    | PipeActionAsync<
        InferOutput<TItem2>,
        InferOutput<TItem3>,
        InferIssue<TItem3>
      >,
  item4:
    | TItem4
    | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>
    | PipeActionAsync<
        InferOutput<TItem3>,
        InferOutput<TItem4>,
        InferIssue<TItem4>
      >,
  item5:
    | TItem5
    | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>
    | PipeActionAsync<
        InferOutput<TItem4>,
        InferOutput<TItem5>,
        InferIssue<TItem5>
      >
): SchemaWithPipeAsync<[TSchema, TItem1, TItem2, TItem3, TItem4, TItem5]>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
  const TItem2 extends
    | PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>,
  const TItem3 extends
    | PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>,
  const TItem4 extends
    | PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>,
  const TItem5 extends
    | PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>,
  const TItem6 extends
    | PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >,
  item2:
    | TItem2
    | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>
    | PipeActionAsync<
        InferOutput<TItem1>,
        InferOutput<TItem2>,
        InferIssue<TItem2>
      >,
  item3:
    | TItem3
    | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>
    | PipeActionAsync<
        InferOutput<TItem2>,
        InferOutput<TItem3>,
        InferIssue<TItem3>
      >,
  item4:
    | TItem4
    | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>
    | PipeActionAsync<
        InferOutput<TItem3>,
        InferOutput<TItem4>,
        InferIssue<TItem4>
      >,
  item5:
    | TItem5
    | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>
    | PipeActionAsync<
        InferOutput<TItem4>,
        InferOutput<TItem5>,
        InferIssue<TItem5>
      >,
  item6:
    | TItem6
    | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>
    | PipeActionAsync<
        InferOutput<TItem5>,
        InferOutput<TItem6>,
        InferIssue<TItem6>
      >
): SchemaWithPipeAsync<
  [TSchema, TItem1, TItem2, TItem3, TItem4, TItem5, TItem6]
>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
  const TItem2 extends
    | PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>,
  const TItem3 extends
    | PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>,
  const TItem4 extends
    | PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>,
  const TItem5 extends
    | PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>,
  const TItem6 extends
    | PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>,
  const TItem7 extends
    | PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >,
  item2:
    | TItem2
    | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>
    | PipeActionAsync<
        InferOutput<TItem1>,
        InferOutput<TItem2>,
        InferIssue<TItem2>
      >,
  item3:
    | TItem3
    | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>
    | PipeActionAsync<
        InferOutput<TItem2>,
        InferOutput<TItem3>,
        InferIssue<TItem3>
      >,
  item4:
    | TItem4
    | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>
    | PipeActionAsync<
        InferOutput<TItem3>,
        InferOutput<TItem4>,
        InferIssue<TItem4>
      >,
  item5:
    | TItem5
    | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>
    | PipeActionAsync<
        InferOutput<TItem4>,
        InferOutput<TItem5>,
        InferIssue<TItem5>
      >,
  item6:
    | TItem6
    | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>
    | PipeActionAsync<
        InferOutput<TItem5>,
        InferOutput<TItem6>,
        InferIssue<TItem6>
      >,
  item7:
    | TItem7
    | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>
    | PipeActionAsync<
        InferOutput<TItem6>,
        InferOutput<TItem7>,
        InferIssue<TItem7>
      >
): SchemaWithPipeAsync<
  [TSchema, TItem1, TItem2, TItem3, TItem4, TItem5, TItem6, TItem7]
>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
  const TItem2 extends
    | PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>,
  const TItem3 extends
    | PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>,
  const TItem4 extends
    | PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>,
  const TItem5 extends
    | PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>,
  const TItem6 extends
    | PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>,
  const TItem7 extends
    | PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>,
  const TItem8 extends
    | PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >,
  item2:
    | TItem2
    | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>
    | PipeActionAsync<
        InferOutput<TItem1>,
        InferOutput<TItem2>,
        InferIssue<TItem2>
      >,
  item3:
    | TItem3
    | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>
    | PipeActionAsync<
        InferOutput<TItem2>,
        InferOutput<TItem3>,
        InferIssue<TItem3>
      >,
  item4:
    | TItem4
    | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>
    | PipeActionAsync<
        InferOutput<TItem3>,
        InferOutput<TItem4>,
        InferIssue<TItem4>
      >,
  item5:
    | TItem5
    | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>
    | PipeActionAsync<
        InferOutput<TItem4>,
        InferOutput<TItem5>,
        InferIssue<TItem5>
      >,
  item6:
    | TItem6
    | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>
    | PipeActionAsync<
        InferOutput<TItem5>,
        InferOutput<TItem6>,
        InferIssue<TItem6>
      >,
  item7:
    | TItem7
    | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>
    | PipeActionAsync<
        InferOutput<TItem6>,
        InferOutput<TItem7>,
        InferIssue<TItem7>
      >,
  item8:
    | TItem8
    | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>
    | PipeActionAsync<
        InferOutput<TItem7>,
        InferOutput<TItem8>,
        InferIssue<TItem8>
      >
): SchemaWithPipeAsync<
  [TSchema, TItem1, TItem2, TItem3, TItem4, TItem5, TItem6, TItem7, TItem8]
>;

/**
 * Adds a pipeline to a schema, that can validate and transform its input.
 *
 * @param schema The root schema.
 * @param item1 The first pipe item.
 * @param item2 The second pipe item.
 * @param item3 The third pipe item.
 * @param item4 The fourth pipe item.
 * @param item5 The fifth pipe item.
 * @param item6 The sixth pipe item.
 * @param item7 The seventh pipe item.
 * @param item8 The eighth pipe item.
 * @param item9 The ninth pipe item.
 *
 * @returns A schema with a pipeline.
 */
export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItem1 extends
    | PipeItem<InferOutput<TSchema>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TSchema>, unknown, BaseIssue<unknown>>,
  const TItem2 extends
    | PipeItem<InferOutput<TItem1>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem1>, unknown, BaseIssue<unknown>>,
  const TItem3 extends
    | PipeItem<InferOutput<TItem2>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem2>, unknown, BaseIssue<unknown>>,
  const TItem4 extends
    | PipeItem<InferOutput<TItem3>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem3>, unknown, BaseIssue<unknown>>,
  const TItem5 extends
    | PipeItem<InferOutput<TItem4>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem4>, unknown, BaseIssue<unknown>>,
  const TItem6 extends
    | PipeItem<InferOutput<TItem5>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem5>, unknown, BaseIssue<unknown>>,
  const TItem7 extends
    | PipeItem<InferOutput<TItem6>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem6>, unknown, BaseIssue<unknown>>,
  const TItem8 extends
    | PipeItem<InferOutput<TItem7>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem7>, unknown, BaseIssue<unknown>>,
  const TItem9 extends
    | PipeItem<InferOutput<TItem8>, unknown, BaseIssue<unknown>>
    | PipeItemAsync<InferOutput<TItem8>, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  item1:
    | TItem1
    | PipeAction<InferOutput<TSchema>, InferOutput<TItem1>, InferIssue<TItem1>>
    | PipeActionAsync<
        InferOutput<TSchema>,
        InferOutput<TItem1>,
        InferIssue<TItem1>
      >,
  item2:
    | TItem2
    | PipeAction<InferOutput<TItem1>, InferOutput<TItem2>, InferIssue<TItem2>>
    | PipeActionAsync<
        InferOutput<TItem1>,
        InferOutput<TItem2>,
        InferIssue<TItem2>
      >,
  item3:
    | TItem3
    | PipeAction<InferOutput<TItem2>, InferOutput<TItem3>, InferIssue<TItem3>>
    | PipeActionAsync<
        InferOutput<TItem2>,
        InferOutput<TItem3>,
        InferIssue<TItem3>
      >,
  item4:
    | TItem4
    | PipeAction<InferOutput<TItem3>, InferOutput<TItem4>, InferIssue<TItem4>>
    | PipeActionAsync<
        InferOutput<TItem3>,
        InferOutput<TItem4>,
        InferIssue<TItem4>
      >,
  item5:
    | TItem5
    | PipeAction<InferOutput<TItem4>, InferOutput<TItem5>, InferIssue<TItem5>>
    | PipeActionAsync<
        InferOutput<TItem4>,
        InferOutput<TItem5>,
        InferIssue<TItem5>
      >,
  item6:
    | TItem6
    | PipeAction<InferOutput<TItem5>, InferOutput<TItem6>, InferIssue<TItem6>>
    | PipeActionAsync<
        InferOutput<TItem5>,
        InferOutput<TItem6>,
        InferIssue<TItem6>
      >,
  item7:
    | TItem7
    | PipeAction<InferOutput<TItem6>, InferOutput<TItem7>, InferIssue<TItem7>>
    | PipeActionAsync<
        InferOutput<TItem6>,
        InferOutput<TItem7>,
        InferIssue<TItem7>
      >,
  item8:
    | TItem8
    | PipeAction<InferOutput<TItem7>, InferOutput<TItem8>, InferIssue<TItem8>>
    | PipeActionAsync<
        InferOutput<TItem7>,
        InferOutput<TItem8>,
        InferIssue<TItem8>
      >,
  item9:
    | TItem9
    | PipeAction<InferOutput<TItem8>, InferOutput<TItem9>, InferIssue<TItem9>>
    | PipeActionAsync<
        InferOutput<TItem8>,
        InferOutput<TItem9>,
        InferIssue<TItem9>
      >
): SchemaWithPipeAsync<
  [
    TSchema,
    TItem1,
    TItem2,
    TItem3,
    TItem4,
    TItem5,
    TItem6,
    TItem7,
    TItem8,
    TItem9,
  ]
>;

export function pipeAsync<
  const TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TItems extends (
    | PipeItem<unknown, unknown, BaseIssue<unknown>>
    | PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
  )[],
>(...pipe: [TSchema, ...TItems]): SchemaWithPipeAsync<[TSchema, ...TItems]> {
  const extraProperties = pipe.reduce(
    (props, it) => {
      if ('extraProperties' in it) Object.assign(props, it.extraProperties);
      return props;
    },
    {} as ExtraProperties<[TSchema, ...TItems]>
  );
  return {
    ...pipe[0],
    ...extraProperties,
    pipe,
    async: true,
    async _run(dataset, config) {
      // Run actions of pipeline
      for (let index = 0; index < pipe.length; index++) {
        if (pipe[index].kind === 'metadata') continue;
        // Mark dataset as untyped and break pipe if there are issues and pipe
        // item is schema or transformation
        if (
          dataset.issues &&
          (pipe[index].kind === 'schema' ||
            pipe[index].kind === 'transformation')
        ) {
          // TODO: This behavior must be documented!
          dataset.typed = false;
          break;
        }

        // Continue pipe execution if there is no reason to abort early
        if (!dataset.issues || (!config.abortEarly && !config.abortPipeEarly)) {
          // @ts-expect-error
          dataset = await pipe[index]._run(dataset, config);
        }
      }

      // Return output dataset
      return dataset;
    },
  };
}
