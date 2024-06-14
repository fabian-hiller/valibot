import type {
  BaseIssue,
  Config,
  Dataset,
  ErrorMessage,
  IssuePathItem,
} from '../../types/index.ts';

/**
 * Raw check issue type.
 */
export interface RawCheckIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'raw_check';
}

/**
 * Issue info type.
 */
interface IssueInfo<TInput> {
  label?: string;
  input?: unknown;
  expected?: string;
  received?: string;
  message?: ErrorMessage<RawCheckIssue<TInput>>;
  path?: [IssuePathItem, ...IssuePathItem[]];
}

/**
 * Add issue type.
 */
type AddIssue<TInput> = (info?: IssueInfo<TInput>) => void;

/**
 * Context type.
 */
export interface Context<TInput> {
  readonly dataset: Dataset<TInput, BaseIssue<unknown>>;
  readonly config: Config<RawCheckIssue<TInput>>;
  readonly addIssue: AddIssue<TInput>;
}
