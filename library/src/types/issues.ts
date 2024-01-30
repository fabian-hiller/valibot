import type {
  ArrayPathItem,
  MapPathItem,
  ObjectPathItem,
  RecordPathItem,
  SetPathItem,
  TuplePathItem,
} from '../schemas/index.ts';

/**
 * Issue reason type.
 */
export type IssueReason =
  | 'any'
  | 'array'
  | 'bigint'
  | 'blob'
  | 'boolean'
  | 'date'
  | 'intersect'
  | 'function'
  | 'instance'
  | 'map'
  | 'number'
  | 'object'
  | 'record'
  | 'set'
  | 'special'
  | 'string'
  | 'symbol'
  | 'tuple'
  | 'undefined'
  | 'union'
  | 'unknown'
  | 'variant'
  | 'type';

/**
 * Issue origin type.
 */
export type IssueOrigin = 'key' | 'value';

/**
 * Unknown path item type.
 */
export type UnknownPathItem = {
  type: 'unknown';
  input: unknown;
  key: unknown;
  value: unknown;
};

/**
 * Path item type.
 */
export type PathItem =
  | ArrayPathItem
  | MapPathItem
  | ObjectPathItem
  | RecordPathItem
  | SetPathItem
  | TuplePathItem
  | UnknownPathItem;

/**
 * Issue type.
 */
export type Issue = {
  /**
   * The issue reason.
   */
  reason: IssueReason;
  /**
   * The validation name.
   */
  validation: string;
  /**
   * The issue origin.
   */
  origin: IssueOrigin;
  /**
   * The error message.
   */
  message: string;
  /**
   * The input data.
   */
  input: unknown;
  /**
   * The validation requirement
   */
  requirement?: unknown;
  /**
   * The issue path.
   */
  path?: PathItem[];
  /**
   * The sub issues.
   */
  issues?: Issues;
  /**
   * Whether it was abort early.
   */
  abortEarly?: boolean;
  /**
   * Whether the pipe was abort early.
   */
  abortPipeEarly?: boolean;
  /**
   * Whether the pipe was skipped.
   */
  skipPipe?: boolean;
};

/**
 * Issues type.
 */
export type Issues = [Issue, ...Issue[]];
