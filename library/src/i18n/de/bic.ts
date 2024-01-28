import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'bic',
  (issue) => `Ungültiger BIC: ${issue.received} erhalten`,
  'de'
);
