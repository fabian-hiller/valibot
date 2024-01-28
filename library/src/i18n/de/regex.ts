import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'regex',
  (issue) =>
    `Ungültiges Format: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
