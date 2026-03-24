import { useState } from 'react';
import Button from '../common/Button';

const EMPTY_FORM = {
  nom: '', dci: '', categorie: '', forme: '',
  dosage: '', prix_achat: '', prix_vente: '',
  stock_actuel: '', stock_minimum: '',
  date_expiration: '', ordonnance_requise: false,
};

const MedicamentForm = ({ categories, onSubmit, onCancel, initial = null }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Erreur lors de la sauvegarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>{initial ? 'Modifier' : 'Ajouter'} un médicament</h2>

      {error && (
        <p style={{ color: '#E74C3C', marginBottom: '1rem' }}>{error}</p>
      )}

      <div style={gridStyle}>
        <input placeholder="Nom *" value={form.nom}
          onChange={e => setForm({ ...form, nom: e.target.value })}
          style={inputStyle} />
        <input placeholder="DCI" value={form.dci}
          onChange={e => setForm({ ...form, dci: e.target.value })}
          style={inputStyle} />
        <select value={form.categorie}
          onChange={e => setForm({ ...form, categorie: e.target.value })}
          style={inputStyle}>
          <option value="">-- Catégorie *</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
        <input placeholder="Forme (comprimé, sirop...)" value={form.forme}
          onChange={e => setForm({ ...form, forme: e.target.value })}
          style={inputStyle} />
        <input placeholder="Dosage (500mg...)" value={form.dosage}
          onChange={e => setForm({ ...form, dosage: e.target.value })}
          style={inputStyle} />
        <input placeholder="Prix achat *" type="number" value={form.prix_achat}
          onChange={e => setForm({ ...form, prix_achat: e.target.value })}
          style={inputStyle} />
        <input placeholder="Prix vente *" type="number" value={form.prix_vente}
          onChange={e => setForm({ ...form, prix_vente: e.target.value })}
          style={inputStyle} />
        <input placeholder="Stock actuel *" type="number" value={form.stock_actuel}
          onChange={e => setForm({ ...form, stock_actuel: e.target.value })}
          style={inputStyle} />
        <input placeholder="Stock minimum *" type="number" value={form.stock_minimum}
          onChange={e => setForm({ ...form, stock_minimum: e.target.value })}
          style={inputStyle} />
        <input placeholder="Date expiration" type="date" value={form.date_expiration}
          onChange={e => setForm({ ...form, date_expiration: e.target.value })}
          style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={form.ordonnance_requise}
            onChange={e => setForm({ ...form, ordonnance_requise: e.target.checked })} />
          Ordonnance requise
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sauvegarde...' : initial ? 'Modifier' : 'Créer'}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '0.95rem',
  width: '100%',
};

const containerStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '2rem',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
};

export default MedicamentForm;