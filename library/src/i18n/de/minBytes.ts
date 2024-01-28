import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'min_bytes',
  (issue) =>
    `Ungültige Bytes: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
