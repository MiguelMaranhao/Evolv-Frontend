import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Dumbbell } from 'lucide-react';
import GreenButton from '../components/GreenButton';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/home'); // Redireciona para a home ao clicar em Entrar
  };

  return (
    <div className="login-page">
      {/* A imagem de fundo deve estar em src/assets/hero.png */}
      <div className="overlay"></div>
      
      <div className="login-content">
        <h1 className="evolv-logo">Evolv</h1>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input type="text" placeholder="Usuário" required />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input type="password" placeholder="Senha" required />
          </div>
          
          <a href="#" className="forgot-password">Esqueceu a senha?</a>
          
          <div className="button-container">
            <GreenButton text="Entrar" type="submit" />
          </div>
        </form>

        <div className="footer-icon">
          <Dumbbell color="var(--evolv-green)" size={40} />
        </div>
      </div>
    </div>
  );
}