import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'mime_type',
  (issue) =>
    `Ungültiger MIME-Typ: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
