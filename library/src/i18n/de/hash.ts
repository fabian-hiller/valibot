import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'hash',
  (issue) => `Ungültiger Hash: ${issue.received} erhalten`,
  'de'
);
