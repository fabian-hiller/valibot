import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'multiple_of',
  (issue) =>
    `Ungültiges Vielfaches: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);
