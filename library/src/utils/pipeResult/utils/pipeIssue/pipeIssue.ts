import type {
  IssueReason,
  PipeActionIssue,
  SchemaConfig,
  SchemaIssue,
} from '../../../../types/index.ts';
import { i18n } from '../../../i18n/index.ts';
import { stringify } from '../../../stringify/index.ts';

/**
 * The schema context type.
 */
type SchemaContext = {
  type: IssueReason;
};

/**
 * Returns the pipe issue data.
 *
 * @param context The schema context.
 * @param config The parse configuration.
 * @param issue The pipe action issue.
 *
 * @returns A schema issue.
 */
export function pipeIssue(
  context: SchemaContext,
  config: SchemaConfig | undefined,
  issue: PipeActionIssue
): SchemaIssue {
  const received = issue.received ?? stringify(issue.input);
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  const schemaIssue: SchemaIssue = {
    reason: context.type,
    context: issue.context.type,
    expected: issue.context.expects,
    received,
    message: `Invalid ${issue.label}: ${
      issue.context.expects ? `Expected ${issue.context.expects} but r` : 'R'
    }eceived ${received}`,
    input: issue.input,
    requirement: issue.context.requirement,
    path: issue.path,
    lang: config?.lang,
    abortEarly: config?.abortEarly,
    abortPipeEarly: config?.abortPipeEarly,
    skipPipe: config?.skipPipe,
  };
  schemaIssue.message = i18n(
    issue.context,
    issue.reference,
    config,
    schemaIssue
  );
  return schemaIssue;
}
