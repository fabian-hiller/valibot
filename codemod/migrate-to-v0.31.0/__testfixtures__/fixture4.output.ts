import * as v from 'valibot';
import { objectWithRest, tupleWithRest } from 'valibot';

const ObjectSchema = objectWithRest({ key: v.string() }, v.null_());
const TupleSchema = tupleWithRest([v.string()], v.null_());
