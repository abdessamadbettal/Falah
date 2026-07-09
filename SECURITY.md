# Security Policy

## Scope

Falah.io is a fully static site — no server, no database, no accounts. All computation happens in the visitor's browser. The main areas where a security issue could still arise:

- XSS via rendered content (e.g. structured-data injection, canvas/text rendering)
- Supply-chain issues in a dependency
- Leaking visitor data to third parties (the site's core promise is that this never happens)

## Supported versions

Only the latest deployment of [falah.io](https://falah.io) (built from `main`) is supported.

## Reporting a vulnerability

Please email **[abdessamadbattal@gmail.com](mailto:abdessamadbattal@gmail.com)** instead of opening a public issue. Include steps to reproduce and, if possible, the affected page or dependency.

You can expect an acknowledgement within **72 hours** and a fix or public disclosure plan within **30 days** for confirmed issues.
