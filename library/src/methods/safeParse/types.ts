import type { ValiError } from '../../error/index.ts';
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
      /**
       * @deprecated Please use `.output` instead.
       */
      data: Output<TSchema>;
      output: Output<TSchema>;
      /**
       * @deprecated Please use `.issues` instead.
       */
      error: undefined;
      issues: undefined;
    }
  | {
      typed: true;
      success: false;
      /**
       * @deprecated Please use `.output` instead.
       */
      data: Output<TSchema>;
      output: Output<TSchema>;
      /**
       * @deprecated Please use `.issues` instead.
       */
      error: ValiError;
      issues: SchemaIssues;
    }
  | {
      typed: false;
      success: false;
      /**
       * @deprecated Please use `.output` instead.
       */
      data: unknown;
      output: unknown;
      /**
       * @deprecated Please use `.issues` instead.
       */
      error: ValiError;
      issues: SchemaIssues;
    };
