import { evaluate } from '@isolisp/dsl'

class ValidationError extends Error { }

export const dynamicValidate = (data, schema) => {
  const { fields } = schema

  let result

  try {
    const parsedData = fields.flatMap((field) => {
      const checkVisibility = evaluate(field.visibility, data) || (() => true)
      if (!checkVisibility()) return []

      const value = data[field.name]

      const failedRule = field.validations.find((validation) => {
        const validator = evaluate(validation.rule, data)
        return !validator(value)
      })

      if (failedRule) throw new ValidationError(failedRule.message)

      return [[field.name, value]]
    })

    result = { ok: true, value: Object.fromEntries(parsedData) }
  }
  catch (error) {
    if (error instanceof ValidationError) {
      result = { ok: false, value: error.message }
    }
  }

  return result
}
