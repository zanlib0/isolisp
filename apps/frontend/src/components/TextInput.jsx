import { Field, useField } from 'formik'

function TextInput({ name, label, ...props }) {
  const [_field, meta] = useField(name)

  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <Field
        id={name}
        name={name}
        type="text"
        {...props}
      />
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </div>
  )
}

export default TextInput
