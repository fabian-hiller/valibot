import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'length',
  (issue) =>
    `Ungültige Länge: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
