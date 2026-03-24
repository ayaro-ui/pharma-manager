const COLORS = {
  primary: '#4A90D9',
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  secondary: '#95a5a6',
};

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#ccc' : COLORS[variant],
        color: 'white',
        border: 'none',
        padding: '0.5rem 1.2rem',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '0.9rem',
        transition: 'opacity 0.2s',
      }}
    >
      {children}
    </button>
  );
};

export default Button;