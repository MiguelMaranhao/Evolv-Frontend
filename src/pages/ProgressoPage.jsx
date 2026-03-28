import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Activity, Scale, Percent, Plus, Crosshair, AlertTriangle, CheckCircle2, Save, Target, RotateCcw, Droplet, Dumbbell } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import '../styles/ProgressoPage.css';

export default function ProgressoPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mapa');

  // ==========================================
  // ESTADOS: MODELO ANATÔMICO (Frente/Costas)
  // ==========================================
  const [modelView, setModelView] = useState('frontal'); 
  
  const [musculosStatus, setMusculosStatus] = useState({
    peitoral: 3, deltoides: 2, biceps: 3, abdominais: 2, quadriceps: 1,
    trapezio: 2, dorsais: 3, triceps: 2, lombar: 2, gluteos: 1, isquiotibiais: 2, panturrilhas: 1
  });

  const [showInputModal, setShowInputModal] = useState(false);
  const [currentMuscleData, setCurrentMuscleData] = useState({ name: '', key: '', series: 12, carga: 80, rpe: 8 });

  const nomesMusculos = {
    peitoral: 'Peitoral Maior', deltoides: 'Deltóides', biceps: 'Bíceps Braquial', abdominais: 'Core/Abdômen', quadriceps: 'Quadríceps',
    trapezio: 'Trapézio', dorsais: 'Dorsais (Costas)', triceps: 'Tríceps', lombar: 'Lombar', gluteos: 'Glúteos', isquiotibiais: 'Posterior de Coxa', panturrilhas: 'Panturrilhas'
  };

  // ==========================================
  // ESTADOS: MEDIDAS CORPORAIS E GRÁFICO
  // ==========================================
  const [showMedidasModal, setShowMedidasModal] = useState(false);
  const [inputMedidas, setInputMedidas] = useState({ peso: 76.5, bf: 14.2, altura: 1.75 });
  
  const [metricas, setMetricas] = useState({ 
    peso: 76.5, bf: 14.2, altura: 1.75,
    massaMagra: 65.6, imc: 25.0, ffmi: 21.4, agua: 2.6
  });

  const [historico, setHistorico] = useState([
    { mes: 'Out', peso: 74.0, mm: 62.5, bf: 15.5 },
    { mes: 'Nov', peso: 74.5, mm: 63.2, bf: 15.1 },
    { mes: 'Dez', peso: 75.0, mm: 64.0, bf: 14.8 },
    { mes: 'Jan', peso: 75.8, mm: 64.5, bf: 14.5 },
    { mes: 'Fev', peso: 76.2, mm: 65.0, bf: 14.3 },
    { mes: 'Mar', peso: 76.5, mm: 65.6, bf: 14.2 }
  ]);
  const [hoveredChartIndex, setHoveredChartIndex] = useState(null);

  // ==========================================
  // LÓGICA DE DADOS E ALGORITMOS PRO
  // ==========================================
  const openDataInput = (muscleKey) => {
    setCurrentMuscleData({
      name: nomesMusculos[muscleKey], key: muscleKey,
      series: musculosStatus[muscleKey] === 3 ? 15 : 10,
      carga: 50, rpe: 8
    });
    setShowInputModal(true);
  };

  const saveMuscleData = () => {
    const { series, carga, rpe, key } = currentMuscleData;
    const volumeTotal = series * carga;
    let novoNivel = 2; 
    
    if (volumeTotal > 1000 && rpe >= 8) novoNivel = 3; 
    else if (volumeTotal < 600 || rpe < 6) novoNivel = 1;

    setMusculosStatus(prev => ({ ...prev, [key]: novoNivel }));
    setShowInputModal(false);
  };

  const handleSaveMedidas = () => {
    const { peso, bf, altura } = inputMedidas;
    
    const gorduraKg = peso * (bf / 100);
    const mm = peso - gorduraKg;
    const imcCalc = peso / (altura * altura);
    const ffmiCalc = mm / (altura * altura); 
    const aguaCalc = peso * 0.035; 

    setMetricas({ 
      peso, bf, altura, 
      massaMagra: mm.toFixed(1), 
      imc: imcCalc.toFixed(1), 
      ffmi: ffmiCalc.toFixed(1),
      agua: aguaCalc.toFixed(1)
    });
    
    // Captura o mês real do navegador para o gráfico
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mesAtual = nomesMeses[new Date().getMonth()];

    setHistorico([...historico.slice(1), { mes: mesAtual, peso, mm: mm.toFixed(1), bf }]);
    setShowMedidasModal(false);
  };

  const getStatusColor = (nivel) => {
    if (nivel === 1) return '#ff4d4d'; 
    if (nivel === 2) return '#ffaa00'; 
    return '#3ab54a'; 
  };

  // Lógica Avançada do Rótulo do IMC
  const getImcLabel = (valorImc) => {
    const imc = parseFloat(valorImc);
    if (imc < 18.5) return 'Abaixo do peso (Atenção à Dieta)';
    if (imc >= 18.5 && imc < 24.9) return 'Peso Normal (Saudável)';
    if (imc >= 25 && imc < 29.9) return 'Sobrepeso (Atenção ao BF)';
    return 'Obesidade';
  };

  const totalMusculos = Object.keys(musculosStatus).length;
  const musculosEmEvolucao = Object.values(musculosStatus).filter(v => v === 3).length;
  const simetriaScore = Math.round((musculosEmEvolucao / totalMusculos) * 100);

  return (
    <div className="progresso-page fade-in">
      <header className="treino-header-modern">
        <div className="header-left">
          <span className="greeting">Análise de Desempenho</span>
          <h1 className="page-title">Evolução</h1>
        </div>
        <div className="header-right">
          <div className="calendar-icon-btn"><TrendingUp size={22} color="var(--evolv-green)" /></div>
        </div>
      </header>

      <div className="treino-content">
        <div className="workout-tabs">
          <button className={`tab-btn ${activeTab === 'mapa' ? 'active' : ''}`} onClick={() => setActiveTab('mapa')}>Mapa Muscular</button>
          <button className={`tab-btn ${activeTab === 'medidas' ? 'active' : ''}`} onClick={() => setActiveTab('medidas')}>Medidas & Índices</button>
        </div>

        {activeTab === 'mapa' ? (
          <div className="fade-in">
            <div className="model-controls">
              <span className="view-label">Visão: <strong>{modelView === 'frontal' ? 'Frontal' : 'Posterior'}</strong></span>
              <button className="rotate-btn outline-glow" onClick={() => setModelView(modelView === 'frontal' ? 'posterior' : 'frontal')}>
                <RotateCcw size={16} /> GIRAR MODELO
              </button>
            </div>

            <div className="scanner-container">
              <div className="scan-line"></div>
              <svg viewBox="0 0 200 400" className="human-model-svg">
                <path d="M 90 20 C 85 15, 115 15, 110 20 C 115 25, 115 45, 100 50 C 85 45, 85 25, 90 20 Z" className="body-part neutral" />
                <path d="M 90 50 L 110 50 L 115 65 L 85 65 Z" className="body-part neutral" />

                {modelView === 'frontal' ? (
                  <g className="fade-in">
                    <g className="body-part interactive" onClick={() => openDataInput('peitoral')}>
                      <path d="M 68 75 L 100 75 L 100 120 L 70 115 Z" fill={getStatusColor(musculosStatus.peitoral)} strokeOpacity="0.4" />
                      <path d="M 132 75 L 100 75 L 100 120 L 130 115 Z" fill={getStatusColor(musculosStatus.peitoral)} strokeOpacity="0.4" />
                      <path d="M 80 80 Q 100 85, 120 80 M 80 95 Q 100 100, 120 95" className="muscle-fibers" />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('deltoides')}>
                      <path d="M 65 75 Q 45 80, 52 105 L 70 110 Z" fill={getStatusColor(musculosStatus.deltoides)} />
                      <path d="M 135 75 Q 155 80, 148 105 L 130 110 Z" fill={getStatusColor(musculosStatus.deltoides)} />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('biceps')}>
                      <path d="M 49 105 Q 35 125, 45 150 L 58 150 L 68 110 Z" fill={getStatusColor(musculosStatus.biceps)} />
                      <path d="M 151 105 Q 165 125, 155 150 L 142 150 L 132 110 Z" fill={getStatusColor(musculosStatus.biceps)} />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('abdominais')}>
                      <rect x="78" y="125" width="44" height="60" rx="10" fill={getStatusColor(musculosStatus.abdominais)} />
                      <line x1="100" y1="130" x2="100" y2="180" className="abdominal-line" />
                      <line x1="82" y1="145" x2="118" y2="145" className="abdominal-line" />
                      <line x1="82" y1="160" x2="118" y2="160" className="abdominal-line" />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('quadriceps')}>
                      <path d="M 72 218 Q 55 250, 68 310 L 98 310 Q 102 250, 95 218 Z" fill={getStatusColor(musculosStatus.quadriceps)} />
                      <path d="M 128 218 Q 145 250, 132 310 L 102 310 Q 98 250, 105 218 Z" fill={getStatusColor(musculosStatus.quadriceps)} />
                      <path d="M 83 220 L 83 300 M 117 220 L 117 300" className="muscle-fibers" />
                    </g>
                  </g>
                ) : (
                  <g className="fade-in">
                    <g className="body-part interactive" onClick={() => openDataInput('trapezio')}>
                      <path d="M 85 65 L 115 65 L 128 85 L 100 110 L 72 85 Z" fill={getStatusColor(musculosStatus.trapezio)} />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('dorsais')}>
                      <path d="M 72 85 L 100 110 L 128 85 L 125 140 L 100 160 L 75 140 Z" fill={getStatusColor(musculosStatus.dorsais)} />
                      <path d="M 85 100 L 100 140 L 115 100" className="muscle-fibers" />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('triceps')}>
                      <path d="M 49 105 Q 35 125, 45 150 L 58 150 L 68 110 Z" fill={getStatusColor(musculosStatus.triceps)} />
                      <path d="M 151 105 Q 165 125, 155 150 L 142 150 L 132 110 Z" fill={getStatusColor(musculosStatus.triceps)} />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('lombar')}>
                      <path d="M 80 160 L 120 160 L 125 185 L 75 185 Z" fill={getStatusColor(musculosStatus.lombar)} />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('gluteos')}>
                      <path d="M 72 185 L 128 185 C 140 215, 110 225, 100 220 C 90 225, 60 215, 72 185 Z" fill={getStatusColor(musculosStatus.gluteos)} />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('isquiotibiais')}>
                      <path d="M 75 220 Q 65 250, 70 310 L 95 310 Q 95 250, 100 220 Z" fill={getStatusColor(musculosStatus.isquiotibiais)} />
                      <path d="M 125 220 Q 135 250, 130 310 L 105 310 Q 105 250, 100 220 Z" fill={getStatusColor(musculosStatus.isquiotibiais)} />
                      <path d="M 82 230 L 82 300 M 118 230 L 118 300" className="muscle-fibers" />
                    </g>
                    <g className="body-part interactive" onClick={() => openDataInput('panturrilhas')}>
                      <path d="M 68 315 C 50 340, 65 370, 72 390 L 88 390 Q 95 340, 88 315 Z" fill={getStatusColor(musculosStatus.panturrilhas)} />
                      <path d="M 132 315 C 150 340, 135 370, 128 390 L 112 390 Q 105 340, 112 315 Z" fill={getStatusColor(musculosStatus.panturrilhas)} />
                    </g>
                  </g>
                )}
                <path d="M 45 152 L 35 200 L 48 200 L 58 152 M 155 152 L 165 200 L 152 200 L 142 152" className="body-part neutral" />
              </svg>
            </div>

            <div className="glass-card legend-card">
              <div className="legend-item"><div className="color-dot" style={{background: 'var(--evolv-green)'}}></div>Hipertrofia</div>
              <div className="legend-item"><div className="color-dot" style={{background: '#ffaa00'}}></div>Manutenção</div>
              <div className="legend-item"><div className="color-dot" style={{background: '#ff4d4d'}}></div>Estagnação</div>
            </div>

            <div className="performance-summary">
              <div className="score-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle-progress" strokeDasharray={`${simetriaScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.5" className="percentage">{simetriaScore}%</text>
                </svg>
                <span>Score de Simetria</span>
              </div>
              <div className="score-details">
                <p><CheckCircle2 size={14} color="var(--evolv-green)"/> {musculosEmEvolucao} músculos evoluindo</p>
                <p><AlertTriangle size={14} color="#ff4d4d"/> Risco de Assimetria: <strong>{simetriaScore < 50 ? 'Alto' : 'Baixo'}</strong></p>
              </div>
            </div>

            <h3 className="section-title-sm mt-20">Diagnóstico Detalhado</h3>
            <div className="diagnostico-list">
              {Object.keys(musculosStatus).map(key => {
                if (musculosStatus[key] === 3 && modelView === 'frontal') return (
                  <div key={key} className="diag-item glass-card success fade-in">
                    <TrendingUp size={18} />
                    <div className="diag-text">
                      <strong>{nomesMusculos[key]}</strong>
                      <span>Sobrecarga progressiva mantida. Síntese proteica em alta.</span>
                    </div>
                  </div>
                );
                if (musculosStatus[key] === 1 && modelView === 'posterior') return (
                  <div key={key} className="diag-item glass-card danger fade-in">
                    <AlertTriangle size={18} />
                    <div className="diag-text">
                      <strong>{nomesMusculos[key]}</strong>
                      <span>Volume insuficiente de treino detectado. Ajuste o RPE para estimular as fibras.</span>
                    </div>
                  </div>
                );
                return null;
              })}
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <div className="metrics-grid-pro">
              <div className="glass-card metric-box"><Scale size={20} color="var(--text-light)" /><strong className="m-value">{metricas.peso} <small>kg</small></strong><span className="m-label">Peso Corporal</span></div>
              <div className="glass-card metric-box"><Percent size={20} color="var(--text-light)" /><strong className="m-value">{metricas.bf} <small>%</small></strong><span className="m-label">Body Fat (BF)</span></div>
              
              <div className="glass-card metric-box highlight-box"><Activity size={20} color="var(--evolv-green)" /><strong className="m-value">{metricas.massaMagra} <small>kg</small></strong><span className="m-label">Massa Magra</span></div>
              <div className="glass-card metric-box highlight-box"><Droplet size={20} color="#00d2ff" /><strong className="m-value">{metricas.agua} <small>L</small></strong><span className="m-label">Meta de Água</span></div>

              <div className="glass-card metric-box wide-box">
                <div className="index-info">
                  <span className="m-label">FFMI (Índice de Massa Livre de Gordura)</span>
                  <strong className="m-value green-text-glow">{metricas.ffmi}</strong>
                  <p className="index-desc">{metricas.ffmi > 22 ? 'Nível Atlítico/Avançado' : 'Nível Intermediário'}</p>
                </div>
              </div>
              <div className="glass-card metric-box wide-box">
                <div className="index-info">
                  <span className="m-label">IMC (Índice de Massa Corporal)</span>
                  <strong className="m-value">{metricas.imc}</strong>
                  <p className="index-desc">{getImcLabel(metricas.imc)}</p>
                </div>
              </div>
            </div>
            
            <button className="green-button mt-20 btn-avalia" onClick={() => setShowMedidasModal(true)}>
              <Plus size={20} style={{marginRight: '8px'}} /> NOVA AVALIAÇÃO FÍSICA
            </button>

            <h3 className="section-title-sm mt-30">Evolução de Massa Magra vs Peso</h3>
            <div className="glass-card chart-container-pro">
              <div className="interactive-chart">
                {historico.map((item, index) => {
                  const maxMm = Math.max(...historico.map(h => parseFloat(h.mm)));
                  const heightPercent = (parseFloat(item.mm) / maxMm) * 100;
                  
                  return (
                    <div key={index} className="chart-bar-group" onMouseEnter={() => setHoveredChartIndex(index)} onMouseLeave={() => setHoveredChartIndex(null)}>
                      <div className={`bar-fill ${index === historico.length - 1 ? 'current' : ''}`} style={{height: `${heightPercent}%`}}></div>
                      <span className="chart-label">{item.mes}</span>
                      
                      {hoveredChartIndex === index && (
                        <div className="chart-tooltip fade-in">
                          <strong>{item.peso}kg Total</strong>
                          <span>{item.mm}kg M.Magra</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div className="spacer"></div>
      </div>

      {showInputModal && (
        <div className="modal-overlay" onClick={() => setShowInputModal(false)}>
          <div className="data-input-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-pro">
              <div className="m-icon-wrapper"><Target size={24} color="var(--evolv-green)" /></div>
              <h3>Análise: {currentMuscleData.name}</h3>
            </div>
            <div className="modal-body-pro">
              <div className="input-group-pro">
                <label>Séries Totais na Semana</label>
                <input type="number" value={currentMuscleData.series} onChange={(e) => setCurrentMuscleData({...currentMuscleData, series: parseInt(e.target.value) || 0})} />
              </div>
              <div className="input-group-pro">
                <label>Carga Média Usada (kg)</label>
                <input type="number" value={currentMuscleData.carga} onChange={(e) => setCurrentMuscleData({...currentMuscleData, carga: parseInt(e.target.value) || 0})} />
              </div>
              <div className="input-group-pro">
                <label>Esforço Percebido (RPE 1-10)</label>
                <div className="rpe-slider-pro">
                    <input type="range" min="1" max="10" value={currentMuscleData.rpe} onChange={(e) => setCurrentMuscleData({...currentMuscleData, rpe: parseInt(e.target.value)})} />
                    <span className="rpe-value">{currentMuscleData.rpe}</span>
                </div>
              </div>
            </div>
            <div className="modal-actions-pro">
              <button className="btn-cancel-modal-pro" onClick={() => setShowInputModal(false)}>CANCELAR</button>
              <button className="btn-save-data-pro" onClick={saveMuscleData}><Save size={18} /> CALCULAR</button>
            </div>
          </div>
        </div>
      )}

      {showMedidasModal && (
        <div className="modal-overlay" onClick={() => setShowMedidasModal(false)}>
          <div className="data-input-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-pro">
              <div className="m-icon-wrapper" style={{background: 'rgba(0, 210, 255, 0.1)', borderColor: 'rgba(0, 210, 255, 0.3)'}}><Scale size={24} color="#00d2ff" /></div>
              <h3>Nova Avaliação Física</h3>
            </div>
            <div className="modal-body-pro">
              <div className="input-group-pro">
                <label>Sua Altura (metros)</label>
                <input type="number" step="0.01" value={inputMedidas.altura} onChange={(e) => setInputMedidas({...inputMedidas, altura: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="input-group-pro">
                <label>Peso Corporal Atual (kg)</label>
                <input type="number" step="0.1" value={inputMedidas.peso} onChange={(e) => setInputMedidas({...inputMedidas, peso: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="input-group-pro">
                <label>Percentual de Gordura (%)</label>
                <input type="number" step="0.1" value={inputMedidas.bf} onChange={(e) => setInputMedidas({...inputMedidas, bf: parseFloat(e.target.value) || 0})} />
              </div>
              <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px'}}>
                FFMI, IMC, Massa Magra e Água serão calculados pelo algoritmo.
              </p>
            </div>
            <div className="modal-actions-pro">
              <button className="btn-cancel-modal-pro" onClick={() => setShowMedidasModal(false)}>CANCELAR</button>
              <button className="btn-save-data-pro" style={{background: '#00d2ff', color: '#000'}} onClick={handleSaveMedidas}><CheckCircle2 size={18} /> SALVAR DADOS</button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}