import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'email',
  (issue) => `Ungültige E-Mail: ${issue.received} erhalten`,
  'de'
);
