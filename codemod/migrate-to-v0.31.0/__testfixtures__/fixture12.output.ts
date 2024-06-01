import * as v from 'valibot';

const Schema = v.pipe(v.string(), v.url(), v.brand('foo'));
