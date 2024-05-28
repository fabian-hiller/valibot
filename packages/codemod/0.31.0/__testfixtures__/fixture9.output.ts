import { string, url, pipe } from "valibot";

const Schema = pipe(string(), url());
