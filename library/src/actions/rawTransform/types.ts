import type {
  BaseIssue,
  Config,
  ErrorMessage,
  IssuePathItem,
  TypedDataset,
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
  label?: string;
  input?: unknown;
  expected?: string;
  received?: string;
  message?: ErrorMessage<RawTransformIssue<TInput>>;
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
  readonly dataset: TypedDataset<TInput, never>;
  readonly config: Config<RawTransformIssue<TInput>>;
  readonly addIssue: AddIssue<TInput>;
  readonly NEVER: never;
}
