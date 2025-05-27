import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Ingrediente {
  id: number;
  nome: string;
  unidade: string;
  precoCusto: number;
  cmv: number;
  categoria: string;
}

const FichaTecnica = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busca, setBusca] = useState('');

  // Dados simulados
  const [ingredientes] = useState<Ingrediente[]>([
    { id: 1, nome: 'Carne Bovina', unidade: 'kg', precoCusto: 32.50, cmv: 2.1, categoria: 'proteinas' },
    { id: 2, nome: 'Queijo Mussarela', unidade: 'kg', precoCusto: 28.90, cmv: 1.8, categoria: 'laticinios' },
    { id: 3, nome: 'Tomate', unidade: 'kg', precoCusto: 4.50, cmv: 0.3, categoria: 'vegetais' },
    { id: 4, nome: 'Alface', unidade: 'unidade', precoCusto: 2.20, cmv: 0.1, categoria: 'vegetais' },
    { id: 5, nome: 'Pão de Hambúrguer', unidade: 'unidade', precoCusto: 0.80, cmv: 0.05, categoria: 'graos' },
    { id: 6, nome: 'Batata Inglesa', unidade: 'kg', precoCusto: 3.20, cmv: 0.2, categoria: 'vegetais' },
  ]);

  const categorias = [
    { value: 'todas', label: 'Todas as Categorias' },
    { value: 'proteinas', label: 'Proteínas' },
    { value: 'vegetais', label: 'Vegetais' },
    { value: 'laticinios', label: 'Laticínios' },
    { value: 'graos', label: 'Grãos' },
  ];

  const ingredientesFiltrados = ingredientes.filter(ingrediente => {
    const matchCategoria = filtroCategoria === 'todas' || ingrediente.categoria === filtroCategoria;
    const matchBusca = ingrediente.nome.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      proteinas: 'bg-red-100 text-red-800',
      vegetais: 'bg-green-100 text-green-800',
      laticinios: 'bg-blue-100 text-blue-800',
      graos: 'bg-yellow-100 text-yellow-800',
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleNovoIngrediente = async () => {
    console.log('Triggering webhook for new ingredient');
    
    try {
      const response = await fetch('https://n8n-producao.24por7.ai/webhook-test/foodservice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          action: 'novo_ingrediente',
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });

      toast.success('Webhook chamado com sucesso! Verifique o sistema para confirmar o processamento.');
    } catch (error) {
      console.error('Error calling webhook:', error);
      toast.error('Erro ao chamar o webhook. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ficha Técnica</h1>
          <p className="text-gray-600">Gerencie os ingredientes e custos</p>
        </div>
        <Button 
          onClick={handleNovoIngrediente}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Ingrediente
        </Button>
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
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Ingredientes Cadastrados ({ingredientesFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ingrediente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Unidade</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Preço de Custo</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">CMV Individual</th>
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
                      R$ {ingrediente.precoCusto.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-green-600 font-medium">
                        {ingrediente.cmv.toFixed(1)}%
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

export default FichaTecnica;
