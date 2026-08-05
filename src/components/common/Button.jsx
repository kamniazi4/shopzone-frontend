// Reusable button component with variant styles
function Button({ children, variant = 'primary', onClick, type = 'button', disabled = false, fullWidth = false }) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const widthClass = fullWidth ? 'btn-full' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${widthClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;