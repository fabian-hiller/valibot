import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'starts_with',
  (issue) =>
    `Ungültiger Start: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
