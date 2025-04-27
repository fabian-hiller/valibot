import * as v from "valibot";

// ------------ single ------------
// invalid_type_error
const Schema1 = v.string("must be a string");
const Schema2 = v.literal("valibot", 'must be "valibot"');
// message
const Schema3 = v.string("must be a string");
const Schema4 = v.literal("foo", 'must be "foo"');
// required_error
const Schema5 = v.string(issue => issue.input === undefined ? "is required" : issue.message);
const Schema6 = v.literal("bar", issue => issue.input === undefined ? '"bar" is required' : issue.message);
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
// invalid_type_error + required_error
const Schema12 = v.string(issue => issue.input === undefined ? "is required" : "must be a string");
const Schema13 = v.literal("bot", issue => issue.input === undefined ? 'must be "bot"' : '"bot" is required');
// invalid_type_error + message
const Schema14 = v.string("must be a string (msg)");
const Schema15 = v.literal("bot", 'must be "bot" (msg)');
// required_error + message
const Schema16 = v.string("must be a string (msg)");
const Schema17 = v.literal("bot", 'must be "bot" (msg)');
// invalid_type_error + required_error + message
const Schema18 = v.string("must be a string (msg)");
const Schema19 = v.literal("bot", 'must be "bot" (msg)');
// coerce + description
const Schema20 = v.pipe(v.unknown(), v.transform(String), v.description("some description"));
const schema20Description = Schema20.pipe.find(action => action.type === "description")?.description;