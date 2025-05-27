
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ProdutoEstoque {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  ultimaEntrada: string;
  estoqueMinimo: number;
  status: 'ok' | 'baixo' | 'critico';
}

const Estoque = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidadeEntrada, setQuantidadeEntrada] = useState('');
  const [unidadeProduto, setUnidadeProduto] = useState('');

  // Dados simulados
  const [produtos] = useState<ProdutoEstoque[]>([
    {
      id: 1,
      nome: 'Carne Bovina',
      quantidade: 45.5,
      unidade: 'kg',
      ultimaEntrada: '2024-05-25',
      estoqueMinimo: 10,
      status: 'ok'
    },
    {
      id: 2,
      nome: 'Queijo Mussarela',
      quantidade: 8.2,
      unidade: 'kg',
      ultimaEntrada: '2024-05-24',
      estoqueMinimo: 5,
      status: 'baixo'
    },
    {
      id: 3,
      nome: 'Tomate',
      quantidade: 2.1,
      unidade: 'kg',
      ultimaEntrada: '2024-05-23',
      estoqueMinimo: 3,
      status: 'critico'
    },
    {
      id: 4,
      nome: 'Alface',
      quantidade: 25,
      unidade: 'unidades',
      ultimaEntrada: '2024-05-26',
      estoqueMinimo: 10,
      status: 'ok'
    },
    {
      id: 5,
      nome: 'Pão de Hambúrguer',
      quantidade: 120,
      unidade: 'unidades',
      ultimaEntrada: '2024-05-26',
      estoqueMinimo: 50,
      status: 'ok'
    },
    {
      id: 6,
      nome: 'Batata Inglesa',
      quantidade: 15.8,
      unidade: 'kg',
      ultimaEntrada: '2024-05-25',
      estoqueMinimo: 5,
      status: 'ok'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 text-green-800';
      case 'baixo':
        return 'bg-yellow-100 text-yellow-800';
      case 'critico':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok':
        return 'Normal';
      case 'baixo':
        return 'Estoque Baixo';
      case 'critico':
        return 'Crítico';
      default:
        return 'Desconhecido';
    }
  };

  const handleNovaEntrada = () => {
    if (!nomeProduto || !quantidadeEntrada || !unidadeProduto) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    toast.success('Entrada de produto registrada com sucesso!');
    setMostrarFormulario(false);
    setNomeProduto('');
    setQuantidadeEntrada('');
    setUnidadeProduto('');
  };

  const produtosCriticos = produtos.filter(p => p.status === 'critico').length;
  const produtosBaixos = produtos.filter(p => p.status === 'baixo').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Estoque</h1>
          <p className="text-gray-600">Controle de produtos e movimentações</p>
        </div>
        <Button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      {/* Alertas de estoque */}
      {(produtosCriticos > 0 || produtosBaixos > 0) && (
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Atenção aos estoques!</p>
                <p className="text-sm text-gray-600">
                  {produtosCriticos > 0 && `${produtosCriticos} produto(s) em estoque crítico. `}
                  {produtosBaixos > 0 && `${produtosBaixos} produto(s) com estoque baixo.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de nova entrada */}
      {mostrarFormulario && (
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
              Nova Entrada de Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produto">Nome do Produto</Label>
                <Input
                  id="produto"
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  placeholder="Ex: Carne Bovina"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={quantidadeEntrada}
                  onChange={(e) => setQuantidadeEntrada(e.target.value)}
                  placeholder="10.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  value={unidadeProduto}
                  onChange={(e) => setUnidadeProduto(e.target.value)}
                  placeholder="kg, unidades, litros..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleNovaEntrada} className="bg-primary hover:bg-primary-dark">
                Registrar Entrada
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((produto) => (
          <Card key={produto.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" />
                  {produto.nome}
                </CardTitle>
                <Badge className={getStatusColor(produto.status)}>
                  {getStatusText(produto.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantidade:</span>
                  <span className="font-medium text-lg">
                    {produto.quantidade} {produto.unidade}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estoque Mínimo:</span>
                  <span className="font-medium">
                    {produto.estoqueMinimo} {produto.unidade}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Última Entrada:</span>
                  <span className="font-medium">
                    {new Date(produto.ultimaEntrada).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="pt-3 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Movimentações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Estoque;
