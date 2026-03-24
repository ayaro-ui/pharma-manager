import { useState } from 'react';
import { useVentes } from '../hooks/useVentes';
import { useMedicaments } from '../hooks/useMedicaments';
import { createVente, annulerVente } from '../api/ventesApi';

const VentesPage = () => {
  const { ventes, loading, error, refetch } = useVentes();
  const { medicaments } = useMedicaments();

  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState('');
  const [lignes, setLignes] = useState([{ medicament_id: '', quantite: 1 }]);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const addLigne = () => {
    setLignes([...lignes, { medicament_id: '', quantite: 1 }]);
  };

  const removeLigne = (index) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const updateLigne = (index, field, value) => {
    const updated = [...lignes];
    updated[index][field] = value;
    setLignes(updated);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    setFormError(null);
    try {
      await createVente({ notes, lignes });
      setShowForm(false);
      setNotes('');
      setLignes([{ medicament_id: '', quantite: 1 }]);
      refetch();
    } catch (err) {
      setFormError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Erreur lors de la creation.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleAnnuler = async (id) => {
    if (!window.confirm('Annuler cette vente ?')) return;
    try {
      await annulerVente(id);
      refetch();
    } catch (err) {
      alert("Erreur lors de l'annulation.");
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Chargement...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ventes</h1>

      <button onClick={() => setShowForm(!showForm)} style={btnStyle('#27AE60')}>
        + Nouvelle Vente
      </button>

      {showForm && (
        <div style={formContainerStyle}>
          <h2>Creer une vente</h2>

          {formError && (
            <p style={{ color: 'red', marginBottom: '1rem' }}>{formError}</p>
          )}

          <textarea
            placeholder="Notes (optionnel)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ ...inputStyle, width: '100%', marginBottom: '1rem' }}
            rows={2}
          />

          <h3>Articles</h3>
          {lignes.map((ligne, index) => (
            <div key={index} style={{
              display: 'flex', gap: '1rem',
              alignItems: 'center', marginBottom: '0.75rem'
            }}>
              <select
                value={ligne.medicament_id}
                onChange={e => updateLigne(index, 'medicament_id', e.target.value)}
                style={{ ...inputStyle, flex: 2 }}
              >
                <option value="">-- Medicament *</option>
                {medicaments.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nom} (Stock: {m.stock_actuel})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="Quantite"
                value={ligne.quantite}
                onChange={e => updateLigne(index, 'quantite', parseInt(e.target.value))}
                style={{ ...inputStyle, flex: 1 }}
              />

              {lignes.length > 1 && (
                <button onClick={() => removeLigne(index)} style={btnStyle('#E74C3C')}>
                  X
                </button>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={addLigne} style={btnStyle('#F39C12')}>
              + Ajouter article
            </button>
            <button onClick={handleSubmit} disabled={formLoading} style={btnStyle('#4A90D9')}>
              {formLoading ? 'Creation...' : 'Creer la vente'}
            </button>
            <button onClick={() => setShowForm(false)} style={btnStyle('#95a5a6')}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <table style={{ ...tableStyle, marginTop: '2rem' }}>
        <thead>
          <tr>
            {['Reference', 'Date', 'Total TTC', 'Statut', 'Notes', 'Actions'].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ventes.map(vente => (
            <tr key={vente.id}>
              <td style={tdStyle}>{vente.reference}</td>
              <td style={tdStyle}>
                {new Date(vente.date_vente).toLocaleDateString('fr-FR')}
              </td>
              <td style={tdStyle}>{vente.total_ttc} MAD</td>
              <td style={tdStyle}>
                <span style={{
                  color: vente.statut === 'annulee' ? '#E74C3C'
                    : vente.statut === 'completee' ? '#27AE60' : '#F39C12',
                  fontWeight: 'bold',
                }}>
                  {vente.statut}
                </span>
              </td>
              <td style={tdStyle}>{vente.notes || '-'}</td>
              <td style={tdStyle}>
                {vente.statut !== 'annulee' && (
                  <button onClick={() => handleAnnuler(vente.id)} style={btnStyle('#E74C3C')}>
                    Annuler
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventes.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#999' }}>
          Aucune vente enregistree.
        </p>
      )}
    </div>
  );
};

const inputStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '0.95rem',
};

const btnStyle = (bg) => ({
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.9rem',
});

const formContainerStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '1.5rem',
  marginTop: '1.5rem',
  marginBottom: '1rem',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  backgroundColor: '#4A90D9',
  color: 'white',
  padding: '0.75rem',
  textAlign: 'left',
};

const tdStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
};

export default VentesPage;