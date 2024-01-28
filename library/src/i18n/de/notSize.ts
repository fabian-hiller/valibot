import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'not_size',
  (issue) =>
    `Ungültige Größe: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
