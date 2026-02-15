import { s, r } from '@isolisp/dsl'

export const required = [
  s('lambda'),
  [s('value')],
  [s('not'), [s('eq'), s('value'), '']],
]

export const visiblePesel = [
  s('lambda'),
  [],
  [s('eq'), r('identityDocument'), 'nationalId'],
]

export const pesel = [
  s('lambda'),
  [s('value')],
  [s('define'), [
    [s('digits'), [s('map'), [s('chars'), s('value')], s('toInt')]],
    [s('weights'), [s('list'), 1, 3, 7, 9, 1, 3, 7, 9, 1, 3]],
    [s('sum'), [s('reduce'), [s('zipWith'), s('weights'), s('digits'), s('mul')], 0, s('add')]],
    [s('expected'), [s('mod'), [s('sub'), 10, [s('mod'), s('sum'), 10]], 10]],
  ], [s('and'),
    [s('eq'), [s('length'), s('value')], 11],
    [s('every'), s('digits'), s('isInt')],
    [s('eq'), [s('nth'), s('digits'), 10], s('expected')],
  ]],
]
