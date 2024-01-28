import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'min_size',
  (issue) =>
    `Ungültige Größe: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
