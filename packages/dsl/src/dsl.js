export const s = name => ({ s: name })
export const eq = (a, b) => [s('eq'), a, b]
export const not = a => [s('not'), a]
export const and = (...args) => [s('and'), ...args]

export const define = (definitions, body) => {
  const defs = Object.entries(definitions)
    .map(([name, definition]) => ([s(name), definition]))

  return [s('define'), defs, body]
}

export const when = (cond, { then, else: otherwise }) => ([s('when'), cond, then, otherwise])

export const lambda = (params, body) => [s('lambda'), params.map(s), body]
