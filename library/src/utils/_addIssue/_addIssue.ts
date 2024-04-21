import {
  getGlobalMessage,
  getSchemaMessage,
  getSpecificMessage,
} from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  BaseValidation,
  BaseValidationAsync,
  Config,
  Dataset,
  InferInput,
  InferIssue,
  IssuePathItem,
} from '../../types/index.ts';
import { _stringify } from '../_stringify/index.ts';

/**
 * The other type.
 */
interface Other<TInput> {
  input?: unknown;
  expected?: string;
  received?: string;
  path?: [IssuePathItem, ...IssuePathItem[]];
  issues?: [BaseIssue<TInput>, ...BaseIssue<TInput>[]];
}

/**
 * Adds an issue to the dataset.
 *
 * @param context The issue context.
 * @param label The issue label.
 * @param dataset The input dataset.
 * @param config The configuration.
 * @param other The optional props.
 *
 * @internal
 */
export function _addIssue<
  const TContext extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<unknown, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  context: TContext,
  label: string,
  dataset: Dataset<unknown, BaseIssue<unknown>>,
  config: Config<InferIssue<TContext>>,
  other?: Other<InferInput<TContext>>
): void {
  // Get expected and received string
  const input = other && 'input' in other ? other.input : dataset.value;
  const expected = other?.expected ?? context.expects;
  const received = other?.received ?? _stringify(input);

  // Create issue object
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  const issue: BaseIssue<unknown> = {
    kind: context.kind,
    type: context.type,
    input,
    expected,
    received,
    message: `Invalid ${label}: ${
      expected ? `Expected ${expected} but r` : 'R'
    }eceived ${received}`,
    // @ts-expect-error
    requirement: context.requirement,
    path: other?.path,
    issues: other?.issues,
    lang: config.lang,
    abortEarly: config.abortEarly,
    abortPipeEarly: config.abortPipeEarly,
    skipPipe: config.skipPipe,
  };

  // Check if context is a schema
  const isSchema = context.kind === 'schema';

  // Get custom issue message
  const message =
    // @ts-expect-error
    context.message ??
    getSpecificMessage(context.reference, issue.lang) ??
    (isSchema ? getSchemaMessage(issue.lang) : null) ??
    config.message ??
    getGlobalMessage(issue.lang);

  // If custom message if specified, override default message
  if (message) {
    // @ts-expect-error
    issue.message = typeof message === 'function' ? message(issue) : message;
  }

  // If context is a schema, set typed to false
  if (isSchema) {
    dataset.typed = false;
  }

  // Add issue to dataset
  if (dataset.issues) {
    dataset.issues.push(issue);
  } else {
    dataset.issues = [issue];
  }
}
