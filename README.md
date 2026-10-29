# bun-vpn

Mullvad VPN for Bun: the `bun-vpn` Rust binary (management-IPC client plus an embedded
Mullvad daemon) and a small npm wrapper. It is standalone: it needs no Bun fork and no
native Bun plugin, and runs beside unmodified upstream Bun, which only spawns it
(`Bun.spawn`, documented API).

```sh
bun-vpn daemon                      # embedded daemon (privileged: routes, DNS, firewall)
bun-vpn status | connect | disconnect
echo 1234567890123456 | bun-vpn login --stdin     # or: login --from-env NAME
```

```js
import { status, login } from "bun-vpn";   // npm/ in this repository
console.log((await status()).stdout);
```

## Layout

- `bun_vpn/`: library (`VpnClient`, `start_embedded_daemon`, `cli`), no dependency on Bun.
- `plugin/`: the `bun-vpn` binary (package `bun_plugin_vpn`).
- `npm/`: wrapper package `bun-vpn` (`binaryPath`, `run`, `status`, `connect`, `disconnect`, `login`, `daemon`); not published.
- `vendor/mullvad`: submodule [aphrody-labs/mullvadvpn-app](https://github.com/aphrody-labs/mullvadvpn-app)
  branch `bun-embedded`, a fork of [mullvad/mullvadvpn-app](https://github.com/mullvad/mullvadvpn-app).
  It is upstream plus a small delta (the `embedded` feature of `mullvad-daemon`, a detached
  log handle, a statically linked WinFw option, `THIRD_PARTY.md`), merged with upstream main
  `011860c6728` (2026-10-28).

## Build

```sh
git submodule update --init --checkout vendor/mullvad
cargo build --release -p bun_plugin_vpn      # target/release/bun-vpn
```

Needs the Rust toolchain in `rust-toolchain.toml` (stable 1.97.1, no nightly) and `protoc`
(set `PROTOC`/`PROTOC_INCLUDE` if it is not on `PATH`). On Windows, `talpid-core` links the
WinFw firewall library built from `vendor/mullvad/windows` (see `BUN_WINFW_STATIC` in
`talpid-core/build.rs`). `cargo check` of both crates passes on Windows; a full link
and a connection test against a real Mullvad account have not been done.

License: GPL-3.0-or-later (Mullvad VPN app and the glue code). A binary built from this
repository must ship the GPL notices and corresponding source.
