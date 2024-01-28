import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'max_size',
  (issue) =>
    `Ungültige Größe: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
