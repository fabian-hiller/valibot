import {
  getGlobalMessage,
  getSchemaMessage,
  getSpecificMessage,
} from '../../storages/index.ts';
import type {
  ErrorMessage,
  SchemaConfig,
  SchemaIssue,
} from '../../types/index.ts';

/**
 * The i18n context type.
 */
interface I18nContext {
  message: ErrorMessage | undefined;
}

/**
 * Creates the i18n error message.
 *
 * @param schema Whether its a schema.
 * @param context The message context.
 * @param reference The identifier reference.
 * @param config The parse configuration.
 * @param issue The issue.
 *
 * @returns The error message.
 */
export function i18n(
  schema: boolean,
  context: I18nContext,
  // eslint-disable-next-line @typescript-eslint/ban-types
  reference: Function,
  config: SchemaConfig | undefined,
  issue: SchemaIssue
): string {
  const message =
    context.message ??
    getSpecificMessage(reference, issue.lang) ??
    (schema ? getSchemaMessage(issue.lang) : null) ??
    config?.message ??
    getGlobalMessage(issue.lang) ??
    issue.message;
  return typeof message === 'function' ? message(issue) : message;
}
