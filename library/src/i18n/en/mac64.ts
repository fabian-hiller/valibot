import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'mac64',
  (issue) => `Invalid 64 bit MAC: Received ${issue.received}`,
  'en'
);
