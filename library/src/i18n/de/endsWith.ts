import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ends_with',
  (issue) =>
    `Ungültiges Ende: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
