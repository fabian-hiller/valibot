import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'octal',
  (issue) => `Ungültiges Octal: ${issue.received} erhalten`,
  'de'
);
