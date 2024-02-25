import type {
  BaseSchema,
  BaseSchemaAsync,
  Output,
  SchemaIssues,
} from '../../types/index.ts';

/**
 * Safe parse result type.
 */
export type SafeParseResult<TSchema extends BaseSchema | BaseSchemaAsync> =
  | {
      typed: true;
      success: true;
      output: Output<TSchema>;
      issues: undefined;
    }
  | {
      typed: true;
      success: false;
      output: Output<TSchema>;
      issues: SchemaIssues;
    }
  | {
      typed: false;
      success: false;
      output: unknown;
      issues: SchemaIssues;
    };
