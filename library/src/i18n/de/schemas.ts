import { setGlobalMessage } from '../../index.ts';

setGlobalMessage((issue) => {
  if (issue.reason === 'type') {
    return `Ungültiger Typ: ${issue.expected} erwartet aber ${issue.received} erhalten`;
  }
  return issue.message;
}, 'de');
