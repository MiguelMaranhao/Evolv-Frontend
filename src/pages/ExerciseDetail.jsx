import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Trash2, Plus, ArrowLeft, Target, Zap, AlertTriangle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import '../styles/ExerciseDetail.css';

export default function ExerciseDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const exId = id || "1";

  const [exercicio, setExercicio] = useState({ titulo: "Carregando...", subtitulo: "", rm: 0, max: 0, descansoIdeal: 90 });
  const [series, setSeries] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serieToDelete, setSerieToDelete] = useState(null);

  useEffect(() => {
    // BANCO DE DADOS V2 - COMPLETO COM TODOS OS TREINOS (A, B, C, D)
    let db = JSON.parse(localStorage.getItem('evolv_db_v2'));
    if (!db) {
      db = {
        "1": { titulo: "Supino Reto", subtitulo: "Barra Livre", videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", rm: 78, max: 64, descansoIdeal: 90 },
        "2": { titulo: "Supino Inclinado", subtitulo: "Halteres", videoUrl: "https://www.youtube.com/embed/0GWe5EA-k-4", rm: 32, max: 28, descansoIdeal: 90 },
        "3": { titulo: "Crucifixo Máquina", subtitulo: "Peck Deck", videoUrl: "https://www.youtube.com/embed/eGjt4jcEA_U", rm: 55, max: 45, descansoIdeal: 60 },
        "4": { titulo: "Tríceps Pulley", subtitulo: "Cabo com Corda", videoUrl: "https://www.youtube.com/embed/vB5OHsJ3EME", rm: 42, max: 35, descansoIdeal: 60 },
        "5": { titulo: "Puxada Frente", subtitulo: "Polia Alta", videoUrl: "https://www.youtube.com/embed/JGeY8q5b1t8", rm: 82, max: 65, descansoIdeal: 90 },
        "6": { titulo: "Remada Curvada", subtitulo: "Barra Livre", videoUrl: "https://www.youtube.com/embed/9efgcAjQe7E", rm: 88, max: 70, descansoIdeal: 90 },
        "7": { titulo: "Rosca Direta", subtitulo: "Barra W", videoUrl: "https://www.youtube.com/embed/kwG2ipFRgfo", rm: 38, max: 30, descansoIdeal: 60 },
        "8": { titulo: "Agachamento Livre", subtitulo: "Barra Livre", videoUrl: "https://www.youtube.com/embed/gcNh17Ckjgg", rm: 125, max: 100, descansoIdeal: 120 },
        "9": { titulo: "Leg Press 45", subtitulo: "Máquina", videoUrl: "https://www.youtube.com/embed/IZxyjW7XnGQ", rm: 250, max: 200, descansoIdeal: 120 },
        "10": { titulo: "Cadeira Extensora", subtitulo: "Máquina", videoUrl: "https://www.youtube.com/embed/YyvSfVjQeL0", rm: 88, max: 70, descansoIdeal: 60 },
        "11": { titulo: "Desenvolvimento", subtitulo: "Halteres", videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog", rm: 30, max: 24, descansoIdeal: 90 },
        "12": { titulo: "Elevação Lateral", subtitulo: "Halteres", videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo", rm: 18, max: 14, descansoIdeal: 60 },
        "13": { titulo: "Abdominal Máquina", subtitulo: "Máquina", videoUrl: "https://www.youtube.com/embed/2_eAuJ3P32Y", rm: 56, max: 45, descansoIdeal: 60 }
      };
      localStorage.setItem('evolv_db_v2', JSON.stringify(db));
    }
    setExercicio(db[exId]);

    // Carrega as séries específicas deste exercício
    let storedSeries = JSON.parse(localStorage.getItem(`evolv_series_v2_${exId}`));
    if (!storedSeries) {
      // Deixamos vazio para os novos exercícios!
      storedSeries = [];
      localStorage.setItem(`evolv_series_v2_${exId}`, JSON.stringify(storedSeries));
    }
    setSeries(storedSeries);
  }, [exId]);

  const alternarSerie = (idSerie) => {
    const novasSeries = series.map(s => s.id === idSerie ? { ...s, concluida: !s.concluida } : s);
    setSeries(novasSeries);
    localStorage.setItem(`evolv_series_v2_${exId}`, JSON.stringify(novasSeries));
  };

  const abrirModalDelecao = (e, idSerie) => {
    e.stopPropagation();
    setSerieToDelete(idSerie);
    setShowDeleteModal(true);
  };

  const confirmarDelecao = () => {
    if (serieToDelete) {
      const filtradas = series.filter(s => s.id !== serieToDelete);
      const renumeradas = filtradas.map((s, index) => ({ ...s, numero: index + 1 }));
      setSeries(renumeradas);
      localStorage.setItem(`evolv_series_v2_${exId}`, JSON.stringify(renumeradas));
    }
    setShowDeleteModal(false);
    setSerieToDelete(null);
  };

  const cancelarDelecao = () => {
    setShowDeleteModal(false);
    setSerieToDelete(null);
  };

  return (
    <div className="exercise-detail-page fade-in">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate('/treino')}>
          <ArrowLeft size={24} color="#fff" />
        </button>
        <div className="title-group">
          <h1 className="ex-title">{exercicio.titulo}</h1>
          <span className="ex-subtitle">{exercicio.subtitulo}</span>
        </div>
      </header>

      <div className="content-scroll detail-layout">
        
        <div className="glass-card video-container">
          {exercicio.videoUrl && (
            <iframe width="100%" height="210" src={`${exercicio.videoUrl}?modestbranding=1&rel=0`} title="Execução" frameBorder="0" allowFullScreen></iframe>
          )}
          <div className="biomechanics-info">
            <p className="execution-tip">
              <Target size={14} color="var(--evolv-green)" style={{ flexShrink: 0, marginTop: '2px' }} /> 
              <span><strong>Foco:</strong> Mantenha a amplitude máxima e controle a fase excêntrica (descida).</span>
            </p>
          </div>
        </div>

        <div className="glass-card performance-grid">
          <div className="perf-item"><span className="perf-label">1RM</span><strong className="perf-value green-text-glow">{exercicio.rm} <small>kg</small></strong></div>
          <div className="perf-divider"></div>
          <div className="perf-item"><span className="perf-label">Carga Max</span><strong className="perf-value">{exercicio.max} <small>kg</small></strong></div>
          <div className="perf-divider"></div>
          <div className="perf-item"><span className="perf-label">Descanso</span><strong className="perf-value">{exercicio.descansoIdeal} <small>s</small></strong></div>
        </div>

        <div className="section-header">
          <p className="section-label" style={{ margin: 0 }}>SÉRIES DE HOJE</p>
        </div>
        
        <div className="series-list">
          {series.length === 0 ? (
             <p style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '20px 0'}}>Nenhuma série registrada hoje.</p>
          ) : (
            series.map((serie) => (
              <div 
                key={serie.id} 
                className={`glass-card series-item ${serie.concluida ? 'done' : 'pending'}`}
                onClick={() => alternarSerie(serie.id)}
                style={{ cursor: 'pointer' }}
              >
                {serie.concluida ? (
                  <CheckCircle2 color="#000" fill="var(--evolv-green)" size={24} className="glow-icon-strong" />
                ) : (
                  <div className="empty-circle-neon"></div>
                )}
                
                <div className="series-info">
                  <strong>Série {serie.numero} {serie.concluida ? '' : '(Meta)'}</strong>
                  <span>{serie.peso}kg x {serie.reps} reps {serie.falha && <Zap size={12} color="#ffaa00" />}</span>
                </div>
                
                <button className="icon-btn" onClick={(e) => abrirModalDelecao(e, serie.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <button className="green-button outline-glow" onClick={() => navigate(`/registro-serie/${exId}`)}>
          <Plus size={20} /> REGISTRAR SÉRIE
        </button>

        <div className="spacer"></div>
      </div>
      
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelarDelecao}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrapper">
              <AlertTriangle size={32} />
            </div>
            <h3>Excluir Série?</h3>
            <p>Tem certeza que deseja apagar o registro desta série? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={cancelarDelecao}>CANCELAR</button>
              <button className="btn-confirm-delete" onClick={confirmarDelecao}>EXCLUIR</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}