import type {
  SchemaIssues,
  SchemaResult,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';

/**
 * Returns the schema result object.
 *
 * @param typed Whether it's typed.
 * @param output The output value.
 * @param issues The issues if any.
 *
 * @returns The result object.
 */
export function schemaResult<TOutput>(
  typed: true,
  output: TOutput,
  issues?: SchemaIssues
): TypedSchemaResult<TOutput>;

/**
 * Returns the schema result object.
 *
 * @param typed Whether it's typed.
 * @param output The output value.
 * @param issues The issues.
 *
 * @returns The result object.
 */
export function schemaResult(
  typed: false,
  output: unknown,
  issues: SchemaIssues
): UntypedSchemaResult;

export function schemaResult<TOutput>(
  typed: boolean,
  output: TOutput | unknown,
  issues?: SchemaIssues
): SchemaResult<TOutput> {
  return { typed, output, issues } as SchemaResult<TOutput>;
}
