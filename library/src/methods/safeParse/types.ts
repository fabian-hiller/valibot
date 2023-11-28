import type { ValiError } from '../../error/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Issues,
  Output,
} from '../../types/index.ts';

/**
 * Safe parse result type.
 */
export type SafeParseResult<TSchema extends BaseSchema | BaseSchemaAsync> =
  | {
      success: true;
      /**
       * @deprecated Please use `.output` instead.
       */
      data: Output<TSchema>;
      output: Output<TSchema>;
    }
  | {
      success: false;
      /**
       * @deprecated Please use `.issues` instead.
       */
      error: ValiError;
      issues: Issues;
    };
