
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Dados simulados para os cards
  const statsData = [
    { title: 'CMV Global', value: '23.5%', description: 'Custo das Mercadorias Vendidas', color: 'text-green-600' },
    { title: 'CMV Diário', value: '24.2%', description: 'CMV das operações de hoje', color: 'text-blue-600' },
    { title: 'Itens em Estoque', value: '247', description: 'Produtos cadastrados', color: 'text-purple-600' },
    { title: 'Receitas Cadastradas', value: '89', description: 'Receitas no sistema', color: 'text-orange-600' },
  ];

  // Dados para o gráfico de barras
  const barData = [
    { mes: 'Jan', cmv: 22.1 },
    { mes: 'Fev', cmv: 24.3 },
    { mes: 'Mar', cmv: 21.8 },
    { mes: 'Abr', cmv: 23.5 },
    { mes: 'Mai', cmv: 22.9 },
    { mes: 'Jun', cmv: 23.5 },
  ];

  // Dados para o gráfico de pizza
  const pieData = [
    { name: 'Proteínas', value: 35, color: '#D72638' },
    { name: 'Vegetais', value: 28, color: '#FF6B6B' },
    { name: 'Grãos', value: 20, color: '#FFE66D' },
    { name: 'Laticínios', value: 17, color: '#4ECDC4' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de CMV por mês */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              CMV por Mês (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'CMV']} />
                <Bar dataKey="cmv" fill="#D72638" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de distribuição por categoria */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Participação']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumo recente */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Nova receita cadastrada</p>
                <p className="text-sm text-gray-600">Hambúrguer Especial da Casa</p>
              </div>
              <span className="text-sm text-gray-500">2 horas atrás</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Entrada de estoque</p>
                <p className="text-sm text-gray-600">Carne bovina - 50kg</p>
              </div>
              <span className="text-sm text-gray-500">5 horas atrás</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Atualização de preço</p>
                <p className="text-sm text-gray-600">Queijo mussarela</p>
              </div>
              <span className="text-sm text-gray-500">1 dia atrás</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
