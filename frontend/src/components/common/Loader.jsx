const Loader = ({ message = 'Chargement...' }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem',
      fontSize: '1.1rem',
      color: '#666',
    }}>
      <span>{message}</span>
    </div>
  );
};

export default Loader;