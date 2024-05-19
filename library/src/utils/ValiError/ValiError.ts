import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferIssue,
} from '../../types/index.ts';

/**
 * A Valibot error with useful information.
 */
export class ValiError<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> extends Error {
  /**
   * The error issues.
   */
  public readonly issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]];

  /**
   * Creates a Valibot error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]]) {
    super(issues[0].message);
    this.name = 'ValiError';
    this.issues = issues;
  }
}
