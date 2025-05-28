
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmDeleteDialog = ({ open, onOpenChange, onConfirm, itemName }: ConfirmDeleteDialogProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [skipConfirmation, setSkipConfirmation] = useState(false);

  useEffect(() => {
    // Verificar se o usuário escolheu não mostrar novamente
    const saved = localStorage.getItem('skipDeleteConfirmation');
    if (saved === 'true') {
      setSkipConfirmation(true);
    }
  }, []);

  useEffect(() => {
    // Se deve pular confirmação e o dialog está sendo aberto, confirmar automaticamente
    if (skipConfirmation && open) {
      onConfirm();
      onOpenChange(false);
    }
  }, [skipConfirmation, open, onConfirm, onOpenChange]);

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem('skipDeleteConfirmation', 'true');
    }
    onConfirm();
    onOpenChange(false);
  };

  // Se deve pular confirmação, não renderizar o dialog
  if (skipConfirmation) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div>
              Tem certeza que deseja deletar o ingrediente "{itemName}"? 
              Esta ação não pode ser desfeita.
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dontShowAgain" 
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
              />
              <label 
                htmlFor="dontShowAgain" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Não mostrar esta confirmação novamente
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
