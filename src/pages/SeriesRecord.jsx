import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Play, Square, RotateCcw, Check, CheckCircle2, Zap, Target } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import '../styles/SeriesRecord.css';

export default function SeriesRecord() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const exId = id || "1";

  const [exercicio, setExercicio] = useState({ titulo: "Carregando...", max: 60, descansoIdeal: 90 });
  const [peso, setPeso] = useState(60);
  const [reps, setReps] = useState(10);
  const [rpe, setRpe] = useState(8); 
  
  const totalSeries = 3;
  const [serieAtual, setSerieAtual] = useState(1);
  const [exercicioFinalizado, setExercicioFinalizado] = useState(false);
  const [bateuRecorde, setBateuRecorde] = useState(false);

  const [tempoDescanso, setTempoDescanso] = useState(90);
  const [timerAtivo, setTimerAtivo] = useState(false);

  // Lê os dados ao abrir e ajusta os inputs Iniciais
  useEffect(() => {
    const db = JSON.parse(localStorage.getItem('evolv_db_v2')) || {};
    if(db[exId]) {
      setExercicio(db[exId]);
      setPeso(db[exId].max || 60); 
      setTempoDescanso(db[exId].descansoIdeal || 90);
    }
  }, [exId]);

  const rmProjetado = Math.round(peso * (1 + reps / 30));

  useEffect(() => {
    let intervalo = null;
    if (timerAtivo && tempoDescanso > 0) {
      intervalo = setInterval(() => setTempoDescanso((t) => t - 1), 1000);
    } else if (tempoDescanso === 0) {
      setTimerAtivo(false);
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [timerAtivo, tempoDescanso]);

  const formatarTempo = (seg) => {
    return `${Math.floor(seg / 60).toString().padStart(2, '0')}:${(seg % 60).toString().padStart(2, '0')}`;
  };

  const pularDescanso = () => {
    setTimerAtivo(false);
    setTempoDescanso(0);
  };

  const handleSalvarSerie = () => {
    const db = JSON.parse(localStorage.getItem('evolv_db_v2')) || {};
    const seriesDoExercicio = JSON.parse(localStorage.getItem(`evolv_series_v2_${exId}`)) || [];

    if (db[exId]) {
      if (peso > db[exId].max) {
        db[exId].max = peso;
        setBateuRecorde(true);
      }
      if (rmProjetado > db[exId].rm) {
        db[exId].rm = rmProjetado;
      }
      localStorage.setItem('evolv_db_v2', JSON.stringify(db)); 
    }

    const novaSerieRealizada = {
      id: Date.now(), 
      numero: seriesDoExercicio.length + 1,
      peso: peso.toString(),
      reps: reps.toString(),
      concluida: true,
      falha: rpe >= 9
    };
    seriesDoExercicio.push(novaSerieRealizada);
    localStorage.setItem(`evolv_series_v2_${exId}`, JSON.stringify(seriesDoExercicio));

    if (serieAtual < totalSeries) {
      setSerieAtual(serieAtual + 1);
      // Reseta o cronômetro baseando-se no tempo ideal daquele exercício
      setTempoDescanso(exercicio.descansoIdeal || 90);
      setTimerAtivo(true);
    } else {
      setExercicioFinalizado(true);
      setTimerAtivo(false);
    }
  };

  return (
    <div className="series-record-page fade-in">
      <header className="clean-header">
        <button className="icon-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={28} color="#fff" />
        </button>
        <div className="header-info">
          <h1 className="ex-title">{exercicio.titulo}</h1>
          <span className="ex-subtitle">Registro de Carga</span>
        </div>
      </header>

      <div className="content-scroll record-layout">
        <div className="sets-timeline-container">
          <div className="sets-timeline">
            {[1, 2, 3].map((num) => {
              const concluida = num < serieAtual || exercicioFinalizado;
              const atual = num === serieAtual && !exercicioFinalizado;
              return (
                <div key={num} style={{display: 'contents'}}>
                  <div className={`set-circle ${concluida ? 'concluida' : atual ? 'atual' : 'pendente'}`} onClick={() => !exercicioFinalizado && setSerieAtual(num)}>
                    {concluida ? <Check size={16} strokeWidth={3} /> : num}
                  </div>
                  {num !== 3 && <div className={`set-line ${concluida ? 'concluida' : ''}`}></div>}
                </div>
              );
            })}
          </div>
          <p className="timeline-status">
            {exercicioFinalizado ? "Treino finalizado" : `Série ${serieAtual} de ${totalSeries}`}
          </p>
        </div>

        {exercicioFinalizado ? (
          <div className="glass-card success-card fade-in">
            <CheckCircle2 size={70} color="var(--evolv-green)" className="pulse-icon" />
            <h2>Concluído com Sucesso!</h2>
            {bateuRecorde && (
               <p style={{color: '#ffaa00', fontWeight: 'bold', margin: '10px 0'}}>🎉 NOVO RECORDE DE CARGA: {peso}kg!</p>
            )}
            <button className="green-button full-width mt-20" onClick={() => navigate(`/detalhes/${exId}`)}>
              VOLTAR AOS DETALHES
            </button>
          </div>
        ) : (
          <div className="fade-in">
            
            <div className="target-card">
              <Target size={18} color="var(--text-muted)" />
              <div>
                <span className="target-label">Seu Recorde Atual (PR):</span>
                <strong className="target-value">{exercicio.max}kg</strong>
              </div>
            </div>

            <div className="live-rm-badge">
              <Zap size={16} color="#ffaa00" />
              <span>1RM Projetado: <strong>{rmProjetado} kg</strong></span>
            </div>

            <div className="glass-card input-panel">
              <p className="panel-title">CARGA TOTAL (KG)</p>
              <div className="stepper-modern">
                <button className="stepper-btn btn-minus" onClick={() => setPeso(p => p > 0 ? p - 1 : 0)}>-</button>
                <div className="value-display-modern">{peso}</div>
                <button className="stepper-btn btn-plus" onClick={() => setPeso(p => p + 1)}>+</button>
              </div>
            </div>

            <div className="glass-card input-panel">
              <p className="panel-title">REPETIÇÕES</p>
              <div className="stepper-modern">
                <button className="stepper-btn btn-minus" onClick={() => setReps(r => r > 0 ? r - 1 : 0)}>-</button>
                <div className="value-display-modern">{reps}</div>
                <button className="stepper-btn btn-plus" onClick={() => setReps(r => r + 1)}>+</button>
              </div>
              <div className="quick-chips">
                {[8, 10, 12, 15].map(num => (
                  <button key={num} className={`chip ${reps === num ? 'active' : ''}`} onClick={() => setReps(num)}>{num}</button>
                ))}
              </div>
            </div>

            <div className="glass-card input-panel">
              <p className="panel-title" style={{marginBottom: '10px'}}>ESFORÇO PERCEBIDO (RPE)</p>
              <div className="rpe-scale">
                {[6, 7, 8, 9, 10].map(val => (
                  <button key={val} className={`rpe-btn ${rpe === val ? `active-${val}` : ''}`} onClick={() => setRpe(val)}>{val}</button>
                ))}
              </div>
            </div>

            <div className={`glass-card timer-panel ${timerAtivo ? 'timer-active-panel' : ''}`}>
              <div className="timer-header">
                <p className="panel-title">{timerAtivo ? "DESCANSANDO..." : "DESCANSO IDEAL"}</p>
                {timerAtivo && <button className="skip-btn" onClick={pularDescanso}>Pular</button>}
              </div>
              <div className={`timer-display-huge ${timerAtivo ? 'timer-running' : ''}`}>
                {formatarTempo(tempoDescanso)}
              </div>
              <div className="timer-controls">
                <button className="timer-icon-btn reset" onClick={() => { setTimerAtivo(false); setTempoDescanso(exercicio.descansoIdeal || 90); }}>
                  <RotateCcw size={20} />
                </button>
                <button className={`timer-action-btn ${timerAtivo ? 'pause' : 'play'}`} onClick={() => setTimerAtivo(!timerAtivo)}>
                  {timerAtivo ? <Square fill="#000" size={20} /> : <Play fill="#000" size={24} style={{marginLeft: '4px'}}/>}
                </button>
              </div>
            </div>

            <div className="bottom-action-area">
              <button className={`green-button save-btn ${timerAtivo ? 'btn-resting' : ''}`} onClick={handleSalvarSerie}>
                <Save size={20} /> {serieAtual === totalSeries ? "FINALIZAR EXERCÍCIO" : timerAtivo ? "CONTINUAR DESCANSO" : "SALVAR E DESCANSAR"}
              </button>
            </div>
          </div>
        )}
        <div className="spacer"></div>
      </div>
    </div>
  );
}