import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferOutput,
  MaybeReadonly,
} from '../../types/index.ts';
import type { UnionIssue } from './types.ts';

/**
 * Union options async type.
 */
export type UnionOptionsAsync = MaybeReadonly<
  (
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
  )[]
>;

/**
 * Union schema async type.
 */
export interface UnionSchemaAsync<
  TOptions extends UnionOptionsAsync,
  TMessage extends
    | ErrorMessage<UnionIssue<InferIssue<TOptions[number]>>>
    | undefined,
> extends BaseSchemaAsync<
    InferInput<TOptions[number]>,
    InferOutput<TOptions[number]>,
    UnionIssue<InferIssue<TOptions[number]>> | InferIssue<TOptions[number]>
  > {
  /**
   * The schema type.
   */
  readonly type: 'union';
  // /**
  //  * The schema reference.
  //  */
  // readonly reference: typeof unionAsync;
  /**
   * The union options.
   */
  readonly options: TOptions;
  /**
   * The error message.
   */
  readonly message: TMessage;
}
