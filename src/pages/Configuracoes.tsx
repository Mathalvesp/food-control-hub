
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cog, User, Bell, Shield, Database } from 'lucide-react';
import { toast } from 'sonner';

const Configuracoes = () => {
  const configuracoes = [
    {
      icon: User,
      titulo: 'Perfil do Usuário',
      descricao: 'Alterar dados pessoais e informações da conta',
      acao: 'Editar Perfil'
    },
    {
      icon: Bell,
      titulo: 'Notificações',
      descricao: 'Configurar alertas de estoque e lembretes',
      acao: 'Configurar'
    },
    {
      icon: Shield,
      titulo: 'Segurança',
      descricao: 'Alterar senha e configurações de segurança',
      acao: 'Gerenciar'
    },
    {
      icon: Database,
      titulo: 'Backup de Dados',
      descricao: 'Fazer backup ou restaurar dados do sistema',
      acao: 'Backup'
    }
  ];

  const handleConfiguracao = (titulo: string) => {
    toast.info(`Configuração de ${titulo} em desenvolvimento`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configuracoes.map((config, index) => {
          const IconComponent = config.icon;
          return (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <IconComponent className="w-5 h-5 mr-3 text-primary" />
                  {config.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{config.descricao}</p>
                <Button 
                  variant="outline" 
                  onClick={() => handleConfiguracao(config.titulo)}
                  className="w-full"
                >
                  {config.acao}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Informações do sistema */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Cog className="w-5 h-5 mr-3 text-primary" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Versão:</span>
              <span className="font-medium">24por7 FOOD v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Última Atualização:</span>
              <span className="font-medium">27 de Maio, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Licença:</span>
              <span className="font-medium">Licença Comercial</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
