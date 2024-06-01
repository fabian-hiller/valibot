import { string, url } from 'valibot';

const Schema = string([url()]);
