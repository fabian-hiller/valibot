import type {
  BaseIssue,
  Config,
  ErrorMessage,
  IssuePathItem,
  SuccessDataset,
} from '../../types/index.ts';

/**
 * Raw transform issue type.
 */
export interface RawTransformIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'transformation';
  /**
   * The issue type.
   */
  readonly type: 'raw_transform';
}

/**
 * Issue info type.
 */
interface IssueInfo<TInput> {
  label?: string | undefined;
  input?: unknown | undefined;
  expected?: string | undefined;
  received?: string | undefined;
  message?: ErrorMessage<RawTransformIssue<TInput>> | undefined;
  path?: [IssuePathItem, ...IssuePathItem[]] | undefined;
}

/**
 * Add issue type.
 */
type AddIssue<TInput> = (info?: IssueInfo<TInput>) => void;

/**
 * Context type.
 */
export interface Context<TInput> {
  readonly dataset: SuccessDataset<TInput>;
  readonly config: Config<RawTransformIssue<TInput>>;
  readonly addIssue: AddIssue<TInput>;
  readonly NEVER: never;
}
