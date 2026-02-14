export const inc = x => x + 1
export const dec = x => x - 1
export const add = (x, y) => x + y
export const mul = (x, y) => x * y
export const eq = (x, y) => x === y
export const car = ([x]) => x
export const cdr = ([_x, ...xs]) => xs
export const cons = (x, xs) => ([x, ...xs])
export const list = (...xs) => xs
export const isNil = x => Array.isArray(x) && x.length === 0
export const and = (...xs) => xs.every(x => Boolean(x))
export const or = (...xs) => xs.some(x => Boolean(x))
