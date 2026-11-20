import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { format } from "oxfmt";

type FormatOptions = NonNullable<Parameters<typeof format>[2]>;

// The oxfmt API doesn't discover config files, so read the repo's
// .oxfmtrc.json and pass its formatting options through. That keeps the
// scraper's output identical to what `pnpm format` (and CI's format check)
// would produce. `$schema` and `ignorePatterns` only matter to the CLI.
export async function loadFormatOptions(root: string): Promise<FormatOptions> {
  const raw = JSON.parse(await readFile(join(root, ".oxfmtrc.json"), "utf8"));
  const { $schema: _schema, ignorePatterns: _ignore, ...options } = raw;
  return options as FormatOptions;
}

// Format the generated data file in memory, so the committed file passes
// CI's format check whether or not a pre-commit hook ran (e.g. in automation).
export async function formatGeneratedFile(fileName: string, source: string, root: string): Promise<string> {
  const result = await format(fileName, source, await loadFormatOptions(root));
  if (result.errors.length > 0) {
    throw new Error(`oxfmt could not format ${fileName}: ${result.errors.map((e) => e.message).join("; ")}`);
  }
  return result.code;
}
