import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'hex_color',
  (issue) => `Ungültige Hex-Farbe: ${issue.received} erhalten`,
  'de'
);
