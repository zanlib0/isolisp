export const s = name => ({ s: name })
export const r = name => ({ r: name })

/** Parse an S-expression string into the nested JS structure used by the evaluator.
 * Symbols become {s: "name"}, @references become {r: "name"}.
 * Inverse of prettyprint.
 * @vibecoded true
 */
const SLOT = '\x00'

export const lisp = (strings, ...slots) => {
  const src = typeof strings === 'string'
    ? strings
    : strings.reduce((acc, str, i) =>
        i < slots.length ? acc + str + `${SLOT}${i}${SLOT}` : acc + str, '')

  const isSpace = c => ' \t\n\r'.includes(c)
  const isBreak = c => !c || c === SLOT || isSpace(c) || '()'.includes(c)
  const drop = s => s.length > 0 && isSpace(s[0]) ? drop(s.slice(1)) : s

  const toAtom = tok =>
    tok[0] === '@'
      ? { r: tok.slice(1) }
      : tok === 'true' || tok === 'false'
        ? tok === 'true' // boolean literal
        : Number.isFinite(Number(tok))
          ? Number(tok)
          : { s: tok }

  const readToken = (s, acc = '') =>
    isBreak(s[0]) ? [toAtom(acc), s] : readToken(s.slice(1), acc + s[0])

  const readString = (s, acc = '') =>
    s[0] === '"'
      ? [acc, s.slice(1)]
      : s[0] === '\\'
        ? readString(s.slice(2), acc + s[1])
        : readString(s.slice(1), acc + s[0])

  const readSlot = s => {
    const end = s.indexOf(SLOT, 1)
    return [slots[Number(s.slice(1, end))], s.slice(end + 1)]
  }

  const readList = (s, acc = []) => {
    const rest = drop(s)
    if (rest[0] === ')') return [acc, rest.slice(1)]
    const [val, remaining] = read(rest)
    return readList(remaining, [...acc, val])
  }

  const read = s => {
    const rest = drop(s)
    if (rest[0] === SLOT) return readSlot(rest)
    if (rest[0] === '(') return readList(rest.slice(1))
    if (rest[0] === '"') return readString(rest.slice(1))
    return readToken(rest)
  }

  return read(src)[0]
}

/** Take a Lisp term as a JS structure and pretty print it. Useful for debugging.
 * @vibecoded true
 */
export const prettyprint = (expr, depth = 0) => {
  const indent = '  '.repeat(depth)
  const pp = e => prettyprint(e, depth)
  const ppd = e => prettyprint(e, depth + 1)

  const printAtom = () =>
    typeof expr === 'number' || typeof expr === 'boolean'
      ? String(expr)
      : typeof expr === 'string'
        ? JSON.stringify(expr)
        : expr?.s ?? expr?.r ?? '<unknown>'

  const printLambda = ([params, body]) =>
    `(lambda ${pp(params)} ${ppd(body)})`

  const printDefine = ([bindings, body]) => {
    const bindStr = bindings.map(([n, v]) => `(${pp(n)} ${ppd(v)})`)
      .join(`\n   ${indent}`)
    return `(define\n  ${indent}(${bindStr})\n${indent}${ppd(body)})`
  }

  const printCall = () => {
    const parts = expr.map(pp)
    const oneLine = `(${parts.join(' ')})`
    return oneLine.length < 60
      ? oneLine
      : `(${parts[0]}\n${indent}  ${parts.slice(1).join(`\n${indent}  `)})`
  }

  const printList = ([head, ...tail]) =>
    head?.s === 'lambda'
      ? printLambda(tail)
      : head?.s === 'define'
        ? printDefine(tail)
        : printCall()

  return !Array.isArray(expr)
    ? printAtom()
    : expr.length === 0
      ? '()'
      : printList(expr)
}
