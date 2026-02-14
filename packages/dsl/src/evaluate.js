import { s } from './dsl'
import * as std from './stdlib'

const isSymbol = value => typeof value?.s === 'string'
const eqs = (a, b) => isSymbol(a) && isSymbol(b) && (a.s === b.s)
const unsymbol = value => value.s

const evalExpr = (expr, env) => {
  if (['number', 'boolean', 'function'].includes(typeof expr)) return expr

  if (isSymbol(expr)) return env(expr)

  if (eqs(expr[0], s('define'))) return evalDefine(expr, env)
  if (eqs(expr[0], s('when'))) return evalWhen(expr, env)
  if (eqs(expr[0], s('lambda'))) return evalLambda(expr, env)

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

const defaultEnv = (a) => {
  const symbol = unsymbol(a)

  if (typeof std[symbol] === 'function') return std[symbol]

  throw new Error(`unbound, ${symbol}`)
}

export const evaluate = (term, env = defaultEnv) => evalExpr(term, env)
