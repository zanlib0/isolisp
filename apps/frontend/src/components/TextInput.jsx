import { Field } from 'formik'

function TextInput({ name, label, ...props }) {
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <Field
        id={name}
        name={name}
        type="text"
        {...props}
      />
    </div>
  )
}

export default TextInput
