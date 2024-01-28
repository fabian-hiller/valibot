import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'cuid2',
  (issue) => `Ungültige Cuid2: ${issue.received} erhalten`,
  'de'
);
