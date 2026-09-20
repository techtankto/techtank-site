import { execSync } from "child_process";

const config = process.platform === "win32" ? "--config knip.windows.json" : "";
execSync(`knip ${config} --fix --format --include-entry-exports --allow-remove-files`.trim(), {
  stdio: "inherit",
});
