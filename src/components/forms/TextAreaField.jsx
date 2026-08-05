// Reusable labeled textarea field for forms
function TextAreaField({ label, name, value, onChange, required = false, rows = 4 }) {
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
      />
    </div>
  );
}

export default TextAreaField;