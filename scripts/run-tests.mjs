import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const testDir = "tests";
const files = (await readdir(testDir))
  .filter((file) => file.endsWith(".test.js"))
  .sort();

for (const file of files) {
  await import(pathToFileURL(path.resolve(testDir, file)));
}
