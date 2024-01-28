import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'max_value',
  (issue) =>
    `Ungültiger Wert: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
