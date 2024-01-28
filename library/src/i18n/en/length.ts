import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'length',
  (issue) =>
    `Invalid length: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
