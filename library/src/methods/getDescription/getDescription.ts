import type { DescriptionAction } from '../../actions/description/description.ts';
import {
  _createMetadataMethod,
  type UnknownPipe,
  type UnknownSchemaWithPipe,
} from '../../utils/_createMetadataMethod/_createMetadataMethod.ts';
import type { SchemaWithPipe } from '../pipe/pipe.ts';
import type { SchemaWithPipeAsync } from '../pipe/pipeAsync.ts';

export type ExtractDescription<
  TPipe extends UnknownPipe,
  Acc extends string | undefined = undefined,
> = TPipe extends readonly [infer TFirst, ...infer TRest extends UnknownPipe]
  ? TFirst extends
      | SchemaWithPipe<infer TPipe2>
      | SchemaWithPipeAsync<infer TPipe2>
    ? ExtractDescription<TRest, ExtractDescription<TPipe2, Acc>>
    : TFirst extends DescriptionAction<unknown, infer TDescription>
      ? ExtractDescription<TRest, TDescription>
      : ExtractDescription<TRest, Acc>
  : Acc;

export type GetDescription = <const TSchema extends UnknownSchemaWithPipe>(
  schema: TSchema
) => ExtractDescription<TSchema['pipe']>;

export const getDescription = _createMetadataMethod(
  (action): action is DescriptionAction<unknown, string> =>
    action.type === 'description',
  (action) => action.description
) as GetDescription;
