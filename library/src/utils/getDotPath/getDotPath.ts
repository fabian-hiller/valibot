import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferIssue,
  IssueDotPath,
} from '../../types/index.ts';

/**
 * Creates and returns the dot path of an issue if possible.
 *
 * @param issue The issue to get the dot path from.
 *
 * @returns The dot path or null.
 */
export function getDotPath(issue: BaseIssue<unknown>): string | null;

/**
 * Creates and returns the dot path of an issue if possible.
 *
 * @param issue The issue to get the dot path from.
 *
 * @returns The dot path or null.
 */
export function getDotPath<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(issue: InferIssue<TSchema>): IssueDotPath<TSchema> | null;

export function getDotPath(issue: BaseIssue<unknown>): string | null {
  if (issue.path) {
    let key = '';
    for (const item of issue.path) {
      if (typeof item.key === 'string' || typeof item.key === 'number') {
        if (key) {
          key += `.${item.key}`;
        } else {
          key += item.key;
        }
      } else {
        return null;
      }
    }
    return key;
  }
  return null;
}
