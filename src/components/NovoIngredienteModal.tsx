
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
}

const NovoIngredienteModal = () => {
  const [open, setOpen] = useState(false);
  const [ingredienteData, setIngredienteData] = useState<NovoIngredienteData>({
    nome: '',
    categoria: '',
    unidade: ''
  });

  const categorias = [
    { value: 'proteinas', label: 'Proteínas' },
    { value: 'vegetais', label: 'Vegetais' },
    { value: 'laticinios', label: 'Laticínios' },
    { value: 'graos', label: 'Grãos' },
  ];

  const unidades = [
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'unidade', label: 'Unidade' },
    { value: 'l', label: 'Litro (l)' },
    { value: 'ml', label: 'Mililitro (ml)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredienteData.nome || !ingredienteData.categoria || !ingredienteData.unidade) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    console.log('=== INICIANDO CHAMADA DO WEBHOOK COM DADOS ===');
    console.log('URL:', 'https://n8n-producao.24por7.ai/webhook-test/foodservice');
    
    toast.info('Processando novo ingrediente...');
    
    const params = new URLSearchParams({
      action: 'novo_ingrediente',
      timestamp: new Date().toISOString(),
      triggered_from: window.location.origin,
      user_agent: navigator.userAgent,
      nome: ingredienteData.nome,
      categoria: ingredienteData.categoria,
      unidade: ingredienteData.unidade,
    });
    
    console.log('Dados do ingrediente:', ingredienteData);
    console.log('Parâmetros sendo enviados:', params.toString());
    
    try {
      console.log('Fazendo GET request...');
      
      const response = await fetch(`https://n8n-producao.24por7.ai/webhook-test/foodservice?${params.toString()}`, {
        method: 'GET',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const responseData = await response.text();
        console.log('Response data:', responseData);
        toast.success(`Ingrediente "${ingredienteData.nome}" criado com sucesso!`);
        
        // Limpar o formulário e fechar o modal
        setIngredienteData({ nome: '', categoria: '', unidade: '' });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ingrediente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
