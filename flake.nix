{
  description = "Node.js + Vite + TypeScript development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs-slim
            pkgs.pnpm
            pkgs.corepack
          ];

          shellHook = ''
            corepack enable
            pnpm install --frozen-lockfile
          '';
        };
      });
}
