const ErrorMessage = ({ message = 'Une erreur est survenue.' }) => {
  return (
    <div style={{
      backgroundColor: '#fdecea',
      border: '1px solid #E74C3C',
      borderRadius: '8px',
      padding: '1rem 1.5rem',
      color: '#E74C3C',
      margin: '1rem 0',
    }}>
      ⚠️ {message}
    </div>
  );
};

export default ErrorMessage;