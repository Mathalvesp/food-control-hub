
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usuario && senha) {
      localStorage.setItem('userName', usuario);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error('Por favor, preencha todos os campos');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-2">24por7 FOOD</h1>
            <p className="text-gray-600">Gestão Inteligente para seu Negócio</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-gray-700 font-medium">
                Usuário
              </Label>
              <Input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="h-12 border-gray-300 focus:border-primary"
                placeholder="Digite seu usuário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-gray-700 font-medium">
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-12 border-gray-300 focus:border-primary"
                placeholder="Digite sua senha"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-200 font-semibold"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
