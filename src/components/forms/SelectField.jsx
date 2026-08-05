// Reusable labeled select field for forms
// options: [{ value, label }]
function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <select id={name} name={name} value={value} onChange={onChange} required={required}>
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;