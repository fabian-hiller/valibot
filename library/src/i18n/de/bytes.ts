import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'bytes',
  (issue) =>
    `Ungültige Bytes: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
