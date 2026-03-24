import Button from '../common/Button';

const VenteRow = ({ vente, onAnnuler }) => {
  const { reference, date_vente, total_ttc, statut, notes } = vente;

  const statusColor = {
    annulee: '#E74C3C',
    completee: '#27AE60',
    en_cours: '#F39C12',
  };

  return (
    <tr>
      <td style={tdStyle}>{reference}</td>
      <td style={tdStyle}>
        {new Date(date_vente).toLocaleDateString('fr-FR')}
      </td>
      <td style={tdStyle}>{total_ttc} MAD</td>
      <td style={tdStyle}>
        <span style={{
          color: statusColor[statut] || '#666',
          fontWeight: 'bold',
        }}>
          {statut}
        </span>
      </td>
      <td style={tdStyle}>{notes || '-'}</td>
      <td style={tdStyle}>
        {statut !== 'annulee' && (
          <Button variant="danger" onClick={() => onAnnuler(vente.id)}>
            Annuler
          </Button>
        )}
      </td>
    </tr>
  );
};

const tdStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
};

export default VenteRow;