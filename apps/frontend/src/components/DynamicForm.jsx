import { evaluate } from '@isolisp/dsl'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import { Form, Formik } from 'formik'

export const DynamicForm = ({ schema }) => {
  const { fields } = schema

  const components = fields.map(({ type, validations, ...rest }) => {
    // Return string if error, undefined otherwise.
    const validate = (value) => {
      const failedRule = validations.find((validation) => {
        const validator = evaluate(validation.rule)
        return !validator(value)
      })

      if (failedRule) return failedRule.message
    }

    if (type === 'input') return <TextInput key={rest.name} validate={validate} {...rest} />
    if (type === 'select') return <SelectInput key={rest.name} validate={validate} {...rest} />
  })

  const initialValues = Object.fromEntries(fields.map(field => ([field.name, ''])))

  return (
    <Formik initialValues={initialValues} onSubmit={() => { }}>
      <Form>
        {components}
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  )
}
