/** Lisp evaluator. Mostly based on https://zanlib.dev/blog/lisp-in-js/.
 * Things that are not included in the original implementation (OI) described
 * in the blogpost are commented here.
 */
import { s } from './utils.js'
import { std } from './stdlib.js'

/** Constructs a symbol.
 *  The blog post used native JS symbols, however they do not serialise into JSON so here
 * we use `{s: 'name'}` in lieu of native symbols loaded into global scope (`new Symbol('name')`). */
const isSymbol = value => typeof value?.s === 'string'
/** Compares two symbols */
const eqs = (a, b) => isSymbol(a) && isSymbol(b) && (a.s === b.s)
/** Unwraps a symbol */
const unsymbol = value => value.s

/** References are another kind of symbols that are used to look up values in context rather than
* the environment. The "context" is a simpler kind of global scope inside of the environment that
* doesn't have nested scope, but is instead a simple look-up object that is used to access
* different values in the same form.
*/
const isReference = value => typeof value?.r === 'string'
/** Unwraps a reference. */
const unreference = value => value.r

const evalExpr = (expr, env) => {
  // Primitive types evaluate to themselves. There are a few more compared to OI.
  if (['number', 'boolean', 'function', 'string', 'undefined'].includes(typeof expr)) return expr

  // Symbols evaluate to their value in the environment. References evaluate to their
  // value in context.
  if (isSymbol(expr) || isReference(expr)) return env(expr)

  // Special forms have their own evaluation rules. There are a few more compared
  // to OI.
  if (eqs(expr[0], s('define'))) return evalDefine(expr, env)
  if (eqs(expr[0], s('when'))) return evalWhen(expr, env)
  if (eqs(expr[0], s('and'))) return evalAnd(expr, env)
  if (eqs(expr[0], s('or'))) return evalOr(expr, env)
  if (eqs(expr[0], s('lambda'))) return evalLambda(expr, env)

  // Finally, if the value is neither a primitive, a symbol or a special form, it's a
  // function that needs to be applied.
  return apply(expr, env)
}

const evalDefine = ([_define, definitions, body], env) => {
  const newEnv = definitions.reduce((env, [symbol, definition]) => {
    return (b) => {
      if (eqs(b, symbol)) return evalExpr(definition, env)
      return env(b)
    }
  }, env)

  return evalExpr(body, newEnv)
}

const evalWhen = ([_when, cond, cons, alt], env) => {
  if (evalExpr(cond, env)) {
    return evalExpr(cons, env)
  }
  else {
    return evalExpr(alt, env)
  }
}

/** Short circuited implementation of the `&&` operator as a function.
 * Cannot follow the normal evaluation rules for the same reason `when` cannot.
 */
const evalAnd = ([_and, ...conds], env) => {
  const run = ([cond, ...rest]) => {
    const value = evalExpr(cond, env)
    if (!value) return value
    if (rest.length === 0) return true
    return run(rest)
  }

  return run(conds)
}

/** Short circuited implementation of the `||` operator as a function. */
const evalOr = ([_or, ...conds], env) => {
  const run = ([cond, ...rest]) => {
    const value = evalExpr(cond, env)
    if (value) return value
    if (rest.length === 0) return false
    return run(rest)
  }

  return run(conds)
}

const evalLambda = ([_lambda, params, body], env) => {
  const unsymboledParams = params.map(unsymbol)

  const fn = (...args) => {
    const newEnv = (b) => {
      const unsymboledB = unsymbol(b)
      const index = unsymboledParams.indexOf(unsymboledB)

      if (index !== -1) return args[index]
      if (eqs(b, s('recur'))) return fn
      return env(b)
    }

    return evalExpr(body, newEnv)
  }

  return fn
}

const apply = (expr, env) => {
  const [operator, ...operands] = expr
  const fn = evalExpr(operator, env)
  if (typeof fn !== 'function') throw new Error(`not a function, ${operator.toString()}`)
  const args = operands.map(operand => evalExpr(operand, env))
  return fn(...args)
}

/** Default environment has additional "context" global scope added
 * that includes values present in the form that can be looked up with
 * references. Unlike symbols, reference lookups cannot fail: if not found,
 * they return `undefined` instead of throwing.
 */
const defaultEnv = context => (a) => {
  if (isReference(a)) {
    const ref = unreference(a)
    return context[ref]
  }

  const symbol = unsymbol(a)

  // If the symbol corresponds to a function in the standard
  // library, it evaluates to that function.
  if (typeof std[symbol] === 'function') return std[symbol]

  throw new Error(`Unbound symbol: ${symbol}`)
}

/** Evaluate a Lisp term. Optionally include context which is used to provide
 * values to references. If context is empty, all references evaluate to `undefined`.
 */
export const evaluate = (term, context = {}) => evalExpr(term, defaultEnv(context))
