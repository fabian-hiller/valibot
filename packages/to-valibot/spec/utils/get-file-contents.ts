import { readFile } from "node:fs/promises";

const getFileContents = async (path: string) => {
  const file = await readFile(path);
  return file.toString();
}

export { getFileContents }