import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm onToggleMode={() => setIsLogin(false)} />
  ) : (
    <RegisterForm onToggleMode={() => setIsLogin(true)} />
  );
};

export default Auth;