import * as v from 'valibot';

const Schema = v.brand(v.string([v.url()]), 'foo');
