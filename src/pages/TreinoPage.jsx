import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Circle, ChevronRight, Play, Square, Flame, Activity, Calendar as CalendarIcon, Dumbbell } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import '../styles/TreinoPage.css';

export default function TreinoPage() {
  const navigate = useNavigate();
  
  // Estados do Treino e Calendário
  const [selectedDay, setSelectedDay] = useState(27); // Dia atual
  
  // A MÁGICA AQUI: Inicia lendo a memória. Se não tiver nada, começa no 'A'
  const [activeTab, setActiveTab] = useState(localStorage.getItem('evolv_activeTab') || 'A');
  
  const calendarRef = useRef(null);

  const [rotinas, setRotinas] = useState({
    'A': {
      nome: 'Peito e Tríceps',
      exercicios: [
        { id: 1, nome: 'Supino Reto', detalhe: '4 Séries • 8-12 Reps', carga: '80kg', concluido: true },
        { id: 2, nome: 'Supino Inclinado (Halter)', detalhe: '3 Séries • 10-12 Reps', carga: '28kg', concluido: false },
        { id: 3, nome: 'Crucifixo Máquina', detalhe: '3 Séries • 12-15 Reps', carga: '45kg', concluido: false },
        { id: 4, nome: 'Tríceps Pulley', detalhe: '4 Séries • 10-15 Reps', carga: '35kg', concluido: false },
      ]
    },
    'B': {
      nome: 'Costas e Bíceps',
      exercicios: [
        { id: 5, nome: 'Puxada Frente', detalhe: '4 Séries • 10-12 Reps', carga: '65kg', concluido: false },
        { id: 6, nome: 'Remada Curvada', detalhe: '4 Séries • 8-10 Reps', carga: '70kg', concluido: false },
        { id: 7, nome: 'Rosca Direta', detalhe: '3 Séries • 12 Reps', carga: '30kg', concluido: false },
      ]
    },
    'C': {
      nome: 'Pernas Completo',
      exercicios: [
        { id: 8, nome: 'Agachamento Livre', detalhe: '4 Séries • 8-10 Reps', carga: '100kg', concluido: false },
        { id: 9, nome: 'Leg Press 45', detalhe: '4 Séries • 12-15 Reps', carga: '200kg', concluido: false },
        { id: 10, nome: 'Cadeira Extensora', detalhe: '3 Séries • Até a falha', carga: '70kg', concluido: false },
      ]
    },
    'D': {
      nome: 'Ombros e Abdômen',
      exercicios: [
        { id: 11, nome: 'Desenvolvimento Halter', detalhe: '4 Séries • 10 Reps', carga: '24kg', concluido: false },
        { id: 12, nome: 'Elevação Lateral', detalhe: '4 Séries • 15 Reps', carga: '14kg', concluido: false },
        { id: 13, nome: 'Abdominal Máquina', detalhe: '4 Séries • 20 Reps', carga: '45kg', concluido: false },
      ]
    }
  });

  const diasSemana = [
    { dia: 'Seg', data: 23, id: '23-1' }, { dia: 'Ter', data: 24, id: '24-1' }, 
    { dia: 'Qua', data: 25, id: '25-1' }, { dia: 'Qui', data: 26, id: '26-1' }, 
    { dia: 'Sex', data: 27, id: '27-1' }, { dia: 'Sáb', data: 28, id: '28-1' }, 
    { dia: 'Dom', data: 29, id: '29-1' }, { dia: 'Seg', data: 30, id: '30-1' },
    { dia: 'Ter', data: 31, id: '31-1' }, { dia: 'Qua', data: 1, id: '1-2' }, 
    { dia: 'Qui', data: 2, id: '2-2' }, { dia: 'Sex', data: 3, id: '3-2' }
  ];

  const [isStarted, setIsStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.scrollLeft = 120; 
    }
  }, []);

  useEffect(() => {
    const savedTime = localStorage.getItem('evolv_timer');
    const savedState = localStorage.getItem('evolv_isStarted');
    if (savedTime && !isNaN(savedTime)) setTimeElapsed(parseInt(savedTime));
    if (savedState === 'true') setIsStarted(true);
  }, []);

  useEffect(() => {
    let interval;
    if (isStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          localStorage.setItem('evolv_timer', newTime);
          return newTime;
        });
      }, 1000);
      localStorage.setItem('evolv_isStarted', 'true');
    } else {
      localStorage.setItem('evolv_isStarted', 'false');
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  const formatTime = (totalSeconds) => {
    if (isNaN(totalSeconds)) return "00:00";
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFinish = () => {
    if (window.confirm("Finalizar e salvar treino no histórico?")) {
      localStorage.removeItem('evolv_timer');
      localStorage.removeItem('evolv_isStarted');
      setIsStarted(false);
      setTimeElapsed(0);
      alert("Treino salvo com sucesso no seu histórico!");
    }
  };

  // FUNÇÃO NOVA: Troca a aba e salva a escolha na memória
  const handleTabChange = (letra) => {
    setActiveTab(letra);
    localStorage.setItem('evolv_activeTab', letra);
  };

  const toggleExercicio = (e, letraTab, exId) => {
    e.stopPropagation(); 
    
    setRotinas(prev => ({
      ...prev,
      [letraTab]: {
        ...prev[letraTab],
        exercicios: prev[letraTab].exercicios.map(ex => 
          ex.id === exId ? { ...ex, concluido: !ex.concluido } : ex
        )
      }
    }));
  };

  return (
    <div className="treino-page fade-in">
      <header className="treino-header-modern">
        <div className="header-left">
          <span className="greeting">Olá, Miguel</span>
          <h1 className="page-title">Seu Treino</h1>
        </div>
        <div className="header-right">
          <div className="calendar-icon-btn">
            <CalendarIcon size={22} color="var(--evolv-green)" />
          </div>
        </div>
      </header>

      <div className="treino-content">
        
        <div className="calendar-strip" ref={calendarRef}>
          {diasSemana.map((item) => (
            <div 
              key={item.id} 
              className={`calendar-day ${selectedDay === item.data ? 'active' : ''}`}
              onClick={() => setSelectedDay(item.data)}
            >
              <span className="day-name">{item.dia}</span>
              <span className="day-number">{item.data}</span>
              {selectedDay === item.data && <div className="active-dot"></div>}
            </div>
          ))}
        </div>

        {isStarted && (
          <div className="glass-card dashboard-card active-dash fade-in">
            <div className="dash-top">
              <div className="timer-display">
                <Clock size={22} className="glow-icon" color="var(--evolv-green)" />
                <span className="time pulse-text">{formatTime(timeElapsed)}</span>
              </div>
              <button className="action-circle-btn btn-pause" onClick={() => setIsStarted(false)}>
                <Square fill="#000" size={20} />
              </button>
            </div>
            
            <div className="workout-metrics">
              <div className="metric">
                <Activity size={16} color="var(--evolv-green)" />
                <span>Volume Atual: <strong>3.2 Toneladas</strong></span>
              </div>
              <div className="metric">
                <Flame size={16} color="#ffaa00" />
                <span>Intensidade: <strong>Alta</strong></span>
              </div>
            </div>
          </div>
        )}

        <div className="workout-tabs">
          {['A', 'B', 'C', 'D'].map((letra) => (
            <button 
              key={letra} 
              className={`tab-btn ${activeTab === letra ? 'active' : ''}`}
              /* Chama a função que salva a aba na memória */
              onClick={() => handleTabChange(letra)}
            >
              Treino {letra}
            </button>
          ))}
        </div>

        <div className="selected-workout-header fade-in" key={activeTab}>
          <div className="workout-title-row">
            <Dumbbell size={20} color="var(--evolv-green)" />
            <h2>{rotinas[activeTab].nome}</h2>
          </div>
          <span className="workout-count">{rotinas[activeTab].exercicios.length} exercícios</span>
        </div>

        <div className="exercicios-list fade-in" key={`list-${activeTab}`}>
          {rotinas[activeTab].exercicios.map((ex) => (
            <div 
              key={ex.id} 
              className={`glass-card exercicio-item ${ex.concluido ? 'concluido' : ''}`} 
              onClick={() => navigate(`/detalhes/${ex.id}`)}
            >
              <div className="ex-icon" onClick={(e) => toggleExercicio(e, activeTab, ex.id)}>
                {ex.concluido 
                  ? <CheckCircle2 size={30} color="#000" fill="var(--evolv-green)" className="glow-icon-strong bounce-check" /> 
                  : <Circle size={30} color="var(--border-glass)" className="circle-hover" />
                }
              </div>
              
              <div className="ex-info">
                <h3 style={{ textDecoration: ex.concluido ? 'line-through' : 'none', color: ex.concluido ? 'var(--text-muted)' : '#fff' }}>
                  {ex.nome}
                </h3>
                <span className="detalhe-treino">{ex.detalhe}</span>
                <span className="carga-badge">Última: {ex.carga}</span>
              </div>
              <ChevronRight size={20} color={ex.concluido ? 'var(--evolv-green)' : 'var(--text-muted)'} />
            </div>
          ))}
        </div>

        <div className="treino-actions">
          {!isStarted ? (
            <button className="green-button start-btn" onClick={() => setIsStarted(true)}>
              <Play fill="#000" size={20} /> INICIAR TREINO
            </button>
          ) : (
            <button className="btn-glass-outline finish-btn" onClick={handleFinish} style={{borderColor: '#d32f2f', color: '#ff4d4d'}}>
              <CheckCircle2 size={20} /> FINALIZAR TREINO
            </button>
          )}
        </div>
        
        <div className="spacer"></div>
      </div>
      
      <BottomNav />
    </div>
  );
}