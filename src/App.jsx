import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TreinoPage from './pages/TreinoPage';
import ExerciseDetail from './pages/ExerciseDetail';
import SeriesRecord from './pages/SeriesRecord'; 
import ProgressoPage from './pages/ProgressoPage';
import AmigosPage from './pages/AmigosPage';
import PerfilPage from './pages/PerfilPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="mobile-container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/treino" element={<TreinoPage />} />
          
          <Route path="/detalhes" element={<ExerciseDetail />} />
          <Route path="/detalhes/:id" element={<ExerciseDetail />} />
          
          {/* Rede de segurança: Aceita tanto com ID quanto sem ID */}
          <Route path="/registro-serie" element={<SeriesRecord />} /> 
          <Route path="/registro-serie/:id" element={<SeriesRecord />} /> 
          
          <Route path="/progresso" element={<ProgressoPage />} />
          <Route path="/amigos" element={<AmigosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;