import {
  getGlobalMessage,
  getSchemaMessage,
  getSpecificMessage,
} from '../../storages/index.ts';
import type {
  ErrorMessage,
  ParseConfig,
  SchemaIssue,
} from '../../types/index.ts';

/**
 * The i18n context type.
 */
type I18nContext = {
  type: string;
  message: ErrorMessage | undefined;
};

/**
 * Creates the i18n error message.
 *
 * @param context The message context.
 * @param reference The identifier reference.
 * @param config The parse configuration.
 * @param issue The issue.
 *
 * @returns The error message.
 */
export function i18n(
  context: I18nContext,
  // eslint-disable-next-line @typescript-eslint/ban-types
  reference: Function,
  config: ParseConfig | undefined,
  issue: SchemaIssue
): string {
  const message =
    context.message ??
    getSpecificMessage(reference, issue.lang) ??
    (context.type === 'type' ? getSchemaMessage(issue.lang) : null) ??
    config?.message ??
    getGlobalMessage(issue.lang) ??
    issue.message;
  return typeof message === 'function' ? message(issue) : message;
}
