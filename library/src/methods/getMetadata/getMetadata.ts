import type { MetadataAction } from '../../actions/metadata/metadata.ts';
import type { BaseIssue } from '../../types/issue.ts';
import type { PipeItem, PipeItemAsync } from '../../types/pipe.ts';
import type { BaseSchema, BaseSchemaAsync } from '../../types/schema.ts';
import type { Overwrite, Prettify } from '../../types/utils.ts';
import type { SchemaWithPipe } from '../pipe/pipe.ts';
import type { SchemaWithPipeAsync } from '../pipe/pipeAsync.ts';

type Schema =
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  | SchemaWithPipe<
      readonly [
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ...(
          | PipeItem<unknown, unknown, BaseIssue<unknown>>
          | MetadataAction<unknown, Record<string, unknown>>
        )[],
      ]
    >
  | SchemaWithPipeAsync<
      readonly [
        (
          | BaseSchema<unknown, unknown, BaseIssue<unknown>>
          | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
        ),
        ...(
          | PipeItem<unknown, unknown, BaseIssue<unknown>>
          | PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
          | MetadataAction<unknown, Record<string, unknown>>
        )[],
      ]
    >;

type Pipe = readonly (
  | Schema
  | PipeItem<unknown, unknown, BaseIssue<unknown>>
  | PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
  | MetadataAction<unknown, Record<string, unknown>>
)[];

export type ExtractMetadata<
  TPipe extends Pipe,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Acc extends Record<string, unknown> = {},
> = TPipe extends readonly [infer TFirst, ...infer TRest extends Pipe]
  ? TFirst extends
      | SchemaWithPipe<infer TPipe2>
      | SchemaWithPipeAsync<infer TPipe2>
    ? ExtractMetadata<TRest, ExtractMetadata<TPipe2, Acc>>
    : TFirst extends MetadataAction<unknown, infer TMetadata>
      ? ExtractMetadata<TRest, Overwrite<Acc, TMetadata>>
      : ExtractMetadata<TRest, Acc>
  : Acc;

export type ExtractMetadataFromSchema<TSchema extends Schema> =
  TSchema extends { pipe: Pipe }
    ? ExtractMetadata<TSchema['pipe']>
    : Record<string, unknown>;

/**
 * Extracts (depth first) metadata from a schema and shallowly merges, including nested metadata.
 *
 * @param schema Schema to extract metadata from.
 *
 * @returns Shallowly merged metadata.
 */
// @__NO_SIDE_EFFECTS__
export function getMetadata<const TSchema extends Schema>(
  schema: TSchema
): Prettify<ExtractMetadataFromSchema<TSchema>> {
  const result: Record<string, unknown> = {};
  function depthFirstMerge(pipe: Pipe) {
    for (const item of pipe) {
      if ('pipe' in item) {
        depthFirstMerge(item.pipe);
      } else if ('metadata' in item) {
        Object.assign(result, item.metadata);
      }
    }
  }
  if ('pipe' in schema) {
    depthFirstMerge(schema.pipe);
  }
  // @ts-expect-error
  return result;
}
