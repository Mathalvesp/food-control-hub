
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface NovoIngredienteData {
  nome: string;
  categoria: string;
  unidade: string;
  valorCusto: string;
  pesoInicial: string;
  pesoFinal: string;
}

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

interface NovoIngredienteModalProps {
  onIngredienteAdicionado?: (ingrediente: Omit<Ingrediente, 'id'>) => void;
  proximoId: number;
}

const NovoIngredienteModal = ({ onIngredienteAdicionado, proximoId }: NovoIngredienteModalProps) => {
  const [open, setOpen] = useState(false);
  const [ingredienteData, setIngredienteData] = useState<NovoIngredienteData>({
    nome: '',
    categoria: '',
    unidade: '',
    valorCusto: '',
    pesoInicial: '',
    pesoFinal: ''
  });

  const categorias = [
    { value: 'Laticínios', label: 'Laticínios' },
    { value: 'Carnes', label: 'Carnes' },
    { value: 'Aves', label: 'Aves' },
    { value: 'Suínos', label: 'Suínos' },
    { value: 'Outras comidas', label: 'Outras comidas' },
    { value: 'Camarão e peixes', label: 'Camarão e peixes' },
    { value: 'Bebidas', label: 'Bebidas' },
    { value: 'Liquor', label: 'Liquor' },
    { value: 'Cervejas', label: 'Cervejas' },
    { value: 'Vinhos', label: 'Vinhos' },
    { value: 'Hortifruti', label: 'Hortifruti' },
    { value: 'Pastas', label: 'Pastas' },
  ];

  const unidades = [
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'litro', label: 'Litro (l)' },
    { value: 'unidade', label: 'Unidade' },
  ];

  const calcularFatorCorrecao = () => {
    const inicial = parseFloat(ingredienteData.pesoInicial);
    const final = parseFloat(ingredienteData.pesoFinal);
    if (inicial > 0 && final > 0) {
      return (inicial / final).toFixed(2);
    }
    return '0.00';
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredienteData.nome || !ingredienteData.categoria || !ingredienteData.unidade || 
        !ingredienteData.valorCusto || !ingredienteData.pesoInicial || !ingredienteData.pesoFinal) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const fatorCorrecao = calcularFatorCorrecao();
    const valorCusto = parseFloat(ingredienteData.valorCusto);
    const pesoInicial = parseFloat(ingredienteData.pesoInicial);
    const pesoFinal = parseFloat(ingredienteData.pesoFinal);

    console.log('=== INICIANDO CHAMADA DO WEBHOOK COM DADOS ===');
    console.log('URL:', 'https://n8n-producao.24por7.ai/webhook-test/ingredientes');
    console.log('ID que será usado:', proximoId);
    
    toast.info('Processando novo ingrediente...');
    
    const params = new URLSearchParams({
      action: 'novo_ingrediente',
      timestamp: new Date().toISOString(),
      triggered_from: window.location.origin,
      user_agent: navigator.userAgent,
      id: proximoId.toString(), // Usar o ID sequencial
      nome: ingredienteData.nome,
      categoria: ingredienteData.categoria,
      unidade: ingredienteData.unidade,
      valor_custo: ingredienteData.valorCusto,
      peso_inicial: ingredienteData.pesoInicial,
      peso_final: ingredienteData.pesoFinal,
      fator_correcao: fatorCorrecao,
    });
    
    console.log('Dados do ingrediente:', { ...ingredienteData, id: proximoId, fator_correcao: fatorCorrecao });
    console.log('Parâmetros sendo enviados:', params.toString());
    
    try {
      console.log('Fazendo GET request...');
      
      const response = await fetch(`https://n8n-producao.24por7.ai/webhook-test/ingredientes?${params.toString()}`, {
        method: 'GET',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const responseData = await response.text();
        console.log('Response data:', responseData);
        toast.success(`Ingrediente "${ingredienteData.nome}" criado com sucesso! ID: ${proximoId}`);
        
        // Criar o objeto ingrediente para adicionar à lista local
        const valoresCalculados = calcularValores(pesoInicial, pesoFinal, valorCusto);
        const novoIngrediente: Omit<Ingrediente, 'id'> = {
          nome: ingredienteData.nome,
          categoria: ingredienteData.categoria,
          unidade: ingredienteData.unidade,
          valorCusto: valorCusto,
          pesoInicial: pesoInicial,
          pesoFinal: pesoFinal,
          ...valoresCalculados
        };

        // Adicionar o ingrediente à lista local se a função foi fornecida
        if (onIngredienteAdicionado) {
          onIngredienteAdicionado(novoIngrediente);
        }
        
        // Limpar o formulário e fechar o modal
        setIngredienteData({ 
          nome: '', 
          categoria: '', 
          unidade: '', 
          valorCusto: '', 
          pesoInicial: '', 
          pesoFinal: '' 
        });
        setOpen(false);
      } else {
        console.error('Response não ok:', response.status, response.statusText);
        toast.warning(`Ingrediente enviado (status: ${response.status}). Verifique o sistema n8n.`);
      }
      
    } catch (error) {
      console.error('=== ERRO NO WEBHOOK ===');
      console.error('Tipo do erro:', error.constructor.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      
      toast.error('Erro ao criar ingrediente. Verifique a conectividade e tente novamente.');
    }
    
    console.log('=== FIM DA CHAMADA DO WEBHOOK ===');
  };

  const handleInputChange = (field: keyof NovoIngredienteData, value: string) => {
    setIngredienteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ingrediente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ingrediente (ID: #{proximoId})</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Ingrediente *</Label>
              <Input
                id="nome"
                value={ingredienteData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Carne Bovina"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={ingredienteData.categoria}
                onValueChange={(value) => handleInputChange('categoria', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade de Medida *</Label>
              <Select
                value={ingredienteData.unidade}
                onValueChange={(value) => handleInputChange('unidade', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {unidades.map((unidade) => (
                    <SelectItem key={unidade.value} value={unidade.value}>
                      {unidade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorCusto">Valor de Custo (R$) *</Label>
              <Input
                id="valorCusto"
                type="number"
                step="0.01"
                value={ingredienteData.valorCusto}
                onChange={(e) => handleInputChange('valorCusto', e.target.value)}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pesoInicial">Peso Inicial *</Label>
              <Input
                id="pesoInicial"
                type="number"
                step="0.01"
                value={ingredienteData.pesoInicial}
                onChange={(e) => handleInputChange('pesoInicial', e.target.value)}
                placeholder="1,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pesoFinal">Peso Final *</Label>
              <Input
                id="pesoFinal"
                type="number"
                step="0.01"
                value={ingredienteData.pesoFinal}
                onChange={(e) => handleInputChange('pesoFinal', e.target.value)}
                placeholder="0,85"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Fator de Correção</Label>
              <div className="h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                <span className="text-sm font-medium text-green-600">
                  {calcularFatorCorrecao()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Ingrediente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoIngredienteModal;
