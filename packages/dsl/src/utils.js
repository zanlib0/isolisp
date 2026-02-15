export const s = name => ({ s: name })
export const r = name => ({ r: name })

/** Take a Lisp term as a JS structure and pretty print it. Useful for debugging.
 * @vibecoded true
 */
export const prettyprint = (expr, depth = 0) => {
  const indent = '  '.repeat(depth)

  if (typeof expr === 'number' || typeof expr === 'boolean') return String(expr)
  if (typeof expr === 'string') return JSON.stringify(expr)
  if (expr?.s) return expr.s
  if (expr?.r) return expr.r

  if (Array.isArray(expr)) {
    if (expr.length === 0) return '()'

    const [head, ...tail] = expr

    if (head?.s === 'lambda') {
      const [params, body] = tail
      return `(lambda ${prettyprint(params, depth)} ${prettyprint(body, depth + 1)})`
    }

    if (head?.s === 'define') {
      const [bindings, body] = tail
      const bindStr = bindings.map(([n, v]) =>
        `(${prettyprint(n)} ${prettyprint(v, depth + 1)})`,
      ).join('\n  ' + indent)
      return `(define\n  ${indent}${bindStr}\n${indent}${prettyprint(body, depth + 1)})`
    }

    const parts = expr.map(e => prettyprint(e, depth))
    const oneLine = `(${parts.join(' ')})`
    if (oneLine.length < 60) return oneLine

    return `(${parts[0]}\n${indent}  ${parts.slice(1).join('\n' + indent + '  ')})`
  }

  return '<unknown>'
}
