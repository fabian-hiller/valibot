import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'mime_type',
  (issue) =>
    `Invalid MIME type: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
