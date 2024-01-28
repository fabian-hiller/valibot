import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'not_value',
  (issue) =>
    `Ungültiger Wert: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
