
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';

const Categorias = () => {
  const [novaCategoria, setNovaCategoria] = useState('');

  const categoriasFixas = [
    'Laticínios',
    'Carnes',
    'Aves',
    'Suínos',
    'Outras comidas',
    'Camarão e peixes',
    'Bebidas',
    'Liquor',
    'Cervejas',
    'Vinhos',
    'Hortifruti',
    'Pastas'
  ];

  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<string[]>([]);

  const handleAdicionarCategoria = () => {
    if (!novaCategoria.trim()) {
      toast.error('Digite o nome da categoria');
      return;
    }

    if (categoriasFixas.includes(novaCategoria) || categoriasPersonalizadas.includes(novaCategoria)) {
      toast.error('Esta categoria já existe');
      return;
    }

    setCategoriasPersonalizadas(prev => [...prev, novaCategoria]);
    setNovaCategoria('');
    toast.success('Categoria adicionada com sucesso!');
  };

  const todasCategorias = [...categoriasFixas, ...categoriasPersonalizadas];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorias</h1>
        <p className="text-gray-600">Gerencie as categorias dos ingredientes</p>
      </div>

      {/* Lista de Categorias */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Tag className="w-5 h-5 mr-2 text-primary" />
            Categorias Disponíveis ({todasCategorias.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoriasFixas.map((categoria, index) => (
              <Badge key={index} variant="secondary" className="p-2 text-center justify-center">
                {categoria}
              </Badge>
            ))}
            {categoriasPersonalizadas.map((categoria, index) => (
              <Badge key={`custom-${index}`} className="p-2 text-center justify-center bg-primary text-white">
                {categoria}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adicionar Nova Categoria */}
      <Card className="shadow-sm border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Adicionar Nova Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="nova-categoria">Nome da Categoria</Label>
              <Input
                id="nova-categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                placeholder="Digite o nome da nova categoria"
                onKeyDown={(e) => e.key === 'Enter' && handleAdicionarCategoria()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdicionarCategoria} className="bg-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categorias;
