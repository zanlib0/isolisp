import { test, describe, expect } from 'vitest'
import { evaluate, s } from '../src'

describe('simple eq script', () => {
  const program = [
    s('lambda'),
    [s('x'), s('y')],
    [s('eq'), s('x'), s('y')],
  ]

  test('eq returns true for equal arguments', () => {
    expect(evaluate([program, 1, 1])).toBe(true)
  })

  test('eq returns false for unequal arguments', () => {
    expect(evaluate([program, 2, 1])).toBe(false)
  })
})

describe('recursion', () => {
  const program = [
    s('define'),
    [[s('factorial'),
      [s('lambda'), [s('n')],
        [s('when'), [s('eq'), s('n'), 0],
          1,
          [s('mul'), s('n'), [s('recur'), [s('dec'), s('n')]]],
        ]]]],
    [s('factorial'), 6],
  ]

  test('gives the correct answer', () => {
    const result = evaluate(program)
    expect(result).toBe(720)
  })
})

describe('map function', () => {
  const program = [s('define'), [
    [s('double'), [s('lambda'), [s('a')], [s('mul'), s('a'), 2]]],
    [s('ys'), [s('list'), 1, 2, 3, 4, 5]],
    [s('map'), [s('lambda'), [s('fn'), s('xs')],
      [s('when'), [s('isNil'), s('xs')],
        [s('list')],
        [s('cons'), [s('fn'), [s('car'), s('xs')]], [s('recur'), s('fn'), [s('cdr'), s('xs')]]],
      ]]],
  ],
  [s('map'), s('double'), s('ys')]]

  test('map doubles a list', () => {
    const result = evaluate(program)
    expect(result).toEqual([2, 4, 6, 8, 10])
  })
})
