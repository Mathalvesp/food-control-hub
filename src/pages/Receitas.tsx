
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BookOpen, X } from 'lucide-react';
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
}

const Receitas = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nomeReceita, setNomeReceita] = useState('');
  const [unidadeFinal, setUnidadeFinal] = useState('');
  const [ingredientesReceita, setIngredientesReceita] = useState<IngredienteReceita[]>([]);
  const [novoIngrediente, setNovoIngrediente] = useState({
    nome: '',
    quantidade: '',
    unidade: ''
  });

  // Dados simulados
  const [receitas] = useState<Receita[]>([
    {
      id: 1,
      nome: 'Hambúrguer Clássico',
      ingredientes: [
        { nome: 'Carne Bovina', quantidade: 0.15, unidade: 'kg' },
        { nome: 'Pão de Hambúrguer', quantidade: 1, unidade: 'unidade' },
        { nome: 'Queijo Mussarela', quantidade: 0.03, unidade: 'kg' },
        { nome: 'Alface', quantidade: 0.02, unidade: 'kg' },
        { nome: 'Tomate', quantidade: 0.02, unidade: 'kg' },
      ],
      unidadeFinal: 'unidade',
      custoTotal: 6.45
    },
    {
      id: 2,
      nome: 'Batata Frita Especial',
      ingredientes: [
        { nome: 'Batata Inglesa', quantidade: 0.2, unidade: 'kg' },
      ],
      unidadeFinal: 'porção',
      custoTotal: 0.67
    }
  ]);

  const ingredientesDisponiveis = [
    'Carne Bovina', 'Queijo Mussarela', 'Tomate', 'Alface', 
    'Pão de Hambúrguer', 'Batata Inglesa', 'Frango', 'Bacon'
  ];

  const unidades = ['kg', 'litro', 'unidade'];

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

  const handleSalvarReceita = () => {
    if (!nomeReceita || !unidadeFinal || ingredientesReceita.length === 0) {
      toast.error('Preencha todos os campos obrigatórios e adicione pelo menos um ingrediente');
      return;
    }
    
    toast.success('Receita salva com sucesso!');
    setMostrarFormulario(false);
    setNomeReceita('');
    setUnidadeFinal('');
    setIngredientesReceita([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receitas</h1>
          <p className="text-gray-600">Cadastre e gerencie suas receitas</p>
        </div>
        <Button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Receita
        </Button>
      </div>

      {/* Formulário de nova receita */}
      {mostrarFormulario && (
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">
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
                        {ingredientesDisponiveis.map((ing) => (
                          <SelectItem key={ing} value={ing}>{ing}</SelectItem>
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
              <Button onClick={handleSalvarReceita} className="bg-primary hover:bg-primary-dark">
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
        {receitas.map((receita) => (
          <Card key={receita.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  {receita.nome}
                </CardTitle>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
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

                <div className="pt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    Editar Receita
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {receitas.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma receita cadastrada
            </h3>
            <p className="text-gray-600">
              Comece cadastrando sua primeira receita
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Receitas;
