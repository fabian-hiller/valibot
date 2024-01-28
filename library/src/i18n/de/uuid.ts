import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'uuid',
  (issue) => `Ungültige UUID: ${issue.received} erhalten`,
  'de'
);
