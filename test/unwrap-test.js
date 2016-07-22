import im from 'immutable';
import {test} from 'tape';
import {
  unwrap
} from '../src/unwrap';


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
