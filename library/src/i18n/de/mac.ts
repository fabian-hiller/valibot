import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'mac',
  (issue) => `Ungültige MAC: ${issue.received} erhalten`,
  'de'
);
