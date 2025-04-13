import type { SchemaWithPipe } from '../../methods/pipe/pipe.ts';
import type { SchemaWithPipeAsync } from '../../methods/pipe/pipeAsync.ts';
import type {
  BaseIssue,
  BaseMetadata,
  BaseSchema,
  BaseSchemaAsync,
  PipeItem,
  PipeItemAsync,
} from '../../types/index.ts';

export type UnknownSchemaWithPipe =
  | SchemaWithPipe<
      readonly [
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...PipeItem<any, unknown, BaseIssue<unknown>>[],
      ]
    >
  | SchemaWithPipeAsync<
      readonly [
        (
          | BaseSchema<unknown, unknown, BaseIssue<unknown>>
          | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
        ),
        ...// eslint-disable-next-line @typescript-eslint/no-explicit-any
        (
          | PipeItem<any, unknown, BaseIssue<unknown>>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          | PipeItemAsync<any, unknown, BaseIssue<unknown>>
        )[],
      ]
    >;

export type UnknownPipe = readonly (
  | PipeItem<unknown, unknown, BaseIssue<unknown>>
  | PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
)[];

/**
 * Creates a method for extracting a given metadata from a schema pipe.
 *
 * @param isAction Predicate for actions to process.
 * @param reduceMetadata Reduce action and current metadata into new metadata.
 *
 * @returns A method for extracting a given metadata from a schema pipe.
 *
 * @internal
 */
// @__NO_SIDE_EFFECTS__
export function _createMetadataMethod<
  TAction extends BaseMetadata<unknown>,
  TOutput,
>(
  isAction: (action: BaseMetadata<unknown>) => action is TAction,
  reduceMetadata: (action: TAction, acc: TOutput | undefined) => TOutput
) {
  return function getMetadata(
    schema: UnknownSchemaWithPipe,
    _acc?: TOutput
  ): TOutput | undefined {
    return schema.pipe.reduce((acc, item) => {
      if (item.kind === 'metadata' && isAction(item)) {
        return reduceMetadata(item, acc);
      } else if ('pipe' in item) {
        return getMetadata(item as never, acc);
      }
      return acc;
    }, _acc);
  };
}
