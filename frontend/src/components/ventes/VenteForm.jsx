import { useState } from 'react';
import Button from '../common/Button';

const VenteForm = ({ medicaments, onSubmit, onCancel }) => {
  const [notes, setNotes] = useState('');
  const [lignes, setLignes] = useState([{ medicament_id: '', quantite: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ notes, lignes });
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Erreur lors de la création.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Créer une vente</h2>

      {error && (
        <p style={{ color: '#E74C3C', marginBottom: '1rem' }}>{error}</p>
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
          alignItems: 'center', marginBottom: '0.75rem',
        }}>
          <select
            value={ligne.medicament_id}
            onChange={e => updateLigne(index, 'medicament_id', e.target.value)}
            style={{ ...inputStyle, flex: 2 }}
          >
            <option value="">-- Médicament *</option>
            {medicaments.map(m => (
              <option key={m.id} value={m.id}>
                {m.nom} (Stock: {m.stock_actuel})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Quantité"
            value={ligne.quantite}
            onChange={e => updateLigne(index, 'quantite', parseInt(e.target.value))}
            style={{ ...inputStyle, flex: 1 }}
          />

          {lignes.length > 1 && (
            <Button variant="danger" onClick={() => removeLigne(index)}>✕</Button>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button variant="warning" onClick={addLigne}>+ Article</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Création...' : 'Créer la vente'}
        </Button>
        <Button variant="secondary" onClick={onCancel}>Annuler</Button>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '0.95rem',
};

const containerStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '1.5rem',
  marginTop: '1.5rem',
  marginBottom: '1rem',
};

export default VenteForm;