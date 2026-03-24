import { useState } from 'react';
import { useMedicaments } from '../hooks/useMedicaments';
import { useCategories } from '../hooks/useCategories';
import { createMedicament, updateMedicament, deleteMedicament } from '../api/medicamentsApi';

const MedicamentsPage = () => {
  const { medicaments, loading, error, refetch } = useMedicaments();
  const { categories } = useCategories();

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    nom: '', dci: '', categorie: '', forme: '',
    dosage: '', prix_achat: '', prix_vente: '',
    stock_actuel: '', stock_minimum: '',
    date_expiration: '', ordonnance_requise: false,
  });

  const resetForm = () => {
    setForm({
      nom: '', dci: '', categorie: '', forme: '',
      dosage: '', prix_achat: '', prix_vente: '',
      stock_actuel: '', stock_minimum: '',
      date_expiration: '', ordonnance_requise: false,
    });
    setEditTarget(null);
    setFormError(null);
  };

  const handleEdit = (med) => {
    setForm({
      nom: med.nom,
      dci: med.dci || '',
      categorie: med.categorie,
      forme: med.forme || '',
      dosage: med.dosage || '',
      prix_achat: med.prix_achat,
      prix_vente: med.prix_vente,
      stock_actuel: med.stock_actuel,
      stock_minimum: med.stock_minimum,
      date_expiration: med.date_expiration || '',
      ordonnance_requise: med.ordonnance_requise,
    });
    setEditTarget(med.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Archiver ce medicament ?')) return;
    try {
      await deleteMedicament(id);
      refetch();
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    setFormError(null);
    try {
      if (editTarget) {
        await updateMedicament(editTarget, form);
      } else {
        await createMedicament(form);
      }
      resetForm();
      setShowForm(false);
      refetch();
    } catch (err) {
      setFormError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : 'Erreur lors de la sauvegarde.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = medicaments.filter(m =>
    m.nom.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ padding: '2rem' }}>Chargement...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Medicaments</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Rechercher un medicament..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          style={btnStyle('#27AE60')}
        >
          + Ajouter
        </button>
      </div>

      {showForm && (
        <div style={formContainerStyle}>
          <h2>{editTarget ? 'Modifier' : 'Ajouter'} un medicament</h2>

          {formError && (
            <p style={{ color: 'red', marginBottom: '1rem' }}>{formError}</p>
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
              <option value="">-- Categorie *</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
            <input placeholder="Forme (comprime, sirop...)" value={form.forme}
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

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handleSubmit} disabled={formLoading}
              style={btnStyle('#4A90D9')}>
              {formLoading ? 'Sauvegarde...' : editTarget ? 'Modifier' : 'Creer'}
            </button>
            <button onClick={() => { setShowForm(false); resetForm(); }}
              style={btnStyle('#95a5a6')}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <table style={tableStyle}>
        <thead>
          <tr>
            {['Nom', 'DCI', 'Forme', 'Prix vente', 'Stock', 'Statut', 'Actions'].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(med => (
            <tr key={med.id}>
              <td style={tdStyle}>{med.nom}</td>
              <td style={tdStyle}>{med.dci || '-'}</td>
              <td style={tdStyle}>{med.forme || '-'}</td>
              <td style={tdStyle}>{med.prix_vente} MAD</td>
              <td style={tdStyle}>
                <span style={{
                  color: med.est_en_alerte ? '#E74C3C' : '#27AE60',
                  fontWeight: 'bold'
                }}>
                  {med.stock_actuel}
                  {med.est_en_alerte && ' ⚠️'}
                </span>
              </td>
              <td style={tdStyle}>
                {med.est_en_alerte
                  ? <span style={{ color: '#E74C3C' }}>Stock bas</span>
                  : <span style={{ color: '#27AE60' }}>OK</span>
                }
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(med)}
                  style={{ ...btnStyle('#F39C12'), marginRight: '0.5rem' }}>
                  Modifier
                </button>
                <button onClick={() => handleDelete(med.id)}
                  style={btnStyle('#E74C3C')}>
                  Archiver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#999' }}>
          Aucun medicament trouve.
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
  width: '100%',
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
  marginBottom: '2rem',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
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

export default MedicamentsPage;