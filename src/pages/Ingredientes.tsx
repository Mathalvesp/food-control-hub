
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Pencil, Trash2 } from 'lucide-react';
import NovoIngredienteModal from '@/components/NovoIngredienteModal';
import EditarIngredienteModal from '@/components/EditarIngredienteModal';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import { toast } from 'sonner';

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null);
  const [proximoId, setProximoId] = useState(1); // Controla o próximo ID a ser usado

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

  // Array vazio para ingredientes
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

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

  const handleAdicionarIngrediente = (novoIngredienteData: Omit<Ingrediente, 'id'>) => {
    // Criar o ingrediente com o ID sequencial
    const novoIngrediente: Ingrediente = {
      ...novoIngredienteData,
      id: proximoId
    };
    
    console.log(`Adicionando ingrediente com ID sequencial: ${proximoId}`);
    setIngredientes(prev => [...prev, novoIngrediente]);
    setProximoId(prev => prev + 1); // Incrementa o próximo ID
  };

  const handleEditarIngrediente = (ingrediente: Ingrediente) => {
    setSelectedIngrediente(ingrediente);
    setEditModalOpen(true);
  };

  const handleUpdateIngrediente = (ingredienteAtualizado: Ingrediente) => {
    setIngredientes(prev => prev.map(item => 
      item.id === ingredienteAtualizado.id ? ingredienteAtualizado : item
    ));
  };

  const handleDeleteClick = (ingrediente: Ingrediente) => {
    setSelectedIngrediente(ingrediente);
    setDeleteDialogOpen(true);
  };

  const handleDeletarIngrediente = async () => {
    if (!selectedIngrediente) return;

    console.log('=== INICIANDO EXCLUSÃO DO INGREDIENTE ===');
    console.log('Deletando ingrediente:', selectedIngrediente);
    console.log('URL do webhook:', 'https://n8n-producao.24por7.ai/webhook-test/ingredientes');
    
    toast.info(`Processando exclusão do ingrediente: ${selectedIngrediente.nome}`);
    
    const params = new URLSearchParams({
      action: 'deletar_ingrediente',
      timestamp: new Date().toISOString(),
      triggered_from: window.location.origin,
      user_agent: navigator.userAgent,
      id: selectedIngrediente.id.toString(),
      nome: selectedIngrediente.nome,
      categoria: selectedIngrediente.categoria,
      unidade: selectedIngrediente.unidade,
      valor_custo: selectedIngrediente.valorCusto.toString(),
      peso_inicial: selectedIngrediente.pesoInicial.toString(),
      peso_final: selectedIngrediente.pesoFinal.toString(),
    });
    
    console.log('Dados do ingrediente para exclusão:', selectedIngrediente);
    console.log('Parâmetros sendo enviados:', params.toString());
    
    try {
      console.log('Fazendo GET request para exclusão...');
      
      const response = await fetch(`https://n8n-producao.24por7.ai/webhook-test/ingredientes?${params.toString()}`, {
        method: 'GET',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const responseData = await response.text();
        console.log('Response data:', responseData);
        
        // Remove o ingrediente da lista local após sucesso do webhook
        setIngredientes(prev => prev.filter(item => item.id !== selectedIngrediente.id));
        toast.success(`Ingrediente "${selectedIngrediente.nome}" foi removido com sucesso!`);
      } else {
        console.error('Response não ok:', response.status, response.statusText);
        toast.warning(`Exclusão enviada (status: ${response.status}). Verifique o sistema n8n.`);
      }
      
    } catch (error) {
      console.error('=== ERRO NO WEBHOOK DE EXCLUSÃO ===');
      console.error('Tipo do erro:', error.constructor.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      
      toast.error('Erro ao deletar ingrediente. Verifique a conectividade e tente novamente.');
    }
    
    console.log('=== FIM DA CHAMADA DO WEBHOOK DE EXCLUSÃO ===');
    setSelectedIngrediente(null);
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
          <NovoIngredienteModal onIngredienteAdicionado={handleAdicionarIngrediente} proximoId={proximoId} />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ingrediente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Unidade</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Valor Custo</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">% Aproveitamento</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">% Perda</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Fator Correção</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Preço Real</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ingredientesFiltrados.map((ingrediente) => (
                  <tr key={ingrediente.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-blue-600">#{ingrediente.id}</div>
                    </td>
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
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditarIngrediente(ingrediente)}
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(ingrediente)}
                          className="h-8 w-8 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
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

      <EditarIngredienteModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        ingrediente={selectedIngrediente}
        onUpdate={handleUpdateIngrediente}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeletarIngrediente}
        itemName={selectedIngrediente?.nome || ''}
      />
    </div>
  );
};

export default Ingredientes;
