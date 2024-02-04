import type {
  ArrayPathItem,
  MapPathItem,
  ObjectPathItem,
  RecordPathItem,
  SetPathItem,
  TuplePathItem,
} from '../schemas/index.ts';
import type { SchemaConfig } from './config.ts';
import type { PipeActionContext } from './pipe.ts';

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
 * Unknown path item type.
 */
export type UnknownPathItem = {
  type: 'unknown';
  origin: 'key' | 'value';
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
 * Schema issue type.
 */
export type SchemaIssue = Omit<SchemaConfig, 'message'> & {
  /**
   * The issue reason.
   */
  reason: IssueReason;
  /**
   * The context name.
   */
  context: string;
  /**
   * The raw input data.
   */
  input: unknown;
  /**
   * The expected input.
   */
  expected: string | null;
  /**
   * The received input.
   */
  received: string;
  /**
   * The error message.
   */
  message: string;
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
  issues?: SchemaIssues;
};

/**
 * Schema issues type.
 */
export type SchemaIssues = [SchemaIssue, ...SchemaIssue[]];

/**
 * Pipe action issue type.
 */
export type PipeActionIssue = {
  context: PipeActionContext;
  // eslint-disable-next-line @typescript-eslint/ban-types
  reference: Function;
  input: unknown;
  label: string;
  received?: string;
  path?: PathItem[];
};
