// Reusable labeled input field for forms
function InputField({ label, type = 'text', name, value, onChange, required = false, placeholder = '' }) {
  return (
    <div className="form-field">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputField;