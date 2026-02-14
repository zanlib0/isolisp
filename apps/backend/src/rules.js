import { s } from '@isolisp/dsl'

export const required = [
  s('lambda'),
  [s('value')],
  [s('not'), [s('eq'), s('value'), '']],
]
