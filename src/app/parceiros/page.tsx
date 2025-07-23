
'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuSeparator,
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
  DialogClose,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/page-header';
import { partners as initialPartners } from '@/lib/mock-data';
import type { Partner } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const emptyFormData: Omit<Partner, 'id' | 'status' | 'registeredAt'> = {
  name: '',
  category: 'Saúde',
  type: '',
  cnpj: '',
  contact: '',
  address: '',
  city: '',
  niche: '',
  logoUrl: '',
  affiliatedProfessionals: [],
  exams: [],
};

export default function ParceirosPage() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] =
    useState<Omit<Partner, 'id' | 'status' | 'registeredAt'>>(emptyFormData);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartners = useMemo(() => {
    let results = partners;

    if (activeTab !== 'all') {
      results = results.filter((p) => p.category.toLowerCase() === activeTab);
    }

    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercasedTerm) ||
          p.cnpj.includes(lowercasedTerm) ||
          p.city.toLowerCase().includes(lowercasedTerm) ||
          p.type.toLowerCase().includes(lowercasedTerm)
      );
    }

    return results;
  }, [activeTab, partners, searchTerm]);

  const handleOpenDialog = (partner: Partner | null = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        category: partner.category,
        type: partner.type,
        cnpj: partner.cnpj,
        contact: partner.contact,
        address: partner.address,
        city: partner.city,
        niche: partner.niche,
        logoUrl: partner.logoUrl,
        affiliatedProfessionals: partner.affiliatedProfessionals,
        exams: partner.exams,
      });
    } else {
      setEditingPartner(null);
      setFormData(emptyFormData);
    }
    setIsDialogOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editingPartner) {
      // Edit existing partner
      const updatedPartners = partners.map((p) =>
        p.id === editingPartner.id ? { ...p, ...formData } : p
      );
      setPartners(updatedPartners);
      toast({
        title: 'Sucesso!',
        description: 'Parceiro atualizado.',
      });
    } else {
      // Add new partner
      const newPartner: Partner = {
        id: `par-${Date.now()}`,
        status: 'Ativo',
        registeredAt: new Date().toISOString(),
        ...formData,
      };
      setPartners([...partners, newPartner]);
      toast({
        title: 'Sucesso!',
        description: 'Novo parceiro salvo.',
      });
    }
    setIsDialogOpen(false);
    setEditingPartner(null);
  };

  return (
    <>
      <PageHeader title="Gerenciamento de Parceiros">
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2" />
          Novo Parceiro
        </Button>
      </PageHeader>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? 'Editar Parceiro' : 'Cadastrar Novo Parceiro'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados para{' '}
              {editingPartner ? 'atualizar o' : 'adicionar um novo'} parceiro à
              rede.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Estética">Estética</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Lazer">Lazer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <Input
                id="type"
                value={formData.type}
                onChange={handleFormChange}
                placeholder="Clínica, Hospital..."
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Razão Social
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Nome do Parceiro"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cnpj" className="text-right">
                CNPJ/CPF
              </Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={handleFormChange}
                placeholder="12.345.678/0001-99"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contato
              </Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={handleFormChange}
                placeholder="(11) 98765-4321"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Endereço
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Rua, Número, Bairro, Cidade - UF"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                Cidade
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleFormChange}
                placeholder="São Paulo"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="niche" className="text-right">
                Especialidade/Serviço
              </Label>
              <Input
                id="niche"
                value={formData.niche}
                onChange={handleFormChange}
                placeholder="Odontologia, Fitness..."
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logoUrl" className="text-right">
                URL do Logo
              </Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={handleFormChange}
                placeholder="https://exemplo.com/logo.png"
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
            <Button type="button" onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="saúde">Saúde</TabsTrigger>
          <TabsTrigger value="estética">Estética</TabsTrigger>
          <TabsTrigger value="educação">Educação</TabsTrigger>
          <TabsTrigger value="lazer">Lazer</TabsTrigger>
        </TabsList>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Parceiros da Rede</CardTitle>
                <CardDescription>
                  Liste, filtre e gerencie todos os parceiros da categoria
                  selecionada.
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-auto sm:min-w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, tipo, CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPartners.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Razão Social</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Endereço
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.cnpj}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.address}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'Ativo'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {item.status}
                        </Badge>
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
                              <Link href={`/parceiros/${item.id}`}>
                                Ver Detalhes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDialog(item)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              disabled
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>Nenhum parceiro encontrado.</p>
                <p className="text-sm">
                  Tente ajustar os filtros ou o termo de busca.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </>
  );
}
