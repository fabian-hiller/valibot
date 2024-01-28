import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'equal',
  (issue) =>
    `Invalid value: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
