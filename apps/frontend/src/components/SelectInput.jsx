import { Field } from 'formik'

function SelectInput({ name, label, options, ...props }) {
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
    </div>
  )
}

export default SelectInput
