/**
 * Issue reason type.
 */
export type IssueReason =
  | 'type'
  | 'string'
  | 'number'
  | 'bigint'
  | 'blob'
  | 'boolean'
  | 'any'
  | 'unknown'
  | 'date'
  | 'array'
  | 'tuple'
  | 'map'
  | 'object'
  | 'record'
  | 'set'
  | 'special'
  | 'instance';

/**
 * Issue origin type.
 */
export type IssueOrigin = 'key' | 'value';

/**
 * Issue type.
 */
export type LeafIssue = {
  type: 'leaf';
  reason: IssueReason;
  validation: string;
  message: string;
  input: any;
};

export type NestedIssue = {
  type: 'nested';
  path: string;
  origin: IssueOrigin;
  issues: Issues;
};

export type UnionIssue = {
  type: 'union';
  reason: 'union';
  validation: 'union';
  message: string;
  issues: Issues;
};

export type Issue = LeafIssue | NestedIssue | UnionIssue;

/**
 * Issues type.
 */
export type Issues = [Issue, ...Issue[]];

/**
 * A Valibot error with useful information.
 */
export class ValiError extends Error {
  issues: Issues;

  /**
   * Creates a Valibot error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(issues: Issues) {
    super();
    this.issues = issues;
    this.message = this._getFirstLeafIssue()?.message ?? 'Unknown error';
    this.name = 'ValiError';
  }

  private _getFirstLeafIssue(): LeafIssue {
    const dfs = [...this.issues];
    while (!('message' in dfs[0])) {
      const head = dfs.shift()! as NestedIssue | UnionIssue;
      dfs.unshift(...(head.issues ?? []));
    }

    return dfs[0] as LeafIssue;
  }
}
