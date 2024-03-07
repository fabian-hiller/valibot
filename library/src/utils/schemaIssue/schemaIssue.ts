import type {
  ErrorMessage,
  IssuePath,
  IssueReason,
  SchemaConfig,
  SchemaIssue,
  SchemaIssues,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { i18n } from '../i18n/index.ts';
import { stringify } from '../stringify/index.ts';

/**
 * The schema context type.
 */
interface SchemaContext {
  type: string;
  expects: string;
  message: ErrorMessage | undefined;
}

/**
 * The other info type.
 */
interface OtherInfo {
  reason?: IssueReason;
  expected?: string;
  path?: IssuePath;
  issues?: SchemaIssues;
}

/**
 * Returns the schema result object with issues.
 *
 * @param context The schema context.
 * @param reference The schema reference.
 * @param input The raw input data.
 * @param config The parse configuration.
 * @param other The other info.
 *
 * @returns The schema result object.
 */
export function schemaIssue(
  context: SchemaContext,
  // eslint-disable-next-line @typescript-eslint/ban-types
  reference: Function,
  input: unknown,
  config: SchemaConfig | undefined,
  other?: OtherInfo
): UntypedSchemaResult {
  const received = stringify(input);
  const expected = other?.expected ?? context.expects;
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  const issue: SchemaIssue = {
    reason: other?.reason ?? 'type',
    context: context.type,
    expected,
    received,
    message: `Invalid type: Expected ${expected} but received ${received}`,
    input,
    path: other?.path,
    issues: other?.issues,
    lang: config?.lang,
    abortEarly: config?.abortEarly,
    abortPipeEarly: config?.abortPipeEarly,
    skipPipe: config?.skipPipe,
  };
  issue.message = i18n(true, context, reference, config, issue);
  return { typed: false, output: input, issues: [issue] };
}
