import type { SchemaMeta } from '../../types';

export function getEntries<TType extends SchemaMeta>(
  iterable: Array<TType>
): SchemaMeta[];

export function getEntries<TType extends SchemaMeta>(
  iterable: Record<PropertyKey, TType>
): [key: PropertyKey, value: SchemaMeta][];

export function getEntries<TType extends SchemaMeta>(
  iterable: Array<TType> | Record<PropertyKey, TType>
) {
  if (Array.isArray(iterable)) {
    return iterable.map<SchemaMeta>((entry) => {
      if (`checks` in entry && `entries` in entry) {
        return {
          schema: entry.schema,
          checks: entry.checks,
          entries: entry.entries,
        };
      }
      if (`checks` in entry) {
        return { schema: entry.schema, checks: entry.checks };
      }
      if (`entries` in entry) {
        return { schema: entry.schema, entries: entry.entries };
      }
      if (`literal` in entry) {
        return { schema: entry.schema, literal: entry.literal };
      }
      return { schema: entry.schema };
    });
  }

  return Object.entries(iterable).map<[key: PropertyKey, value: SchemaMeta]>(
    ([key, value]) => {
      if (`checks` in value && `entries` in value) {
        return [
          key,
          {
            schema: value.schema,
            checks: value.checks,
            entries: value.entries,
          },
        ];
      }
      if (`checks` in value) {
        return [key, { schema: value.schema, checks: value.checks }];
      }
      if (`entries` in value) {
        return [key, { schema: value.schema, entries: value.entries }];
      }
      if (`literal` in value) {
        return [key, { schema: value.schema, literal: value.literal }];
      }
      return [key, { schema: value.schema }];
    }
  );
}
