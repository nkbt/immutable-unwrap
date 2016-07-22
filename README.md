# immutable-unwrap[![npm](https://img.shields.io/npm/v/immutable-unwrap.svg?style=flat-square)](https://www.npmjs.com/package/immutable-unwrap)

[![Discord](https://img.shields.io/badge/chat-discord-blue.svg?style=flat-square)](https://discord.gg/013tGW1IMcW6Vd1o7)

[![CircleCI](https://img.shields.io/circleci/project/packetloop/immutable-unwrap.svg?style=flat-square&label=nix-build)](https://circleci.com/gh/packetloop/immutable-unwrap)
[![Coverage](https://img.shields.io/coveralls/packetloop/immutable-unwrap.svg?style=flat-square)](https://coveralls.io/github/packetloop/immutable-unwrap)
[![Dependencies](https://img.shields.io/david/packetloop/immutable-unwrap.svg?style=flat-square)](https://david-dm.org/packetloop/immutable-unwrap)
[![Dev Dependencies](https://img.shields.io/david/dev/packetloop/immutable-unwrap.svg?style=flat-square)](https://david-dm.org/packetloop/immutable-unwrap#info=devDependencies)

Recursive unwrapper for nested ImmutableJS and mixed ImmutableJS/JavaScript data structures into a plain JavaScript objects for deep equality asserts in unit tests.


## Installation

### NPM
```sh
npm install --save-dev immutable-unwrap lodash immutable
```

Don't forget to manually install peer dependencies (`immutable`, `lodash`) if you use npm@3.


## Usage
```js
test('Immutable unwrapping', {objectPrintDepth: 999}, t => {
  t.deepEqual(
    unwrap(
      im.Map({x: 1})
    ),
    {x: 1},
    'should unwrap Map');

  t.deepEqual(
    unwrap(
      im.List([1, 2, 3, 4])
    ),
    [1, 2, 3, 4],
    'should unwrap List');

  t.deepEqual(
    unwrap(
      im.List([im.Map({x: im.Map({y: 1})}), im.Map({x: 2}), im.Map({x: 3}), im.Map({x: 4})])
    ),
    [{x: {y: 1}}, {x: 2}, {x: 3}, {x: 4}],
    'should unwrap Nested Immutable');

  t.deepEqual(
    unwrap(
      [im.Map({x: {y: 1}}), {x: 2}, im.Map({x: 3}), im.Map({x: 4})]
    ),
    [{x: {y: 1}}, {x: 2}, {x: 3}, {x: 4}],
    'should unwrap mixed JS and Immutable');

  t.deepEqual(
    unwrap(
      im.Map()
        .set(im.List([1, 2, 3]), im.Map({x: 1}))
    ),
    [[[1, 2, 3], {x: 1}]],
    'should unwrap Maps with Immutables as keys into array of [key, value] tuples');

  t.deepEqual(
    unwrap(
      im.Map()
        .set(im.Map({x: 1}), new Date(1000))
    ),
    [[{x: 1}, 1000]],
    'should transform dates to timestamps');

  t.deepEqual(unwrap(
    {
      wow: im.Map()
        .set(im.List([new Date(1000), new Date(1100)]), im.Map({x: 1}))
        .set(im.List([new Date(1100), new Date(1200)]), im.Map({x: 3}))
        .set(im.List([new Date(1200), new Date(1300)]), {
          foo: im.Map()
            .set(im.Map({z: 0}), 123)
            .set(im.Map({z: 1}), [1, 2, 3])
            .set(im.Map({z: 2}), im.Map({x: new Date(1000)}))
        })
    }
  ), {
    wow: [
      [[1000, 1100], {x: 1}],
      [[1100, 1200], {x: 3}],
      [[1200, 1300], {
        foo: [
          [{z: 0}, 123],
          [{z: 1}, [1, 2, 3]],
          [{z: 2}, {x: 1000}]
        ]
      }]]
  }, 'should unwrap more complicated example');

  t.end();
});
```

## Development and testing

Currently is being developed and tested with the latest stable `Node 6` on `OSX`.

## Tests

```bash
# to run ESLint
npm run lint

# to run tests
npm test

# to generate test coverage (./reports/coverage)
npm run cov
```

## License

MIT
