import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'email',
  (issue) => `Invalid email: Received ${issue.received}`,
  'en'
);
