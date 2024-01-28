import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'excludes',
  (issue) =>
    `Ungültiger Inhalt: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
