import type {
  Issues,
  TypedSchemaResult,
  UntypedSchemaResult,
  SchemaResult,
} from '../../types/index.ts';

/**
 * Returns the result object with an output.
 *
 * @param typed Whether it's typed.
 * @param output The output value.
 * @param issues The issues if any.
 *
 * @returns The result object.
 */
export function parseResult<TOutput>(
  typed: true,
  output: TOutput,
  issues?: Issues
): TypedSchemaResult<TOutput>;

/**
 * Returns the result object with an output.
 *
 * @param typed Whether it's typed.
 * @param output The output value.
 * @param issues The issues.
 *
 * @returns The result object.
 */
export function parseResult(
  typed: false,
  output: unknown,
  issues: Issues
): UntypedSchemaResult;

export function parseResult<TOutput>(
  typed: boolean,
  output: TOutput | unknown,
  issues?: Issues
): SchemaResult<TOutput> {
  return { typed, output, issues } as SchemaResult<TOutput>;
}
