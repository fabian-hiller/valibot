import type { LeafIssue, NestedIssue, UnionIssue } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

export function getLeafIssue(
  issue: {
    validation: LeafIssue['validation'];
    message: LeafIssue['message'];
    input: LeafIssue['input'];
    reason?: LeafIssue['reason'];
  },
  validateInfo?: ValidateInfo
): LeafIssue {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    type: 'leaf',
    validation: issue.validation,
    message: issue.message,
    input: issue.input,
    reason: validateInfo?.reason ?? issue.reason ?? 'type',
  };
}

export function getNestedIssue(issue: {
  path: NestedIssue['path'];
  origin?: NestedIssue['origin'];
  issues: NestedIssue['issues'];
}): NestedIssue {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    type: 'nested',
    path: issue.path,
    origin: issue.origin ?? 'value',
    issues: issue.issues,
  };
}

export function getUnionIssue(issue: {
  message: UnionIssue['message'];
  issues: UnionIssue['issues'];
}): UnionIssue {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    type: 'union',
    reason: 'union',
    validation: 'union',
    message: issue.message,
    issues: issue.issues,
  };
}
