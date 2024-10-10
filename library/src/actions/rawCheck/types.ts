import type {
  BaseIssue,
  Config,
  ErrorMessage,
  IssuePathItem,
  OutputDataset,
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
  label?: string | undefined;
  input?: unknown | undefined;
  expected?: string | undefined;
  received?: string | undefined;
  message?: ErrorMessage<RawCheckIssue<TInput>> | undefined;
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
  readonly dataset: OutputDataset<TInput, BaseIssue<unknown>>;
  readonly config: Config<RawCheckIssue<TInput>>;
  readonly addIssue: AddIssue<TInput>;
}
