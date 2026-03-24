import { useMedicaments, useAlertes } from '../hooks/useMedicaments';
import { useVentes } from '../hooks/useVentes';

const DashboardPage = () => {
  const { medicaments, loading: loadingMed } = useMedicaments();
  const { alertes, loading: loadingAlertes } = useAlertes();
  const { ventes, loading: loadingVentes } = useVentes();

  const today = new Date().toISOString().split('T')[0];
  const ventesAujourdhui = ventes.filter(v =>
    v.date_vente && v.date_vente.startsWith(today)
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard PharmaManager</h1>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>

        <div style={cardStyle('#4A90D9')}>
          <h2>Medicaments</h2>
          {loadingMed ? (
            <p>Chargement...</p>
          ) : (
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {medicaments.length}
            </p>
          )}
          <p>medicaments actifs</p>
        </div>

        <div style={cardStyle('#E74C3C')}>
          <h2>Alertes Stock</h2>
          {loadingAlertes ? (
            <p>Chargement...</p>
          ) : (
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {alertes.length}
            </p>
          )}
          <p>medicaments sous seuil</p>
        </div>

        <div style={cardStyle('#27AE60')}>
          <h2>Ventes du jour</h2>
          {loadingVentes ? (
            <p>Chargement...</p>
          ) : (
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {ventesAujourdhui.length}
            </p>
          )}
          <p>transactions aujourd'hui</p>
        </div>

      </div>

      {alertes.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Medicaments en alerte de stock</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Stock actuel</th>
                <th style={thStyle}>Stock minimum</th>
              </tr>
            </thead>
            <tbody>
              {alertes.map(med => (
                <tr key={med.id}>
                  <td style={tdStyle}>{med.nom}</td>
                  <td style={{ ...tdStyle, color: '#E74C3C', fontWeight: 'bold' }}>
                    {med.stock_actuel}
                  </td>
                  <td style={tdStyle}>{med.stock_minimum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const cardStyle = (color) => ({
  backgroundColor: color,
  color: 'white',
  padding: '1.5rem 2rem',
  borderRadius: '12px',
  minWidth: '200px',
  textAlign: 'center',
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
};

const thStyle = {
  backgroundColor: '#f0f0f0',
  padding: '0.75rem',
  textAlign: 'left',
  border: '1px solid #ddd',
};

const tdStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
};

export default DashboardPage;