import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import NovoIngredienteModal from '@/components/NovoIngredienteModal';

interface Ingrediente {
  id: number;
  nome: string;
  unidade: string;
  valorCusto: number;
  pesoInicial: number;
  pesoFinal: number;
  fatorCorrecao: number;
  categoria: string;
  porcentagemAproveitamento: number;
  porcentagemPerda: number;
  precoReal: number;
}

const Ingredientes = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busca, setBusca] = useState('');

  // Função para calcular valores automáticos
  const calcularValores = (pesoInicial: number, pesoFinal: number, valorCusto: number) => {
    const fatorCorrecao = pesoInicial / pesoFinal;
    const porcentagemAproveitamento = (pesoFinal / pesoInicial) * 100;
    const porcentagemPerda = ((pesoInicial - pesoFinal) / pesoInicial) * 100;
    const precoReal = valorCusto * fatorCorrecao;
    
    return {
      fatorCorrecao: Number(fatorCorrecao.toFixed(2)),
      porcentagemAproveitamento: Number(porcentagemAproveitamento.toFixed(1)),
      porcentagemPerda: Number(porcentagemPerda.toFixed(1)),
      precoReal: Number(precoReal.toFixed(2))
    };
  };

  // Dados simulados com cálculos automáticos
  const [ingredientes] = useState<Ingrediente[]>([
    { 
      id: 1, 
      nome: 'Carne Bovina', 
      unidade: 'kg', 
      valorCusto: 32.50, 
      pesoInicial: 1.0,
      pesoFinal: 0.85,
      ...calcularValores(1.0, 0.85, 32.50),
      categoria: 'Carnes' 
    },
    { 
      id: 2, 
      nome: 'Queijo Mussarela', 
      unidade: 'kg', 
      valorCusto: 28.90, 
      pesoInicial: 1.0,
      pesoFinal: 0.95,
      ...calcularValores(1.0, 0.95, 28.90),
      categoria: 'Laticínios' 
    },
    { 
      id: 3, 
      nome: 'Tomate', 
      unidade: 'kg', 
      valorCusto: 4.50, 
      pesoInicial: 1.0,
      pesoFinal: 0.90,
      ...calcularValores(1.0, 0.90, 4.50),
      categoria: 'Hortifruti' 
    },
  ]);

  const categorias = [
    { value: 'todas', label: 'Todas as Categorias' },
    { value: 'Laticínios', label: 'Laticínios' },
    { value: 'Carnes', label: 'Carnes' },
    { value: 'Aves', label: 'Aves' },
    { value: 'Suínos', label: 'Suínos' },
    { value: 'Hortifruti', label: 'Hortifruti' },
    { value: 'Bebidas', label: 'Bebidas' },
  ];

  const ingredientesFiltrados = ingredientes.filter(ingrediente => {
    const matchCategoria = filtroCategoria === 'todas' || ingrediente.categoria === filtroCategoria;
    const matchBusca = ingrediente.nome.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      'Carnes': 'bg-red-100 text-red-800',
      'Hortifruti': 'bg-green-100 text-green-800',
      'Laticínios': 'bg-blue-100 text-blue-800',
      'Aves': 'bg-yellow-100 text-yellow-800',
      'Suínos': 'bg-pink-100 text-pink-800',
      'Bebidas': 'bg-purple-100 text-purple-800',
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com título */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ingredientes</h1>
          <p className="text-gray-600">Gerencie os ingredientes e custos</p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar ingrediente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de ingredientes */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Ingredientes Cadastrados ({ingredientesFiltrados.length})
          </CardTitle>
          <NovoIngredienteModal />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ingrediente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Unidade</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Valor Custo</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">% Aproveitamento</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">% Perda</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Fator Correção</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Preço Real</th>
                </tr>
              </thead>
              <tbody>
                {ingredientesFiltrados.map((ingrediente) => (
                  <tr key={ingrediente.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{ingrediente.nome}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getCategoriaColor(ingrediente.categoria)}>
                        {ingrediente.categoria}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{ingrediente.unidade}</td>
                    <td className="py-4 px-4 text-right font-medium">
                      R$ {ingrediente.valorCusto.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-green-600 font-medium">
                        {ingrediente.porcentagemAproveitamento}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-red-600 font-medium">
                        {ingrediente.porcentagemPerda}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-blue-600 font-medium">
                        {ingrediente.fatorCorrecao}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold">
                      <span className="text-primary">
                        R$ {ingrediente.precoReal.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {ingredientesFiltrados.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum ingrediente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Ingredientes;
