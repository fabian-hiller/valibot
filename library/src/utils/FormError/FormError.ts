import { flatten } from '../../methods/flatten/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferIssue,
} from '../../types/index.ts';

/**
 * A Valibot form error with useful information.
 */
export class FormError<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> extends Error {
  /**
   * The form errors.
   */
  public readonly formErrors?: [string, ...string[]];

  /**
   * The form field errors.
   */
  public readonly fieldErrors?: {
    readonly [fieldName: string]: [string, ...string[]] | undefined;
  };

  /**
   * Creates a Valibot form error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(issues: [InferIssue<TSchema>, ...InferIssue<TSchema>[]]) {
    super(issues[0].message);
    this.name = 'FormError';
    const errors = flatten(issues);
    this.formErrors = errors.root;
    this.fieldErrors = errors.nested;
  }
}
