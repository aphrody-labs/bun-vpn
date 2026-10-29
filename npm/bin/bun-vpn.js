#!/usr/bin/env bun
import { binaryPath } from "../index.js";
const proc = Bun.spawn([binaryPath(), ...process.argv.slice(2)], { stdio: ["inherit", "inherit", "inherit"] });
process.exit(await proc.exited);
