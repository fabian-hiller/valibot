import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'size',
  (issue) =>
    `Ungültige Größe: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
