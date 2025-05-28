
// Este arquivo será mantido para compatibilidade com rotas existentes
// Mas agora redireciona para a nova página de Ingredientes

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FichaTecnica = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/ingredientes', { replace: true });
  }, [navigate]);

  return null;
};

export default FichaTecnica;
