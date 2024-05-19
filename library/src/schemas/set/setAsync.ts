import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferIssue,
} from '../../types/index.ts';
import type { InferSetInput, InferSetOutput, SetIssue } from './types.ts';

/**
 * Set schema async type.
 */
export interface SetSchemaAsync<
  TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<SetIssue> | undefined,
> extends BaseSchemaAsync<
    InferSetInput<TValue>,
    InferSetOutput<TValue>,
    SetIssue | InferIssue<TValue>
  > {
  /**
   * The schema type.
   */
  readonly type: 'set';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof setAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Set';
  /**
   * The set value schema.
   */
  readonly value: TValue;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
