// Thin wrapper over the `bun-vpn` Rust binary. Only documented upstream Bun APIs are used
// (Bun.spawn, Bun.which, Bun.file); nothing here needs a Bun fork or a native Bun plugin.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const exe = process.platform === "win32" ? "bun-vpn.exe" : "bun-vpn";

/** Locate the binary: $BUN_VPN_BIN, then next to this package (bin/), then PATH. */
export function binaryPath() {
  const env = process.env.BUN_VPN_BIN;
  if (env) return env;
  const local = join(dirname(fileURLToPath(import.meta.url)), "bin", exe);
  if (Bun.file(local).size > 0) return local;
  const onPath = Bun.which("bun-vpn");
  if (onPath) return onPath;
  throw new Error("bun-vpn binary not found: set BUN_VPN_BIN, put it on PATH, or build it (see README)");
}

/** Run `bun-vpn <args>` and return { code, stdout, stderr }. `stdin` is for `login --stdin`. */
export async function run(args, { stdin, env } = {}) {
  const proc = Bun.spawn([binaryPath(), ...args], {
    stdin: stdin === undefined ? "ignore" : new Blob([stdin]),
    stdout: "pipe",
    stderr: "pipe",
    env: env ?? process.env,
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { code, stdout, stderr };
}

export const status = () => run(["status"]);
export const connect = () => run(["connect"]);
export const disconnect = () => run(["disconnect"]);
/** The account number goes through stdin, never through argv. */
export const login = (account) => run(["login", "--stdin"], { stdin: account });
/** Run the embedded daemon in the foreground (needs privileges for routes, DNS and firewall). */
export const daemon = () => Bun.spawn([binaryPath(), "daemon"], { stdio: ["inherit", "inherit", "inherit"] });
