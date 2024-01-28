import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'min_length',
  (issue) =>
    `Ungültige Länge: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
