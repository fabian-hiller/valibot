import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'finite',
  (issue) => `Ungültiges Endliche: ${issue.received} erhalten`,
  'de'
);
