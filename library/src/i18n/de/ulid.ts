import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ulid',
  (issue) => `Ungültige ULID: ${issue.received} erhalten`,
  'de'
);
