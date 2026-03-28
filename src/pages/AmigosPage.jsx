import React, { useState } from 'react';
import { Search, Flame, Trophy, Medal, Dumbbell, Clock, ChevronRight, Plus, MapPin, Target, Activity, CheckCircle2, X, Calculator, AlertCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import '../styles/AmigosPage.css';

export default function AmigosPage() {
  const [activeTab, setActiveTab] = useState('feed'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [hypes, setHypes] = useState({}); 
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // ESTADO DO AVISO ESTILIZADO (TOAST)
  const [toastMessage, setToastMessage] = useState('');

  // ESTADO DOS USUÁRIOS
  const [usuarios, setUsuarios] = useState({
    'miguel': { id: 'miguel', nome: 'Miguel Maranhão', avatar: 'MM', isMe: true, isPremium: true, foco: 'Hipertrofia Seca', local: 'Campina Grande, PB', treinosSemana: 5, volumeSemana: 15.2, prs: ['Supino Reto 80kg', 'Agachamento 100kg'] },
    'morpheu': { id: 'morpheu', nome: 'Morpheu Capitulino', avatar: 'MC', isMe: false, isPremium: true, foco: 'Powerbuilding', local: 'Campina Grande, PB', treinosSemana: 4, volumeSemana: 18.5, prs: ['Terra 180kg', 'Agachamento 140kg'] },
    'kathelen': { id: 'kathelen', nome: 'Kathelen Vitória', avatar: 'KV', isMe: false, isPremium: false, foco: 'Recomposição Corporal', local: 'Campina Grande, PB', treinosSemana: 5, volumeSemana: 9.2, prs: ['Leg Press 150kg'] },
    'luiz': { id: 'luiz', nome: 'Luiz Carlos', avatar: 'LC', isMe: false, isPremium: false, foco: 'Ganho de Força', local: 'Campina Grande, PB', treinosSemana: 3, volumeSemana: 12.8, prs: ['Supino Inclinado 35kg'] },
    'jose': { id: 'jose', nome: 'José Vitor', avatar: 'JV', isMe: false, isPremium: true, foco: 'Hipertrofia', local: 'Campina Grande, PB', treinosSemana: 4, volumeSemana: 14.1, prs: ['Puxada Frente 75kg'] }
  });

  const [feed, setFeed] = useState([
    { id: 101, user: usuarios['morpheu'], tempo: 'Há 2 horas', treino: 'Pernas Pesado', duracao: '01:25', volume: 6.5, destaque: 'Levantamento Terra - 180kg' },
    { id: 102, user: usuarios['kathelen'], tempo: 'Há 4 horas', treino: 'Glúteos e Posterior', duracao: '01:10', volume: 3.2, destaque: 'Leg Press - 150kg' },
    { id: 103, user: usuarios['luiz'], tempo: 'Há 5 horas', treino: 'Peito e Ombro', duracao: '00:55', volume: 4.1, destaque: null },
    { id: 104, user: usuarios['jose'], tempo: 'Ontem', treino: 'Costas e Bíceps', duracao: '01:05', volume: 4.8, destaque: 'Remada Curvada - 80kg' }
  ]);

  // CALCULADORA DE TONELAGEM
  const [newPost, setNewPost] = useState({ treino: '', duracao: '01:00', destaque: '' });
  const [exerciciosAdicionados, setExerciciosAdicionados] = useState([]);
  const [exInput, setExInput] = useState({ nome: 'Supino Reto', sets: 4, reps: 10, peso: 60 });

  const listaPreDefinida = ["Supino Reto", "Agachamento", "Leg Press", "Puxada Frente", "Remada Curvada", "Desenvolvimento", "Rosca Direta", "Tríceps Pulley"];

  const addExercicioNaCalculadora = () => {
    if(!exInput.sets || !exInput.reps || !exInput.peso) {
      mostrarAviso("Preencha as séries, repetições e carga do exercício.");
      return;
    }
    setExerciciosAdicionados([exInput, ...exerciciosAdicionados]);
    setExInput({ ...exInput, sets: 4, reps: 10, peso: '' }); // Limpa o peso para o próximo
  };

  const removerExercicio = (index) => {
    const novaLista = [...exerciciosAdicionados];
    novaLista.splice(index, 1);
    setExerciciosAdicionados(novaLista);
  };

  const tonelagemTotal = exerciciosAdicionados.reduce((acc, curr) => acc + ((curr.sets * curr.reps * curr.peso) / 1000), 0);

  const ranking = Object.values(usuarios)
    .sort((a, b) => b.volumeSemana - a.volumeSemana)
    .map((user, index) => ({ pos: index + 1, user }));

  const toggleHype = (e, id) => {
    e.stopPropagation(); 
    setHypes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const mostrarAviso = (mensagem) => {
    setToastMessage(mensagem);
    setTimeout(() => { setToastMessage(''); }, 3500); // Some depois de 3.5 segundos
  };

  const handlePostarTreino = () => {
    // MUDANÇA AQUI: Substituímos o window.alert pelo nosso Toast nativo!
    if(!newPost.treino) {
      return mostrarAviso("Dê um nome para o seu foco de treino (Ex: Peito e Tríceps).");
    }
    if(exerciciosAdicionados.length === 0) {
      return mostrarAviso("Adicione ao menos um exercício na calculadora para registrar o volume.");
    }

    const postCriado = {
      id: Date.now(),
      user: usuarios['miguel'], 
      tempo: 'Agora mesmo',
      treino: newPost.treino,
      duracao: newPost.duracao,
      volume: tonelagemTotal.toFixed(1),
      destaque: newPost.destaque || null
    };
    setFeed([postCriado, ...feed]); 

    setUsuarios(prev => ({
      ...prev,
      'miguel': {
        ...prev['miguel'],
        volumeSemana: parseFloat((prev['miguel'].volumeSemana + tonelagemTotal).toFixed(1)),
        treinosSemana: prev['miguel'].treinosSemana + 1
      }
    }));

    setShowAddModal(false);
    setNewPost({ treino: '', duracao: '01:00', destaque: '' });
    setExerciciosAdicionados([]);
    setActiveTab('feed'); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const filteredFeed = feed.filter(post => post.user.nome.toLowerCase().includes(searchQuery.toLowerCase()) || post.treino.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRanking = ranking.filter(rank => rank.user.nome.toLowerCase().includes(searchQuery.toLowerCase()));

  const openUserProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  return (
    <div className="amigos-page fade-in">
      
      {/* AVISO TOAST ANIMADO NO TOPO */}
      {toastMessage && (
        <div className="toast-notification">
          <AlertCircle size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="treino-header-modern">
        <div className="header-left">
          <span className="greeting">Comunidade Evolv</span>
          <h1 className="page-title">Atletas</h1>
        </div>
        <div className="header-right">
          <div className="calendar-icon-btn">
            <Search size={22} color="var(--evolv-green)" />
          </div>
        </div>
      </header>

      <div className="treino-content">
        
        <div className="search-bar-container">
          <Search size={18} color="var(--text-muted)" className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou treino..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input glass-card"
          />
          {searchQuery && <X size={16} color="var(--text-muted)" className="clear-icon" onClick={() => setSearchQuery('')} />}
        </div>

        <div className="workout-tabs">
          <button className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>Atividades</button>
          <button className={`tab-btn ${activeTab === 'ranking' ? 'active' : ''}`} onClick={() => setActiveTab('ranking')}>Ranking Semanal</button>
        </div>

        {activeTab === 'feed' ? (
          <div className="feed-list fade-in">
            {filteredFeed.length === 0 ? (
              <div className="empty-state glass-card">
                <Search size={32} color="var(--border-glass)" />
                <p>Nenhum treino ou atleta encontrado com "{searchQuery}".</p>
              </div>
            ) : (
              filteredFeed.map((post) => (
                <div key={post.id} className="glass-card feed-card interactive-card fade-in" onClick={() => openUserProfile(post.user)}>
                  <div className="feed-header">
                    <div className="user-info">
                      <div className={`avatar ${post.user.isPremium ? 'premium-border' : ''}`}>{post.user.avatar}</div>
                      <div>
                        <h3 className="user-name">{post.user.nome}</h3>
                        <span className="post-time">{post.tempo}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)"/>
                  </div>

                  <div className="feed-body">
                    <h4 className="workout-name">{post.treino}</h4>
                    <div className="workout-stats-mini">
                      <div className="stat"><Dumbbell size={14} color="var(--text-muted)"/> {post.volume} Toneladas</div>
                      <div className="stat"><Clock size={14} color="var(--text-muted)"/> {post.duracao}</div>
                    </div>
                    {post.destaque && (
                      <div className="pr-badge">
                        <Trophy size={14} color="#ffaa00" />
                        <span><strong>Destaque:</strong> {post.destaque}</span>
                      </div>
                    )}
                  </div>

                  <div className="feed-actions">
                    <button className={`hype-btn ${hypes[post.id] ? 'hyped' : ''}`} onClick={(e) => toggleHype(e, post.id)}>
                      <Flame size={18} fill={hypes[post.id] ? "var(--evolv-green)" : "transparent"} />
                      <span>{hypes[post.id] ? 'Você deu Hype!' : 'Dar um Hype'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="ranking-list fade-in">
            <div className="ranking-header glass-card">
              <Medal size={24} color="#ffaa00" />
              <div>
                <h3>Batalha de Volume</h3>
                <p>Tonelagem total levantada nesta semana em CG.</p>
              </div>
            </div>

            {filteredRanking.length === 0 ? (
               <div className="empty-state glass-card"><p>Nenhum atleta encontrado no ranking.</p></div>
            ) : (
              filteredRanking.map((rank) => (
                <div key={rank.pos} className={`glass-card ranking-item interactive-card fade-in ${rank.user.isMe ? 'is-me' : ''}`} onClick={() => openUserProfile(rank.user)}>
                  <div className="rank-pos">
                    {rank.pos === 1 ? <span className="gold">1</span> : 
                     rank.pos === 2 ? <span className="silver">2</span> : 
                     rank.pos === 3 ? <span className="bronze">3</span> : 
                     <span>{rank.pos}</span>}
                  </div>
                  <div className={`avatar rank-avatar ${rank.user.isPremium ? 'premium-border' : ''}`}>{rank.user.avatar}</div>
                  <div className="rank-info">
                    <h4 className="rank-name">{rank.user.nome} {rank.user.isMe && '(Você)'}</h4>
                    <span className="rank-workouts">{rank.user.treinosSemana} treinos concluídos</span>
                  </div>
                  <div className="rank-score">
                    <strong>{rank.user.volumeSemana.toFixed(1)}</strong>
                    <small>Ton</small>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="spacer"></div>
      </div>

      <button className="fab-add-workout outline-glow" onClick={() => setShowAddModal(true)}>
        <Plus size={24} color="#000" />
      </button>

      {/* MODAL DE COMPARTILHAR TREINO REDESENHADO */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="data-input-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-pro">
              <div className="m-icon-wrapper" style={{background: 'var(--evolv-green)', borderColor: 'var(--evolv-green)'}}>
                <Activity size={24} color="#000" />
              </div>
              <h3>Compartilhar Treino</h3>
            </div>
            
            <div className="modal-body-pro modal-body-scroll">
              <div className="input-group-pro">
                <label>Foco do Treino</label>
                <input type="text" placeholder="Ex: Peito e Tríceps" value={newPost.treino} onChange={(e) => setNewPost({...newPost, treino: e.target.value})} />
              </div>
              
              <div className="grid-2-col">
                <div className="input-group-pro">
                  <label>Duração</label>
                  <input type="text" placeholder="Ex: 01:15" value={newPost.duracao} onChange={(e) => setNewPost({...newPost, duracao: e.target.value})} />
                </div>
                <div className="input-group-pro">
                  <label>Destaque / PR (Opcional)</label>
                  <input type="text" placeholder="Ex: Supino - 100kg" value={newPost.destaque} onChange={(e) => setNewPost({...newPost, destaque: e.target.value})} />
                </div>
              </div>

              {/* CALCULADORA DE TONELAGEM REDESENHADA (CLARA E LIMPA) */}
              <div className="calc-section">
                <div className="calc-header">
                  <label><Calculator size={14} /> Calculadora de Volume</label>
                  <span className="calc-total">{tonelagemTotal.toFixed(1)} Ton</span>
                </div>
                
                <div className="calc-inputs-container">
                  <select value={exInput.nome} onChange={(e) => setExInput({...exInput, nome: e.target.value})} className="calc-select">
                    {listaPreDefinida.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
                  
                  {/* NOVOS INPUTS SUPER CLAROS */}
                  <div className="calc-inputs-grid">
                    <div className="input-col">
                      <label>SÉRIES</label>
                      <input type="number" placeholder="0" value={exInput.sets} onChange={(e) => setExInput({...exInput, sets: parseInt(e.target.value) || ''})} />
                    </div>
                    <span className="math-sign">x</span>
                    <div className="input-col">
                      <label>REPS</label>
                      <input type="number" placeholder="0" value={exInput.reps} onChange={(e) => setExInput({...exInput, reps: parseInt(e.target.value) || ''})} />
                    </div>
                    <span className="math-sign">x</span>
                    <div className="input-col">
                      <label>CARGA (KG)</label>
                      <input type="number" placeholder="0" value={exInput.peso} onChange={(e) => setExInput({...exInput, peso: parseInt(e.target.value) || ''})} />
                    </div>
                  </div>
                  
                  {/* BOTÃO DE ADICIONAR DESTACADO */}
                  <button className="btn-add-ex-full" onClick={addExercicioNaCalculadora}>
                    <Plus size={16} /> ADICIONAR AO CÁLCULO
                  </button>
                </div>

                {exerciciosAdicionados.length > 0 && (
                  <ul className="ex-added-list">
                    {exerciciosAdicionados.map((ex, index) => (
                      <li key={index}>
                        <span>{ex.nome} <small>({ex.sets}x{ex.reps} - {ex.peso}kg)</small></span>
                        <button className="btn-remove-ex" onClick={() => removerExercicio(index)}><X size={16}/></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>

            <div className="modal-actions-pro">
              <button className="btn-cancel-modal-pro" onClick={() => setShowAddModal(false)}>CANCELAR</button>
              <button className="btn-save-data-pro" onClick={handlePostarTreino}><CheckCircle2 size={18} /> POSTAR TREINO</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PERFIL */}
      {showProfileModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="athlete-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-cover">
              <div className={`profile-avatar ${selectedUser.isPremium ? 'premium-glow' : ''}`}>
                {selectedUser.avatar}
              </div>
            </div>
            <div className="profile-header-info">
              <h2>{selectedUser.nome} {selectedUser.isPremium && <Trophy size={16} color="#ffaa00" style={{marginLeft:'5px'}}/>}</h2>
              <p className="profile-location"><MapPin size={14} color="var(--evolv-green)" /> {selectedUser.local}</p>
            </div>
            <div className="profile-stats-grid">
              <div className="p-stat-box">
                <Target size={20} color="var(--evolv-green)" />
                <span>Foco Atual</span>
                <strong>{selectedUser.foco}</strong>
              </div>
              <div className="p-stat-box">
                <Activity size={20} color="#00d2ff" />
                <span>Volume/Sem</span>
                <strong>{selectedUser.volumeSemana.toFixed(1)} Ton</strong>
              </div>
            </div>
            <div className="profile-prs">
              <h3 className="pr-title">Melhores Cargas (PRs)</h3>
              <ul className="pr-list">
                {selectedUser.prs.map((pr, index) => (
                  <li key={index}><Medal size={16} color="#ffaa00"/> {pr}</li>
                ))}
              </ul>
            </div>
            <button className="btn-close-profile" onClick={() => setShowProfileModal(false)}>FECHAR PERFIL</button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}