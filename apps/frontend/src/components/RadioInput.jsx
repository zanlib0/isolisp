import { Field, useField } from 'formik'

function RadioInput({ name, label, options, ...props }) {
  const [_field, meta] = useField(name)

  return (
    <div className="form-field">
      {label && <label>{label}</label>}
      <div className="radio-group">
        {options.map(option => (
          <label key={option.value} className="radio-option">
            <Field type="radio" name={name} value={option.value} {...props} />
            {option.label}
          </label>
        ))}
      </div>

      <div className="error">
        {meta.touched && meta.error && meta.error}
      </div>
    </div>
  )
}

export default RadioInput
