
'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PageHeader } from '@/components/page-header';
import { professionals as initialProfessionals, activityLog as initialActivityLog } from '@/lib/mock-data';
import type { Professional, ActivityLogEntry } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ProfissionaisPage() {
  const { toast } = useToast();
  const [professionals, setProfessionals] =
    useState<Professional[]>(initialProfessionals);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(initialActivityLog);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] =
    useState<Professional | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State for new professional form
  const [newProfData, setNewProfData] = useState({
    name: '',
    register: '',
    specialty: '',
  });
  // State for edit professional form
  const [editProfData, setEditProfData] = useState<Omit<Professional, 'id' | 'registeredAt'>>({
    name: '',
    register: '',
    specialty: '',
  });

  const filteredProfessionals = useMemo(() => {
    if (!searchTerm.trim()) {
      return professionals;
    }
    const lowercasedTerm = searchTerm.toLowerCase().trim();
    return professionals.filter(
      (p) =>
        p.name.toLowerCase().includes(lowercasedTerm) ||
        p.register.toLowerCase().includes(lowercasedTerm) ||
        p.specialty.toLowerCase().includes(lowercasedTerm)
    );
  }, [professionals, searchTerm]);
  
  const addLogEntry = (professionalId: string, action: string, details: string) => {
    const newLogEntry: ActivityLogEntry = {
      id: `log-${Date.now()}`,
      professionalId,
      timestamp: new Date().toISOString(),
      user: 'Admin', // Placeholder user
      action,
      details,
    };
    setActivityLog(prev => [newLogEntry, ...prev]);
  };


  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProfData({ ...newProfData, [e.target.id]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProfData({ ...editProfData, [e.target.id]: e.target.value });
  };

  const handleSaveNew = () => {
    const newProfessional: Professional = {
      id: `prof-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      ...newProfData,
    };
    setProfessionals([...professionals, newProfessional]);
    addLogEntry(newProfessional.id, 'Criação de Profissional', `Profissional '${newProfessional.name}' foi cadastrado.`);
    toast({
      title: 'Sucesso!',
      description: 'Novo profissional salvo.',
    });
    setIsNewDialogOpen(false);
    setNewProfData({ name: '', register: '', specialty: '' });
  };

  const handleOpenEditDialog = (prof: Professional) => {
    setEditingProfessional(prof);
    setEditProfData({
      name: prof.name,
      register: prof.register,
      specialty: prof.specialty,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingProfessional) return;

    setProfessionals(
      professionals.map((p) =>
        p.id === editingProfessional.id ? { ...p, ...editProfData } : p
      )
    );
    addLogEntry(editingProfessional.id, 'Edição de Profissional', `Dados do profissional '${editProfData.name}' foram atualizados.`);
    toast({
      title: 'Sucesso!',
      description: 'Dados do profissional atualizados.',
    });
    setIsEditDialogOpen(false);
    setEditingProfessional(null);
  };

  const handleDelete = (id: string) => {
    const profToDelete = professionals.find(p => p.id === id);
    if(profToDelete) {
       addLogEntry(id, 'Exclusão de Profissional', `Profissional '${profToDelete.name}' foi excluído.`);
    }
    setProfessionals(professionals.filter((p) => p.id !== id));
    toast({
      title: 'Sucesso!',
      description: 'Profissional excluído.',
      variant: 'destructive',
    });
  };
  return (
    <>
      <PageHeader title="Gerenciamento de Profissionais">
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Profissional</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo profissional.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newProfData.name}
                  onChange={handleNewChange}
                  placeholder="Dr. João da Silva"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="register" className="text-right">
                  Nº Registro
                </Label>
                <Input
                  id="register"
                  value={newProfData.register}
                  onChange={handleNewChange}
                  placeholder="CRM-SP 123456"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialty" className="text-right">
                  Especialidade
                </Label>
                <Input
                  id="specialty"
                  value={newProfData.specialty}
                  onChange={handleNewChange}
                  placeholder="Cardiologia"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveNew}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Profissional</DialogTitle>
            <DialogDescription>
              Atualize os dados do profissional.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={editProfData.name}
                onChange={handleEditChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="register" className="text-right">
                Nº Registro
              </Label>
              <Input
                id="register"
                value={editProfData.register}
                onChange={handleEditChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialty" className="text-right">
                Especialidade
              </Label>
              <Input
                id="specialty"
                value={editProfData.specialty}
                onChange={handleEditChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
                <CardTitle>Profissionais Cadastrados</CardTitle>
                <CardDescription>
                  Liste, filtre e gerencie todos os profissionais da rede.
                </CardDescription>
             </div>
             <div className="relative w-full sm:w-auto sm:min-w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, registro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProfessionals.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Nº Registro</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell className="font-medium">{prof.name}</TableCell>
                  <TableCell>{prof.register}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{prof.specialty}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/profissionais/${prof.id}`}>Ver Detalhes</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenEditDialog(prof)}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              Excluir
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Você tem certeza?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá
                                permanentemente o profissional.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(prof.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
             <div className="text-center py-16 text-muted-foreground">
                <p>Nenhum profissional encontrado.</p>
                <p className="text-sm">
                  Tente ajustar o termo de busca.
                </p>
              </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
