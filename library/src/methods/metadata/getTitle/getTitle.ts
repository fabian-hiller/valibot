import type { TitleAction } from '../../../actions/title/title.ts';
import {
  _createMetadataMethod,
  type UnknownPipe,
  type UnknownSchemaWithPipe,
} from '../../../utils/_createMetadataMethod/_createMetadataMethod.ts';
import type { SchemaWithPipe } from '../../pipe/pipe.ts';
import type { SchemaWithPipeAsync } from '../../pipe/pipeAsync.ts';

export type ExtractTitle<
  TPipe extends UnknownPipe,
  Acc extends string | undefined = undefined,
> = TPipe extends readonly [infer TFirst, ...infer TRest extends UnknownPipe]
  ? TFirst extends
      | SchemaWithPipe<infer TPipe2>
      | SchemaWithPipeAsync<infer TPipe2>
    ? ExtractTitle<TRest, ExtractTitle<TPipe2, Acc>>
    : TFirst extends TitleAction<unknown, infer TTitle>
      ? ExtractTitle<TRest, TTitle>
      : ExtractTitle<TRest, Acc>
  : Acc;

export type GetTitle = <const TSchema extends UnknownSchemaWithPipe>(
  schema: TSchema
) => ExtractTitle<TSchema['pipe']>;

export const getTitle = _createMetadataMethod(
  (action): action is TitleAction<unknown, string> => action.type === 'title',
  (action) => action.title
) as GetTitle;
