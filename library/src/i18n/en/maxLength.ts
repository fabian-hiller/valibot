import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'max_length',
  (issue) =>
    `Invalid length: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
