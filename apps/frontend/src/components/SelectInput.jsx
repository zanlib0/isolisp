import { Field, useField } from 'formik'

function SelectInput({ name, label, options, ...props }) {
  const [_field, meta] = useField(name)

  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <Field as="select" id={name} name={name} {...props}>
        <option value="">Select an option...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>

      <div className="error">
        {meta.touched && meta.error && meta.error}
      </div>
    </div>
  )
}

export default SelectInput
