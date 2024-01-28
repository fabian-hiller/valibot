import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'includes',
  (issue) =>
    `Invalid content: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
