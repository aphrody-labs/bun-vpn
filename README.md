# bun-vpn

The `vpn` plugin of the Aphrody Bun fork: the `bun-vpn` executable that
`bun vpn` dispatches to (`src/runtime/cli/plugin_command.rs` in
[aphrody-labs/bun](https://github.com/aphrody-labs/bun)).

Imported from aphrody-labs/bun commit `f31829d8aa36e9f34e662c8a9e5edf6e25705c86` (src/plugins/vpn and src/bun_vpn; Mullvad is the submodule vendor/mullvad, aphrody-labs/mullvadvpn-app branch bun-embedded). That repository keeps the
earlier history.

## Install

Nothing to install: the first `bun vpn ...` downloads `bun-vpn-<target>` from the
release of the running bun, checks it against that release's `SHA256SUMS.txt`
and caches it in the plugin directory. A `bun-vpn` next to the bun executable
takes precedence.

## Build from source

This workspace path-depends on crates of the Bun checkout, so it builds only
mounted in it as `plugins/vpn` (an optional submodule, `update = none`):

```sh
git -C <bun checkout> submodule update --init --checkout --recursive plugins/vpn
bun bd --target=plugins          # build/<profile>/bun-vpn next to bun
# or directly:
cd <bun checkout>/plugins/vpn && cargo build --locked --profile plugin -p bun_plugin_vpn --bin bun-vpn
```

The toolchain is the Bun checkout's `rust-toolchain.toml`. `Cargo.lock` was
derived from the Bun workspace lockfile, so dependency versions match what the
fork built before the move.

On Windows, `talpid-core` links the WinFw firewall library that the Bun graph
compiles from `vendor/mullvad/windows` (`scripts/build/deps/winfw.ts` in the Bun
checkout), so build it there with `bun bd --target=plugins`.

License: GPL-3.0-or-later (Mullvad VPN app and the embedding glue).
