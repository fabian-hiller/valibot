import { z } from "zod";

// ------------ single ------------
// invalid_type_error
const Schema1 = z.string({invalid_type_error: "must be a string"});
const Schema2 = z.literal("valibot", {invalid_type_error: 'must be "valibot"'});
// message
const Schema3 = z.string({message: "must be a string"});
const Schema4 = z.literal("foo", {message: 'must be "foo"'});
// required_error
const Schema5 = z.string({required_error: "is required"});
const Schema6 = z.literal("bar", {required_error: '"bar" is required'});
// description
const Schema7 = z.string({description: "some description"});
const schema7Description = Schema7.description;
const Schema8 = z.literal("hello", {description: 'some description (literal "hello")'});
const schema8Description = Schema8.description;
// coerce
const Schema9 = z.string({coerce: true});
// errorMap - supported by Valibot but incompatible
const Schema10 = z.string({errorMap: () => ({message: "some message"})});
const Schema11 = z.literal("world", {errorMap: () => ({message: 'some message (literal "world")'})});

// ------------ multiple ------------
// invalid_type_error + required_error
const Schema12 = z.string({invalid_type_error: "must be a string", required_error: "is required"});
const Schema13 = z.literal("bot", {invalid_type_error: 'must be "bot"', required_error: '"bot" is required'});
// invalid_type_error + message
const Schema14 = z.string({invalid_type_error: "must be a string", message: "must be a string (msg)"});
const Schema15 = z.literal("bot", {invalid_type_error: 'must be "bot"', message: 'must be "bot" (msg)'});
// required_error + message
const Schema16 = z.string({required_error: "is required", message: "must be a string (msg)"});
const Schema17 = z.literal("bot", {required_error: '"bot" is required', message: 'must be "bot" (msg)'});
// invalid_type_error + required_error + message
const Schema18 = z.string({invalid_type_error: "must be a string", required_error: "is required", message: "must be a string (msg)"});
const Schema19 = z.literal("bot", {invalid_type_error: 'must be "bot"', required_error: '"bot" is required', message: 'must be "bot" (msg)'});
// coerce + description
const Schema20 = z.string({coerce: true, description: "some description"});
const schema20Description = Schema20.description;