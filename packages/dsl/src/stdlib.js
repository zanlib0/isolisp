export const std = {
  // util
  inspect: x => console.log(x) || x,

  // numbers
  inc: x => x + 1,
  dec: x => x - 1,
  add: (x, y) => x + y,
  sub: (x, y) => x - y,
  mul: (x, y) => x * y,
  mod: (x, y) => x % y,

  // strings
  chars: s => s.split(''),

  // comparisons
  not: x => !x,
  eq: (x, y) => x === y,

  // type conversions
  toInt: x => parseInt(x),

  // typechecks
  isNil: x => Array.isArray(x) && x.length === 0,
  isInt: x => Number.isInteger(x),

  // lists
  cons: (x, xs) => ([x, ...xs]),
  list: (...xs) => xs,
  car: ([x]) => x,
  cdr: ([_x, ...xs]) => xs,
  map: (xs, fn) => xs.map(fn),
  reduce: (xs, acc, fn) => xs.reduce(fn, acc),
  zipWith: (xs, ys, fn) => xs.map((x, i) => fn(x, ys[i])),
  length: xs => xs.length,
  some: (xs, fn) => xs.some(fn),
  every: (xs, fn) => xs.every(fn),
  nth: (xs, n) => xs.at(n),
}
