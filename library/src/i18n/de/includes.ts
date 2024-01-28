import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'includes',
  (issue) =>
    `Ungültiger Inhalt: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
