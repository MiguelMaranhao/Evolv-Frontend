import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Star, Ruler, HelpCircle, LogOut, Edit3, Shield, MapPin, Target, ChevronRight, CheckCircle2, Bell, BellOff, Lock, Unlock, AlertTriangle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import '../styles/PerfilPage.css';

export default function PerfilPage() {
  const navigate = useNavigate();
  
  // Estado Principal do Usuário
  const [userData, setUserData] = useState({
    nome: 'Miguel Maranhão',
    email: 'miguel@evolv.app',
    local: 'Campina Grande, PB',
    foco: 'Hipertrofia Seca',
    altura: 1.76,
    pesoMeta: 80.0,
    isPremium: true
  });

  // Estado das Configurações Funcionais do App
  const [preferences, setPreferences] = useState({
    unidade: 'Kg / cm',
    notificacoesAtivas: true,
    perfilPrivado: false
  });

  // Modais
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editForm, setEditForm] = useState({ ...userData });
  const [toastMessage, setToastMessage] = useState('');

  const mostrarAviso = (mensagem) => {
    setToastMessage(mensagem);
    setTimeout(() => { setToastMessage(''); }, 3000);
  };

  // ==========================================
  // FUNÇÕES DE INTERAÇÃO 
  // ==========================================
  const handleSaveProfile = () => {
    setUserData(editForm);
    setShowEditModal(false);
    mostrarAviso("Perfil atualizado com sucesso!");
  };

  const togglePremium = () => {
    const novoStatus = !userData.isPremium;
    setUserData(prev => ({ ...prev, isPremium: novoStatus }));
    mostrarAviso(novoStatus ? "Bem-vindo ao Evolv Pro! Selo ativado." : "Assinatura Pro cancelada.");
  };

  const togglePrivacidade = () => {
    const novoStatus = !preferences.perfilPrivado;
    setPreferences(prev => ({ ...prev, perfilPrivado: novoStatus }));
    mostrarAviso(novoStatus ? "Seu perfil agora é Privado." : "Seu perfil agora é Público.");
  };

  const toggleUnidade = () => {
    const novaUnidade = preferences.unidade === 'Kg / cm' ? 'Lbs / in' : 'Kg / cm';
    setPreferences(prev => ({ ...prev, unidade: novaUnidade }));
    mostrarAviso(`Unidade alterada para ${novaUnidade}.`);
  };

  const toggleNotificacoes = () => {
    const novoStatus = !preferences.notificacoesAtivas;
    setPreferences(prev => ({ ...prev, notificacoesAtivas: novoStatus }));
    mostrarAviso(novoStatus ? "Notificações ativadas." : "Notificações silenciadas.");
  };

  const handleAjuda = () => {
    mostrarAviso("Conectando ao Suporte do Grupo Vitalis...");
  };

  // MÁGICA DO LOGOUT NATIVO
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <div className="perfil-page fade-in">
      
      {/* TOAST DE NOTIFICAÇÃO */}
      {toastMessage && (
        <div className="toast-notification success-toast">
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="treino-header-modern">
        <div className="header-left">
          <span className="greeting">Painel de Controle</span>
          <h1 className="page-title">Meu Perfil</h1>
        </div>
        <div className="header-right">
          <div className="calendar-icon-btn" onClick={() => setShowEditModal(true)}>
            <Edit3 size={20} color="var(--evolv-green)" />
          </div>
        </div>
      </header>

      <div className="treino-content">
        
        {/* CARD PRINCIPAL DO USUÁRIO */}
        <div className="glass-card user-main-card">
          <div className={`user-avatar-large ${userData.isPremium ? 'premium-glow' : ''}`}>
            {userData.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div className="user-main-info">
            <h2>{userData.nome} {userData.isPremium && <Star size={18} color="#ffaa00" fill="#ffaa00" style={{marginLeft: '5px'}}/>}</h2>
            <p className="user-email">{userData.email}</p>
            <div className="user-badges">
              <span className="badge"><MapPin size={12}/> {userData.local}</span>
              <span className="badge highlight-badge"><Target size={12}/> {userData.foco}</span>
            </div>
          </div>
        </div>

        {/* ESTATÍSTICAS RÁPIDAS */}
        <div className="quick-stats-row">
          <div className="glass-card q-stat">
            <span className="q-label">Treinos</span>
            <strong className="q-value">142</strong>
          </div>
          <div className="glass-card q-stat">
            <span className="q-label">Sequência</span>
            <strong className="q-value">5 <small>Sem</small></strong>
          </div>
          <div className="glass-card q-stat">
            <span className="q-label">Meta Peso</span>
            <strong className="q-value">{userData.pesoMeta} <small>{preferences.unidade.split(' ')[0].toLowerCase()}</small></strong>
          </div>
        </div>

        {/* LISTAS DE CONFIGURAÇÕES */}
        <div className="settings-section">
          <h3 className="section-title-sm">Minha Conta</h3>
          <div className="glass-card settings-list">
            <div className="setting-item" onClick={() => setShowEditModal(true)}>
              <div className="s-icon"><User size={18} color="var(--text-light)"/></div>
              <span className="s-text">Editar Perfil</span>
              <ChevronRight size={18} color="var(--text-muted)"/>
            </div>
            
            <div className="setting-item" onClick={togglePremium}>
              <div className="s-icon"><Star size={18} color={userData.isPremium ? "#ffaa00" : "var(--text-light)"}/></div>
              <span className="s-text">Assinatura Evolv Pro</span>
              <span className={`s-status ${userData.isPremium ? 'premium' : 'inactive'}`}>
                {userData.isPremium ? 'Ativo' : 'Inativo'}
              </span>
              <ChevronRight size={18} color="var(--text-muted)"/>
            </div>

            <div className="setting-item" onClick={togglePrivacidade}>
              <div className="s-icon">
                {preferences.perfilPrivado ? <Lock size={18} color="#ffaa00"/> : <Unlock size={18} color="var(--evolv-green)"/>}
              </div>
              <span className="s-text">Privacidade da Conta</span>
              <span className="s-status">{preferences.perfilPrivado ? 'Privado' : 'Público'}</span>
              <ChevronRight size={18} color="var(--text-muted)"/>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="section-title-sm">Preferências do App</h3>
          <div className="glass-card settings-list">
            <div className="setting-item" onClick={toggleUnidade}>
              <div className="s-icon"><Ruler size={18} color="var(--text-light)"/></div>
              <span className="s-text">Unidades de Medida</span>
              <span className="s-status">{preferences.unidade}</span>
              <ChevronRight size={18} color="var(--text-muted)"/>
            </div>

            <div className="setting-item" onClick={toggleNotificacoes}>
              <div className="s-icon">
                {preferences.notificacoesAtivas ? <Bell size={18} color="var(--evolv-green)"/> : <BellOff size={18} color="var(--text-light)"/>}
              </div>
              <span className="s-text">Notificações</span>
              <span className="s-status">{preferences.notificacoesAtivas ? 'Ativadas' : 'Silenciadas'}</span>
              <ChevronRight size={18} color="var(--text-muted)"/>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="section-title-sm">Suporte Grupo Vitalis</h3>
          <div className="glass-card settings-list">
            <div className="setting-item" onClick={handleAjuda}>
              <div className="s-icon"><HelpCircle size={18} color="var(--text-light)"/></div>
              <span className="s-text">Central de Ajuda</span>
              <ChevronRight size={18} color="var(--text-muted)"/>
            </div>
          </div>
        </div>

        {/* BOTÃO DE LOGOUT */}
        <button className="btn-logout outline-glow-danger" onClick={() => setShowLogoutModal(true)}>
          <LogOut size={20} /> SAIR DA CONTA
        </button>

        {/* ASSINATURA GRUPO VITALIS */}
        <div className="app-version">
          <p>Evolv App v2.5.0</p>
          <span>Desenvolvido por <strong>Grupo Vitalis</strong></span>
        </div>

        <div className="spacer"></div>
      </div>

      {/* MODAL DE EDIÇÃO DE PERFIL */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="data-input-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-pro">
              <div className="m-icon-wrapper" style={{background: 'var(--evolv-green)', borderColor: 'var(--evolv-green)'}}>
                <Edit3 size={24} color="#000" />
              </div>
              <h3>Editar Perfil</h3>
            </div>
            
            <div className="modal-body-pro modal-body-scroll">
              <div className="input-group-pro">
                <label>Nome Completo</label>
                <input type="text" value={editForm.nome} onChange={(e) => setEditForm({...editForm, nome: e.target.value})} />
              </div>
              <div className="input-group-pro">
                <label>Localização (Cidade, UF)</label>
                <input type="text" value={editForm.local} onChange={(e) => setEditForm({...editForm, local: e.target.value})} />
              </div>
              <div className="input-group-pro">
                <label>Foco Principal de Treino</label>
                <select className="calc-select" style={{width: '100%'}} value={editForm.foco} onChange={(e) => setEditForm({...editForm, foco: e.target.value})}>
                  <option value="Hipertrofia Seca">Hipertrofia Seca</option>
                  <option value="Ganho de Força">Ganho de Força</option>
                  <option value="Recomposição Corporal">Recomposição Corporal</option>
                  <option value="Powerbuilding">Powerbuilding</option>
                </select>
              </div>
              <div className="grid-2-col">
                <div className="input-group-pro">
                  <label>Altura (m)</label>
                  <input type="number" step="0.01" value={editForm.altura} onChange={(e) => setEditForm({...editForm, altura: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="input-group-pro">
                  <label>Meta de Peso ({preferences.unidade.split(' ')[0].toLowerCase()})</label>
                  <input type="number" step="0.1" value={editForm.pesoMeta} onChange={(e) => setEditForm({...editForm, pesoMeta: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
            </div>

            <div className="modal-actions-pro">
              <button className="btn-cancel-modal-pro" onClick={() => setShowEditModal(false)}>CANCELAR</button>
              <button className="btn-save-data-pro" onClick={handleSaveProfile}><CheckCircle2 size={18} /> SALVAR</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT (NOVO) */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrapper-danger">
              <AlertTriangle size={32} />
            </div>
            <h3>Sair da Conta?</h3>
            <p>Tem certeza que deseja sair do Evolv? Você precisará fazer login novamente para acessar seus treinos.</p>
            <div className="modal-actions-pro">
              <button className="btn-cancel-modal-pro" onClick={() => setShowLogoutModal(false)}>CANCELAR</button>
              <button className="btn-confirm-delete" onClick={confirmLogout}>SAIR</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}