import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/medicaments" element={<MedicamentsPage />} />
        <Route path="/ventes" element={<VentesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;