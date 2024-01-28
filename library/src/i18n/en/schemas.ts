import { setGlobalMessage } from '../../index.ts';

setGlobalMessage((issue) => {
  if (issue.reason === 'type') {
    return `Invalid type: Expected ${issue.expected} but received ${issue.received}`;
  }
  return issue.message;
}, 'en');
