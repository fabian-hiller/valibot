import type {
  DescriptionAction,
  MetadataAction,
  TitleAction,
} from '../../actions/index.ts';
import type {
  BaseIssue,
  BaseMetadata,
  BaseSchema,
  BaseSchemaAsync,
  PipeItem,
  PipeItemAsync,
  Prettify,
} from '../../types/index.ts';
import type { SchemaWithPipe } from '../pipe/pipe.ts';
import type { SchemaWithPipeAsync } from '../pipe/pipeAsync.ts';

type Overwrite<T, U> = Omit<T, keyof U> & U;

type KnownMetadataActions =
  | TitleAction<unknown, string>
  | DescriptionAction<unknown, string>
  | MetadataAction<unknown, Record<string, unknown>>;

type ExtractedMetadata<TMetadata extends KnownMetadataActions> =
  TMetadata extends TitleAction<unknown, infer TTitle>
    ? { readonly title: TTitle }
    : TMetadata extends DescriptionAction<unknown, infer TDescription>
      ? { readonly description: TDescription }
      : TMetadata extends MetadataAction<unknown, infer TMetadata>
        ? TMetadata
        : never;

type PipelineMetadata<
  TPipe extends
    readonly // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (| PipeItem<any, any, BaseIssue<unknown>>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | PipeItemAsync<any, any, BaseIssue<unknown>>
    )[],
  TAcc extends object = object,
> = TPipe extends readonly [
  infer TItem,
  ...infer TRest extends
    readonly // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (| PipeItem<any, any, BaseIssue<unknown>>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | PipeItemAsync<any, any, BaseIssue<unknown>>
    )[],
]
  ? TItem extends KnownMetadataActions
    ? PipelineMetadata<TRest, Overwrite<TAcc, ExtractedMetadata<TItem>>>
    : TItem extends
          | SchemaWithPipe<infer TInnerPipe>
          | SchemaWithPipeAsync<infer TInnerPipe>
      ? PipelineMetadata<TRest, Overwrite<TAcc, PipelineMetadata<TInnerPipe>>>
      : PipelineMetadata<TRest, TAcc>
  : TAcc;

const extractMetadata: Partial<
  Record<string, (action: BaseMetadata<unknown>) => Record<string, unknown>>
> = {
  title: ({ title }) => ({ title }),
  description: ({ description }) => ({ description }),
  metadata: ({ metadata }) => metadata,
} satisfies {
  [TAction in KnownMetadataActions as TAction['type']]: (
    action: TAction
  ) => ExtractedMetadata<TAction>;
} as never;

/**
 * Extracts the metadata from a schema.
 *
 * @param schema The schema to extract the metadata from.
 *
 * @returns The extracted metadata.
 */
export function getMetadata<
  TSchema extends
    | SchemaWithPipe<
        readonly [
          BaseSchema<unknown, unknown, BaseIssue<unknown>>,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(readonly PipeItem<any, any, BaseIssue<unknown>>[]),
        ]
      >
    | SchemaWithPipeAsync<
        readonly [
          (
            | BaseSchema<unknown, unknown, BaseIssue<unknown>>
            | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
          ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(readonly PipeItem<any, any, BaseIssue<unknown>>[]),
        ]
      >,
>(schema: TSchema): Prettify<PipelineMetadata<TSchema['pipe']>> {
  return schema.pipe.reduce(
    (acc, item) => {
      switch (item.kind) {
        case 'metadata': {
          const extractor = extractMetadata[item.type];
          if (extractor) {
            return Object.assign(acc, extractor(item));
          } else {
            console.warn('Unknown metadata action', item);
          }
          break;
        }
        case 'schema': {
          if ('pipe' in item) {
            return Object.assign(acc, getMetadata(item as never));
          }
          break;
        }
      }

      return acc;
    },
    {} as PipelineMetadata<TSchema['pipe']>
  );
}
