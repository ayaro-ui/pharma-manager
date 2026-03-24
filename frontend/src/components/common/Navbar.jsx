import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { path: '/', label: '🏠 Dashboard' },
  { path: '/medicaments', label: '💊 Médicaments' },
  { path: '/ventes', label: '🛒 Ventes' },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={navStyle}>
      <div style={brandStyle}>
        💊 PharmaManager
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...linkStyle,
              backgroundColor: location.pathname === link.path
                ? '#2980B9'
                : 'transparent',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

const navStyle = {
  backgroundColor: '#4A90D9',
  color: 'white',
  padding: '1rem 2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

const brandStyle = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontSize: '0.95rem',
  transition: 'background-color 0.2s',
};

export default Navbar;