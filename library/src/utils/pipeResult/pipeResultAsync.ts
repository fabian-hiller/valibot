import type {
  IssueReason,
  ParseConfig,
  PipeAsync,
  SchemaIssues,
  SchemaResult,
} from '../../types/index.ts';
import { parseResult } from '../parseResult/index.ts';
import { pipeIssue } from './utils/index.ts';

/**
 * The schema context type.
 */
type SchemaContext<TValue> = {
  type: IssueReason;
  pipe: PipeAsync<TValue> | undefined;
};

/**
 * Executes the async validation and transformation pipe.
 *
 * @param context The schema context.
 * @param input The input value.
 * @param config The parse configuration.
 * @param issues The issues if any.
 *
 * @returns The pipe result.
 */
export async function pipeResultAsync<TValue>(
  context: SchemaContext<TValue>,
  input: TValue,
  config: ParseConfig | undefined,
  issues?: SchemaIssues
): Promise<SchemaResult<TValue>> {
  // Create output
  let output: TValue = input;

  // Execute any action of pipe if necessary
  if (context.pipe?.length && !config?.skipPipe) {
    for (const action of context.pipe) {
      const result = await action._parse(output);

      // If there are issues, capture them
      if (result.issues) {
        // Create each issue and add it to issues
        for (const actionIssue of result.issues) {
          const schemaIssue = pipeIssue(context, config, actionIssue);
          issues ? issues.push(schemaIssue) : (issues = [schemaIssue]);
        }

        // If necessary, abort early
        if (config?.abortEarly || config?.abortPipeEarly) {
          break;
        }

        // Otherwise, overwrite output
      } else {
        output = result.output;
      }
    }
  }

  // Return final parse result
  return parseResult(true, output, issues);
}
