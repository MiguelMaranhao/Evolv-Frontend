import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, Activity, ChevronRight, Flame, Trophy } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  // Estado para controlar a interatividade do card de resumo
  const [periodoAtivo, setPeriodoAtivo] = useState('semana');

  // Dados simulados que mudam quando o usuário clica nas abas
  const stats = {
    semana: { treinos: 3, horas: '4.5h', recordes: 1 },
    mes: { treinos: 12, horas: '18h', recordes: 4 }
  };
  const currentStats = stats[periodoAtivo];

  return (
    <div className="home-page fade-in">
      {/* Header Premium */}
      <header className="home-header">
        <div className="user-greeting">
          <div className="profile-pic-mini"></div>
          <div>
            <h1 className="greeting-text">Olá, Miguel</h1>
            <span className="greeting-sub">Pronto para superar limites?</span>
          </div>
        </div>
        <h2 className="evolv-logo mini-logo">Evolv</h2>
      </header>

      <div className="content-scroll home-layout">
        
        {/* Card de Estatísticas Interativo */}
        <div className="glass-card interactive-stats">
          <div className="stats-tabs">
            <button 
              className={`stat-tab ${periodoAtivo === 'semana' ? 'active' : ''}`}
              onClick={() => setPeriodoAtivo('semana')}
            >
              Esta Semana
            </button>
            <button 
              className={`stat-tab ${periodoAtivo === 'mes' ? 'active' : ''}`}
              onClick={() => setPeriodoAtivo('mes')}
            >
              Este Mês
            </button>
          </div>

          <div className="stats-grid fade-in-fast" key={periodoAtivo}>
            <div className="stat-box">
              <Activity size={22} className="stat-icon green-glow" />
              <strong>{currentStats.treinos}</strong>
              <span>Treinos</span>
            </div>
            <div className="stat-box">
              <Flame size={22} className="stat-icon orange-glow" />
              <strong>{currentStats.horas}</strong>
              <span>Horas ativas</span>
            </div>
            <div className="stat-box">
              <Trophy size={22} className="stat-icon gold-glow" />
              <strong>{currentStats.recordes}</strong>
              <span>Recordes</span>
            </div>
          </div>
        </div>

        {/* CTA Principal - Call to Action (Design focado na conversão/ação) */}
        <p className="section-label">AÇÃO PRINCIPAL</p>
        <div className="glass-card main-cta" onClick={() => navigate('/treino')}>
          <div className="cta-info">
            <span className="cta-badge">Treino de Hoje</span>
            <h3>Treino A - Peito e Tríceps</h3>
            <span className="cta-desc">Meta de hoje: bater 64kg no Supino</span>
          </div>
          <button className="play-btn">
            <Play size={26} fill="#000" color="#000" />
          </button>
        </div>

        {/* Explorar - Scroll Horizontal para economizar espaço vertical */}
        <p className="section-label">EXPLORAR</p>
        <div className="horizontal-scroll">
          <div className="glass-card explore-card" onClick={() => navigate('/progresso')}>
            <TrendingUp size={24} className="explore-icon" />
            <h4>Evolução</h4>
            <span>Ver gráficos</span>
          </div>
          <div className="glass-card explore-card" onClick={() => navigate('/amigos')}>
            <Activity size={24} className="explore-icon" />
            <h4>Comunidade</h4>
            <span>Ranking</span>
          </div>
        </div>

        {/* Último Treino Reduzido e Elegante */}
        <p className="section-label">ÚLTIMO TREINO</p>
        <div className="glass-card last-workout-compact" onClick={() => navigate('/detalhes')}>
          <div className="lw-left">
            <h4>Treino B - Costa/Bíceps</h4>
            <span>Há 2 dias • 5 exercícios concluídos</span>
          </div>
          <ChevronRight size={22} color="var(--evolv-green)" />
        </div>

        {/* Espaço extra para a rolagem não bater na navbar */}
        <div className="spacer"></div>
      </div>

      <BottomNav />
    </div>
  );
}