import type { MetadataAction } from '../../../actions/metadata/metadata.ts';
import type { Overwrite, Prettify } from '../../../types/utils.ts';
import {
  _createMetadataMethod,
  type UnknownPipe,
  type UnknownSchemaWithPipe,
} from '../../../utils/_createMetadataMethod/_createMetadataMethod.ts';
import type { SchemaWithPipe } from '../../pipe/pipe.ts';
import type { SchemaWithPipeAsync } from '../../pipe/pipeAsync.ts';

export type ExtractMetadata<
  TPipe extends UnknownPipe,
  Acc extends Record<string, unknown> | undefined = undefined,
> = TPipe extends readonly [infer TFirst, ...infer TRest extends UnknownPipe]
  ? TFirst extends
      | SchemaWithPipe<infer TPipe2>
      | SchemaWithPipeAsync<infer TPipe2>
    ? ExtractMetadata<TRest, ExtractMetadata<TPipe2, Acc>>
    : TFirst extends MetadataAction<unknown, infer TMetadata>
      ? ExtractMetadata<
          TRest,
          undefined extends Acc ? TMetadata : Overwrite<Acc, TMetadata>
        >
      : ExtractMetadata<TRest, Acc>
  : Acc;

export type GetMetadata = <const TSchema extends UnknownSchemaWithPipe>(
  schema: TSchema
) => Prettify<ExtractMetadata<TSchema['pipe']>>;

export const getMetadata = _createMetadataMethod(
  (action): action is MetadataAction<unknown, Record<string, unknown>> =>
    action.type === 'metadata',
  (action, acc: Record<string, unknown> = {}) =>
    Object.assign(acc, action.metadata)
) as GetMetadata;
