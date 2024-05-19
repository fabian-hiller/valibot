import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferIssue,
} from '../../types/index.ts';
import type { InferMapInput, InferMapOutput, MapIssue } from './types.ts';

/**
 * Map schema async type.
 */
export interface MapSchemaAsync<
  TKey extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<MapIssue> | undefined,
> extends BaseSchemaAsync<
    InferMapInput<TKey, TValue>,
    InferMapOutput<TKey, TValue>,
    MapIssue | InferIssue<TKey> | InferIssue<TValue>
  > {
  /**
   * The schema type.
   */
  readonly type: 'map';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof mapAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Map';
  /**
   * The map key schema.
   */
  readonly key: TKey;
  /**
   * The map value schema.
   */
  readonly value: TValue;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
