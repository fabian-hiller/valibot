import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'credit_card',
  (issue) => `Ungültige Kreditkarte: ${issue.received} erhalten`,
  'de'
);
