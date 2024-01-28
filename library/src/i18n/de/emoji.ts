import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'emoji',
  (issue) => `Ungültiges Emoji: ${issue.received} erhalten`,
  'de'
);
