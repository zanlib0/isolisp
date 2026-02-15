import { evaluate, prettyprint } from '@isolisp/dsl'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import { Form, FormikProvider, useFormik } from 'formik'

export const DynamicForm = ({ schema }) => {
  const { fields } = schema

  const initialValues = Object.fromEntries(fields.map(field => ([field.name, ''])))

  const formik = useFormik({
    initialValues,
    onSubmit: values => console.info(values),
  })

  const components = fields.flatMap(({ type, validations, visibility, ...rest }) => {
    const checkVisibility = evaluate(visibility, formik.values) || (() => true)
    if (!checkVisibility()) return []

    // Return string if error, undefined otherwise.
    const validate = (value) => {
      const failedRule = validations.find((validation) => {
        const validator = evaluate(validation.rule, formik.values)
        return !validator(value)
      })

      if (failedRule) return failedRule.message
    }

    if (type === 'input') return [<TextInput key={rest.name} validate={validate} {...rest} />]
    if (type === 'select') return [<SelectInput key={rest.name} validate={validate} {...rest} />]
  })

  return (
    <FormikProvider value={formik}>
      <Form>
        {components}
        <button type="submit">Submit</button>
      </Form>
    </FormikProvider>
  )
}
