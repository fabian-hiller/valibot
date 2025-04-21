import * as v from "valibot";

// ------------ single ------------
// invalid_type_error
const Schema1 = v.string("must be a string");
const Schema2 = v.literal("valibot", 'must be "valibot"');
// message
const Schema3 = v.string("must be a string");
const Schema4 = v.literal("foo", 'must be "foo"');
// required_error - not supported by Valibot
const Schema5 = v.string();
const Schema6 = v.literal("bar");
// description
const Schema7 = v.pipe(v.string(), v.description("some description"));
const schema7Description = Schema7.pipe.find(action => action.type === "description")?.description;
const Schema8 = v.pipe(v.literal("hello"), v.description('some description (literal "hello")'));
const schema8Description = Schema8.pipe.find(action => action.type === "description")?.description;
// coerce
const Schema9 = v.pipe(v.unknown(), v.transform(String));
// errorMap - supported by Valibot but incompatible
const Schema10 = v.string();
const Schema11 = v.literal("world");

// ------------ multiple ------------
const Schema12 = v.string("must be a string (msg)");
const Schema13 = v.literal("bot", 'must be "bot" (msg)');
const Schema14 = v.pipe(v.unknown(), v.transform(String), v.description("some description"));
const schema14Description = Schema14.pipe.find(action => action.type === "description")?.description;;