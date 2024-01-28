import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'value',
  (issue) =>
    `Ungültiger Wert: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
