import type {
  IssueReason,
  ParseConfig,
  Pipe,
  SchemaIssues,
  TypedSchemaResult,
} from '../../types/index.ts';
import { schemaResult } from '../schemaResult/index.ts';
import { pipeIssue } from './utils/index.ts';

/**
 * The schema context type.
 */
type SchemaContext<TValue> = {
  type: IssueReason;
  pipe: Pipe<TValue> | undefined;
};

/**
 * Executes the validation and transformation pipe.
 *
 * @param context The schema context.
 * @param input The input value.
 * @param config The parse configuration.
 * @param issues The issues if any.
 *
 * @returns The pipe result.
 */
export function pipeResult<TValue>(
  context: SchemaContext<TValue>,
  input: TValue,
  config: ParseConfig | undefined,
  issues?: SchemaIssues
): TypedSchemaResult<TValue> {
  // Execute any action of pipe if necessary
  if (context.pipe && !config?.skipPipe) {
    for (const action of context.pipe) {
      const result = action._parse(input);

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

        // Otherwise, overwrite input
      } else {
        input = result.output;
      }
    }
  }

  // Return final schema result
  return schemaResult(true, input, issues);
}
