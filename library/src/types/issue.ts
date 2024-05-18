import type {
  ArrayPathItem,
  MapPathItem,
  RecordPathItem,
  SetPathItem,
} from '../schemas/index.ts';
import type { Config } from './config.ts';
import type { ObjectPathItem } from './object.ts';
import type { TuplePathItem } from './tuple.ts';

/**
 * Unknown path item type.
 */
export interface UnknownPathItem {
  /**
   * The path item type.
   */
  readonly type: 'unknown';
  /**
   * The path item origin.
   */
  readonly origin: 'key' | 'value';
  /**
   * The path item input.
   */
  readonly input: unknown;
  /**
   * The path item key.
   */
  readonly key: unknown;
  /**
   * The path item value.
   */
  readonly value: unknown;
}

/**
 * Issue path item type.
 *
 * TODO: Document that the input of the path may be different from the input of
 * the issue.
 */
export type IssuePathItem =
  | ArrayPathItem
  | MapPathItem
  | ObjectPathItem
  | RecordPathItem
  | SetPathItem
  | TuplePathItem
  | UnknownPathItem;

/**
 * Schema issue type.
 */
export interface BaseIssue<TInput> extends Config<BaseIssue<TInput>> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema' | 'validation' | 'transformation';
  /**
   * The issue type.
   */
  readonly type: string;
  /**
   * The raw input data.
   */
  readonly input: TInput;
  /**
   * The expected input.
   */
  readonly expected: string | null;
  /**
   * The received input.
   */
  readonly received: string;
  /**
   * The error message.
   */
  readonly message: string;
  /**
   * The input requirement.
   */
  readonly requirement?: unknown;
  /**
   * The issue path.
   */
  readonly path?: [IssuePathItem, ...IssuePathItem[]];
  /**
   * The sub issues.
   */
  readonly issues?: [BaseIssue<TInput>, ...BaseIssue<TInput>[]];
}

/**
 * Generic issue type.
 */
export interface GenericIssue<TInput = unknown> extends BaseIssue<TInput> {}
