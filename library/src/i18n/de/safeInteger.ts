import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'safe_integer',
  (issue) => `Ungültige sichere Ganzzahl: ${issue.received} erhalten`,
  'de'
);
