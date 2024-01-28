import { getGlobalMessage, getLocalMessage } from '../../storages/index.ts';
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
 * @param config The parse configuration.
 * @param issue The issue.
 *
 * @returns The error message.
 */
export function i18n(
  context: I18nContext,
  config: ParseConfig | undefined,
  issue: SchemaIssue
): string {
  const message =
    context.message ||
    config?.message ||
    getLocalMessage(context.type, issue.lang) ||
    getGlobalMessage(issue.lang) ||
    issue.message;
  return typeof message === 'function' ? message(issue) : message;
}
