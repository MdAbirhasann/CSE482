export default function Button({ children, variant = 'primary', type = 'button', onClick, className = '', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
