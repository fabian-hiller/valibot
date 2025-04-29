import type { TitleAction } from '../../actions/title/title.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  PipeItem,
  PipeItemAsync,
} from '../../types/index.ts';
import { _findLastMetadata } from '../../utils/_findLastMetadata/_findLastMetadata.ts';
import type { SchemaWithPipe, SchemaWithPipeAsync } from '../index.ts';

export type Schema =
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  | SchemaWithPipe<
      readonly [
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ...(
          | PipeItem<unknown, unknown, BaseIssue<unknown>>
          | TitleAction<unknown, string>
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
          | TitleAction<unknown, string>
        )[],
      ]
    >;

/**
 * Returns the title of the schema. If multiple titles are defined, the last one is returned. If no title is defined, `undefined` is returned.
 *
 * @param schema The schema to get the title from.
 *
 * @returns The title, or `undefined` if none.
 *
 * @beta
 */
// TODO: see if return type can be strongly typed (i.e. do same breadth-first search in types)
// @__NO_SIDE_EFFECTS__
export function getTitle(schema: Schema): string | undefined {
  return _findLastMetadata(schema, 'title');
}
