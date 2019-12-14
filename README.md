[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# DOM Dependency Injection

A small library utilizing a DOM-as-API approach to efficiently allow elements to act as dependency providers to arbitrarily nested descendants, including across shadow boundaries. It's similar to React Context, Stencil tunnels, etc., while being framework-agnostic.

While technology-agnostic, the primary goal is to ensure support for Web Components, while remaining a simple primitive to compose with other technologies (library-specific wrappers, decorators, observables, etc.) to promote the best developer experience for the specific technology stack being used.

## Getting Started

```
npm i --save apalaniuk/dom-dependency-injection
```

## API

See [code documentation](./docs/index.html) for API usage.

## Examples

[Examples can be found in the `examples` directory](./examples). You can try them by running the HTTP server of your choice, eg:

```
npx http-server
```

and navigating to examples in that directory.
