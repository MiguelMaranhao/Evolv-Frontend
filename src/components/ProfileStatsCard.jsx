import React from 'react';
import { Home, Dumbbell, TrendingUp, Users, User } from 'lucide-react';
import '../styles/HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <h1 className="evolv-logo small-logo">Evolv</h1>

      <div className="content-scroll">
        {/* Card Resumo */}
        <p className="section-title">[ CARD - RESUMO ]</p>
        <div className="card summary-card">
          <div className="profile-header">
            <div className="profile-pic"></div>
            <h2>Olá, Miguel</h2>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <span>Treinos</span>
              <strong>12</strong>
            </div>
            <div className="stat-item">
              <span>Semana</span>
              <strong>3</strong>
            </div>
            <div className="stat-item">
              <span>Peso</span>
              <strong>75</strong>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <p className="section-title">[ AÇÕES RÁPIDAS ]</p>
        <div className="action-button primary-action">
          <div>
            <h3>Iniciar Treino</h3>
            <span>Treino A - Peito/Tríceps</span>
          </div>
          <div className="arrow-right"></div>
        </div>
        <div className="action-button secondary-action">
          <div>
            <h3>Ver progresso</h3>
            <span>Últimos 30 dias</span>
          </div>
          <div className="arrow-right"></div>
        </div>

        {/* Último Treino */}
        <p className="section-title">[ ÚLTIMO TREINO ]</p>
        <div className="card last-workout-card">
          <h3>Treino B - Costa/Bíceps</h3>
          <span className="time-ago">Há 2 dias</span>
          <div className="workout-list">
            <div className="workout-item">
              <span>Supino Reto</span>
              <span className="green-text">3x10 - 60kg</span>
            </div>
            <div className="workout-item">
              <span>Crucifixo</span>
              <span className="green-text">3x12 - 12kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Inferior */}
      <nav className="bottom-nav">
        <div className="nav-item active">
          <Home size={24} />
          <span>Home</span>
        </div>
        <div className="nav-item">
          <Dumbbell size={24} />
          <span>Treino</span>
        </div>
        <div className="nav-item">
          <TrendingUp size={24} />
          <span>Progresso</span>
        </div>
        <div className="nav-item">
          <Users size={24} />
          <span>Amigos</span>
        </div>
        <div className="nav-item">
          <User size={24} />
          <span>Perfil</span>
        </div>
      </nav>
    </div>
  );
}