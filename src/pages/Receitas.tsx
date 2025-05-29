import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, BookOpen, X, Search, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface IngredienteReceita {
  nome: string;
  quantidade: number;
  unidade: string;
}

interface Receita {
  id: number;
  nome: string;
  ingredientes: IngredienteReceita[];
  unidadeFinal: string;
  custoTotal: number;
  modoPreparo: string;
}

// Interface para ingredientes cadastrados (mesma estrutura da página Ingredientes)
interface IngredienteCadastrado {
  id: number;
  nome: string;
  unidade: string;
  valorCusto: number;
  categoria: string;
}

const Receitas = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nomeReceita, setNomeReceita] = useState('');
  const [unidadeFinal, setUnidadeFinal] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [busca, setBusca] = useState('');
  const [ingredientesReceita, setIngredientesReceita] = useState<IngredienteReceita[]>([]);
  const [novoIngrediente, setNovoIngrediente] = useState({
    nome: '',
    quantidade: '',
    unidade: ''
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [receitas, setReceitas] = useState<Receita[]>([]);

  // Simulando ingredientes cadastrados - em um cenário real, isso viria de um contexto ou API
  const [ingredientesCadastrados] = useState<IngredienteCadastrado[]>([
    { id: 1, nome: 'Tomate', unidade: 'kg', valorCusto: 63, categoria: 'Hortifruti' },
    { id: 2, nome: 'Jiló', unidade: 'kg', valorCusto: 43, categoria: 'Hortifruti' },
    { id: 3, nome: 'Carne Bovina', unidade: 'kg', valorCusto: 35, categoria: 'Carnes' },
    { id: 4, nome: 'Queijo Mussarela', unidade: 'kg', valorCusto: 25, categoria: 'Laticínios' },
    { id: 5, nome: 'Alface', unidade: 'kg', valorCusto: 8, categoria: 'Hortifruti' },
    { id: 6, nome: 'Pão de Hambúrguer', unidade: 'unidade', valorCusto: 0.5, categoria: 'Padaria' },
    { id: 7, nome: 'Batata Inglesa', unidade: 'kg', valorCusto: 4, categoria: 'Hortifruti' },
    { id: 8, nome: 'Frango', unidade: 'kg', valorCusto: 12, categoria: 'Aves' },
    { id: 9, nome: 'Bacon', unidade: 'kg', valorCusto: 18, categoria: 'Suínos' }
  ]);

  const unidades = ['kg', 'litro', 'unidade'];

  const triggerWebhook = async (data: any, action: string) => {
    if (!webhookUrl) {
      console.log('Webhook URL não configurada');
      return;
    }

    try {
      console.log(`Triggering webhook for ${action}:`, data);
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          action,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log(`Webhook ${action} enviado com sucesso`);
    } catch (error) {
      console.error(`Erro ao enviar webhook ${action}:`, error);
    }
  };

  const adicionarIngrediente = () => {
    if (!novoIngrediente.nome || !novoIngrediente.quantidade || !novoIngrediente.unidade) {
      toast.error('Preencha todos os campos do ingrediente');
      return;
    }

    const ingrediente: IngredienteReceita = {
      nome: novoIngrediente.nome,
      quantidade: parseFloat(novoIngrediente.quantidade),
      unidade: novoIngrediente.unidade
    };

    setIngredientesReceita(prev => [...prev, ingrediente]);
    setNovoIngrediente({ nome: '', quantidade: '', unidade: '' });
    toast.success('Ingrediente adicionado à receita');
  };

  const removerIngrediente = (index: number) => {
    setIngredientesReceita(prev => prev.filter((_, i) => i !== index));
  };

  const handleSalvarReceita = async () => {
    if (!nomeReceita || !unidadeFinal || !modoPreparo || ingredientesReceita.length === 0) {
      toast.error('Preencha todos os campos obrigatórios e adicione pelo menos um ingrediente');
      return;
    }
    
    const novaReceita: Receita = {
      id: receitas.length + 1,
      nome: nomeReceita,
      ingredientes: ingredientesReceita,
      unidadeFinal: unidadeFinal,
      modoPreparo: modoPreparo,
      custoTotal: 0 // Será calculado baseado nos ingredientes
    };

    setReceitas(prev => [...prev, novaReceita]);
    
    // Trigger webhook para nova receita
    await triggerWebhook(novaReceita, 'receita_criada');
    
    toast.success('Receita salva com sucesso!');
    
    // Limpar formulário e fechar
    setMostrarFormulario(false);
    setNomeReceita('');
    setUnidadeFinal('');
    setModoPreparo('');
    setIngredientesReceita([]);
  };

  const handleEditarReceita = async (receita: Receita) => {
    // Trigger webhook para edição de receita
    await triggerWebhook(receita, 'receita_editada');
    
    toast.success('Funcionalidade de edição será implementada em breve!');
  };

  const receitasFiltradas = receitas.filter(receita =>
    receita.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receitas</h1>
          <p className="text-gray-600">Cadastre e gerencie suas receitas</p>
        </div>
      </div>

      {/* Campo de pesquisa com botão Nova Receita e Webhook */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar receitas por nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nova Receita
              </Button>
            </div>
            
            {/* Campo para Webhook URL */}
            <div className="space-y-2">
              <Label htmlFor="webhook">URL do Webhook (Zapier)</Label>
              <Input
                id="webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de nova receita */}
      {mostrarFormulario && (
        <Card className="shadow-sm border-l-4 border-l-red-600">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-600">
              Cadastrar Nova Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Receita *</Label>
                <Input
                  id="nome"
                  value={nomeReceita}
                  onChange={(e) => setNomeReceita(e.target.value)}
                  placeholder="Ex: Hambúrguer Especial"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade Final *</Label>
                <Select value={unidadeFinal} onValueChange={setUnidadeFinal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="unidade">Unidade</SelectItem>
                    <SelectItem value="porção">Porção</SelectItem>
                    <SelectItem value="kg">Quilograma</SelectItem>
                    <SelectItem value="litro">Litro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Modo de Preparo */}
            <div className="space-y-2">
              <Label htmlFor="modoPreparo">Modo de Preparo *</Label>
              <Textarea
                id="modoPreparo"
                value={modoPreparo}
                onChange={(e) => setModoPreparo(e.target.value)}
                placeholder="Descreva o modo de preparo da receita..."
                rows={4}
              />
            </div>

            {/* Adicionar Ingredientes */}
            <div className="space-y-4">
              <Label>Ingredientes Utilizados *</Label>
              
              {/* Formulário para adicionar ingrediente */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Nome do Ingrediente</Label>
                    <Select 
                      value={novoIngrediente.nome} 
                      onValueChange={(value) => setNovoIngrediente(prev => ({ ...prev, nome: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {ingredientesCadastrados.map((ingrediente) => (
                          <SelectItem key={ingrediente.id} value={ingrediente.nome}>
                            {ingrediente.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={novoIngrediente.quantidade}
                      onChange={(e) => setNovoIngrediente(prev => ({ ...prev, quantidade: e.target.value }))}
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div>
                    <Label>Unidade</Label>
                    <Select 
                      value={novoIngrediente.unidade} 
                      onValueChange={(value) => setNovoIngrediente(prev => ({ ...prev, unidade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {unidades.map((unidade) => (
                          <SelectItem key={unidade} value={unidade}>{unidade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button type="button" onClick={adicionarIngrediente} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista de ingredientes adicionados */}
              {ingredientesReceita.length > 0 && (
                <div className="space-y-2">
                  <Label>Ingredientes da Receita:</Label>
                  <div className="space-y-2">
                    {ingredientesReceita.map((ingrediente, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                        <span>
                          {ingrediente.nome} - {ingrediente.quantidade} {ingrediente.unidade}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removerIngrediente(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSalvarReceita} className="bg-red-600 hover:bg-red-700">
                Salvar Receita
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

      {/* Lista de receitas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {receitasFiltradas.map((receita) => (
          <Card key={receita.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-red-600" />
                  {receita.nome}
                </CardTitle>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">
                    R$ {receita.custoTotal.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">por {receita.unidadeFinal}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ingredientes:</h4>
                  <ul className="space-y-1">
                    {receita.ingredientes.map((ingrediente, index) => (
                      <li key={index} className="text-sm text-gray-600 flex justify-between">
                        <span>{ingrediente.nome}</span>
                        <span>{ingrediente.quantidade} {ingrediente.unidade}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Modo de Preparo:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {receita.modoPreparo}
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleEditarReceita(receita)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Receita
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {receitasFiltradas.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma receita encontrada
            </h3>
            <p className="text-gray-600">
              {busca ? 'Tente ajustar os termos de pesquisa' : 'Comece cadastrando sua primeira receita'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Receitas;
