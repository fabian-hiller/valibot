import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'cuid2',
  (issue) => `Invalid Cuid2: Received ${issue.received}`,
  'en'
);
