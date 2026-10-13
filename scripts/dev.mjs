// `next dev` with its own output folder (.next-dev) so it never overwrites a production build in .next.
import { spawn } from "node:child_process";

const child = spawn("npx", ["next", "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: ".next-dev" },
});
child.on("exit", (code) => process.exit(code ?? 0));
