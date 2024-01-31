import type {
  ErrorMessage,
  IssueReason,
  ParseConfig,
  PathItem,
  SchemaIssue,
  SchemaIssues,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { i18n } from '../i18n/index.ts';
import { stringify } from '../stringify/index.ts';

/**
 * The schema context type.
 */
type SchemaContext = {
  type: string;
  expects: string | null;
  message: ErrorMessage | undefined;
};

/**
 * The other info type.
 */
type OtherInfo = Partial<{
  reason: IssueReason;
  path: PathItem[];
  issues: SchemaIssues;
}>;

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
  config: ParseConfig | undefined,
  other?: OtherInfo
): UntypedSchemaResult {
  const received = stringify(input);
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  const issue: SchemaIssue = {
    reason: other?.reason ?? 'type',
    validation: context.type,
    origin: config?.origin ?? 'value',
    expected: context.expects,
    received,
    message: `Invalid type: Expected ${context.expects} but received ${received}`,
    input,
    path: other?.path,
    issues: other?.issues,
    lang: config?.lang,
    abortEarly: config?.abortEarly,
    abortPipeEarly: config?.abortPipeEarly,
    skipPipe: config?.skipPipe,
  };
  issue.message = i18n(context, reference, config, issue);
  return { typed: false, output: input, issues: [issue] };
}
