import { pipe, string, url } from 'valibot';

const Schema = pipe(string(), url());
