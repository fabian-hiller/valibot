import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'equal',
  (issue) =>
    `Ungültiger Wert: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
