import type { DescriptionAction, TitleAction } from '../../actions/index.ts';
import type {
  SchemaWithPipe,
  SchemaWithPipeAsync,
} from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  PipeItem,
  PipeItemAsync,
} from '../../types/index.ts';

export type Schema =
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  | SchemaWithPipe<
      readonly [
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ...(
          | PipeItem<unknown, unknown, BaseIssue<unknown>>
          | TitleAction<unknown, string>
          | DescriptionAction<unknown, string>
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
          | DescriptionAction<unknown, string>
        )[],
      ]
    >;

/**
 * Retrieves the last instance of a given metadata type from a schema, using a reverse breadth-first search.
 *
 * @param schema The schema to search.
 * @param type The type of metadata to search for.
 *
 * @returns The value of the last instance of the given metadata type, or undefined if not found.
 */
// @__NO_SIDE_EFFECTS__
export function _findLastMetadata(
  schema: Schema,
  type: 'title' | 'description'
): string | undefined {
  if ('pipe' in schema) {
    const nestedSchemas: Schema[] = [];
    for (let idx = schema.pipe.length - 1; idx >= 0; idx--) {
      const item = schema.pipe[idx];
      if (item.kind === 'schema' && 'pipe' in item) {
        nestedSchemas.push(item);
      } else if (item.kind === 'metadata' && item.type === type) {
        // @ts-expect-error
        return item[type];
      }
    }
    for (const nestedSchema of nestedSchemas) {
      const result = _findLastMetadata(nestedSchema, type);
      if (result) {
        return result;
      }
    }
  }
}
