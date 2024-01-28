import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'hexadecimal',
  (issue) => `Ungültige Hexadezimale: ${issue.received} erhalten`,
  'de'
);
