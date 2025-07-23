
'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { partners, professionals, activityLog as initialActivityLog } from '@/lib/mock-data';
import type { Partner, Professional, ProfessionalLink, Exam, ActivityLogEntry } from '@/lib/mock-data';
import { notFound, useRouter, useParams } from 'next/navigation';
import {
  FileText,
  Phone,
  MapPin,
  Tag,
  Users,
  Paperclip,
  StickyNote,
  FlaskConical,
  PlusCircle,
  MoreHorizontal,
  UserPlus,
  Search,
  History,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ParceiroDetalhesPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const router = useRouter();

  const initialPartner = useMemo(() => partners.find((c) => c.id === params.id), [params.id]);

  const [partner, setPartner] = useState<Partner | undefined>(initialPartner);
  const [partnerExams, setPartnerExams] = useState<Exam[]>(initialPartner?.exams || []);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(
    initialActivityLog.filter(log => log.partnerId === params.id)
  );
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAnexoDialogOpen, setIsAnexoDialogOpen] = useState(false);
  const [isNotaDialogOpen, setIsNotaDialogOpen] = useState(false);
  
  // States for professional linking
  const [isAddProfDialogOpen, setIsAddProfDialogOpen] = useState(false);
  const [addProfSearch, setAddProfSearch] = useState('');
  const [isLinkDetailDialogOpen, setIsLinkDetailDialogOpen] = useState(false);
  const [linkingProfessional, setLinkingProfessional] = useState<typeof professionals[0] | null>(null);
  const [editingLink, setEditingLink] = useState<ProfessionalLink | null>(null);
  const [linkFormData, setLinkFormData] = useState({ price: '', discount: '', observation: '' });

  // States for exams
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examSearch, setExamSearch] = useState('');
  
  const [editFormData, setEditFormData] = useState({ name: '', cnpj: '', contact: '', city: '', address: '', logoUrl: '' });
  const [examFormData, setExamFormData] = useState<Omit<Exam, 'id'>>({ name: '', nomenclature: '', discount: '', observations: '', status: 'Ativo' as const, professionalId: '' });

  useEffect(() => {
    if (partner) {
      setEditFormData({
        name: partner.name,
        cnpj: partner.cnpj,
        contact: partner.contact,
        city: partner.city,
        address: partner.address,
        logoUrl: partner.logoUrl || '',
      });
      setPartnerExams(partner.exams || []);
    }
  }, [partner]);

  const addLogEntry = (action: string, details: string) => {
    if (!partner) return;
    const newLogEntry: ActivityLogEntry = {
      id: `log-${Date.now()}`,
      partnerId: partner.id,
      timestamp: new Date().toISOString(),
      user: 'Admin', // Placeholder user
      action,
      details,
    };
    setActivityLog(prev => [newLogEntry, ...prev]);
  };
  
  const affiliatedProfessionalDetails = useMemo(() => {
    if (!partner?.affiliatedProfessionals) return [];
    return partner.affiliatedProfessionals.map(link => {
      const professional = professionals.find(p => p.id === link.professionalId);
      return { ...link, professionalName: professional?.name, professionalSpecialty: professional?.specialty };
    }).sort((a, b) => a.professionalName?.localeCompare(b.professionalName || '') || 0);
  }, [partner]);

  const unaffiliatedProfessionals = useMemo(() => {
    const affiliatedIds = partner?.affiliatedProfessionals?.map(l => l.professionalId) || [];
    return professionals.filter(
      (prof) =>
        !affiliatedIds.includes(prof.id) &&
        prof.name.toLowerCase().includes(addProfSearch.toLowerCase())
    );
  }, [partner, addProfSearch]);
  
  const filteredExams = useMemo(() => {
      let exams = partnerExams;
      if (examSearch) {
        exams = exams.filter(exam =>
            exam.name.toLowerCase().includes(examSearch.toLowerCase()) ||
            exam.nomenclature.toLowerCase().includes(examSearch.toLowerCase())
        );
      }
      return exams.map(exam => ({
          ...exam,
          professionalName: professionals.find(p => p.id === exam.professionalId)?.name || 'Não atribuído'
      }));
  }, [partnerExams, examSearch]);

  if (!partner) {
    notFound();
  }

  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleEditSave = () => {
    const oldName = partner.name;
    setPartner((prev) => (prev ? { ...prev, ...editFormData } : undefined));
    addLogEntry('Edição de Parceiro', `Dados do parceiro '${oldName}' foram atualizados.`);
    toast({ title: 'Sucesso!', description: 'Dados do parceiro atualizados.' });
    setIsEditDialogOpen(false);
  };
  
  const handlePartnerStatusToggle = (isActive: boolean) => {
    const newStatus = isActive ? 'Ativo' : 'Inativo';
    setPartner(prev => prev ? { ...prev, status: newStatus } : undefined);
    addLogEntry(
      isActive ? 'Ativação de Parceiro' : 'Inativação de Parceiro',
      `O parceiro foi marcado como ${newStatus.toLowerCase()}.`
    );
    toast({ title: `Parceiro ${newStatus}!`, description: `O parceiro '${partner.name}' foi atualizado.` });
  };
  
  const handleOpenLinkDialog = (prof: typeof professionals[0]) => {
    setLinkingProfessional(prof);
    setEditingLink(null);
    setLinkFormData({ price: '', discount: '', observation: '' });
    setIsAddProfDialogOpen(false);
    setIsLinkDetailDialogOpen(true);
  }

  const handleOpenEditLinkDialog = (link: typeof affiliatedProfessionalDetails[0]) => {
    const originalLink = partner.affiliatedProfessionals?.find(l => l.id === link.id);
    if(originalLink) {
        setEditingLink(originalLink);
        setLinkingProfessional(null);
        setLinkFormData({ price: link.price, discount: link.discount, observation: link.observation });
        setIsLinkDetailDialogOpen(true);
    }
  }

  const handleLinkDetailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLinkFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSaveLink = () => {
    const professionalName = editingLink 
        ? professionals.find(p => p.id === editingLink.professionalId)?.name 
        : linkingProfessional?.name;

    if (editingLink) { // Editing existing link
        const updatedLinks = (partner.affiliatedProfessionals || []).map(link => 
            link.id === editingLink.id ? { ...link, ...linkFormData } : link
        );
        setPartner(prev => prev ? { ...prev, affiliatedProfessionals: updatedLinks } : undefined);
        addLogEntry('Edição de Vínculo', `O vínculo com '${professionalName}' foi atualizado.`);
        toast({ title: 'Sucesso!', description: 'Vínculo atualizado.' });
    } else if (linkingProfessional) { // Adding new link
        const newLink: ProfessionalLink = {
            id: `aff-${Date.now()}`,
            professionalId: linkingProfessional.id,
            status: 'Ativo',
            ...linkFormData,
        };
        const updatedLinks = [...(partner.affiliatedProfessionals || []), newLink];
        setPartner(prev => prev ? { ...prev, affiliatedProfessionals: updatedLinks } : undefined);
        addLogEntry('Criação de Vínculo', `Profissional '${professionalName}' foi vinculado.`);
        toast({ title: 'Sucesso!', description: 'Profissional vinculado.' });
    }
    setIsLinkDetailDialogOpen(false);
    setEditingLink(null);
    setLinkingProfessional(null);
  };
  
  const handleRemoveLink = (linkId: string) => {
      const linkToRemove = affiliatedProfessionalDetails.find(l => l.id === linkId);
      const updatedLinks = (partner.affiliatedProfessionals || []).filter(link => link.id !== linkId);
      setPartner(prev => prev ? { ...prev, affiliatedProfessionals: updatedLinks } : undefined);
      addLogEntry('Remoção de Vínculo', `O vínculo com '${linkToRemove?.professionalName}' foi removido.`);
      toast({ title: 'Vínculo Removido!', description: 'O profissional foi desvinculado.', variant: 'destructive' });
  }

  const handleLinkStatusToggle = (linkId: string) => {
    const updatedLinks = (partner.affiliatedProfessionals || []).map(link => {
        if (link.id === linkId) {
            const newStatus = link.status === 'Ativo' ? 'Inativo' : 'Ativo';
            const profName = professionals.find(p => p.id === link.professionalId)?.name;
            addLogEntry(
                newStatus === 'Ativo' ? 'Ativação de Vínculo' : 'Inativação de Vínculo',
                `O vínculo com '${profName}' foi marcado como ${newStatus.toLowerCase()}.`
            );
            return { ...link, status: newStatus };
        }
        return link;
    });
    setPartner(prev => prev ? { ...prev, affiliatedProfessionals: updatedLinks } : undefined);
    toast({ title: 'Status do Vínculo Alterado!' });
  };

  const handleOpenExamDialog = (exam: Exam | null = null) => {
    if (exam) {
      setEditingExam(exam);
      setExamFormData(exam);
    } else {
      setEditingExam(null);
      setExamFormData({ name: '', nomenclature: '', discount: '', observations: '', status: 'Ativo', professionalId: '' });
    }
    setIsExamDialogOpen(true);
  };

  const handleExamFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExamFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  
  const handleExamSelectChange = (field: 'professionalId' | 'status', value: string) => {
    setExamFormData(prev => ({ ...prev, [field]: value === 'unassigned' ? '' : value }));
  }

  const handleSaveExam = () => {
    let updatedExams: Exam[];
    const professionalName = professionals.find(p => p.id === examFormData.professionalId)?.name || 'Não atribuído';

    if (editingExam) {
      updatedExams = partnerExams.map((ex) => (ex.id === editingExam.id ? { ...editingExam, ...examFormData } : ex));
      addLogEntry('Edição de Serviço', `O serviço '${examFormData.name}' foi atualizado. Profissional: ${professionalName}.`);
      toast({ title: 'Sucesso!', description: 'Serviço atualizado.' });
    } else {
      updatedExams = [...partnerExams, { id: `ex-${Date.now()}`, ...examFormData }];
      addLogEntry('Criação de Serviço', `O serviço '${examFormData.name}' foi adicionado. Profissional: ${professionalName}.`);
      toast({ title: 'Sucesso!', description: 'Serviço adicionado.' });
    }
    setPartnerExams(updatedExams);
    setPartner((prev) => (prev ? { ...prev, exams: updatedExams } : undefined));
    setIsExamDialogOpen(false);
    setEditingExam(null);
  };
  
  const handleExamStatusToggle = (examId: string) => {
    let examName = '';
    const updatedExams = partnerExams.map(ex => {
        if (ex.id === examId) {
            const newStatus = ex.status === 'Ativo' ? 'Inativo' : 'Ativo';
            examName = ex.name;
            addLogEntry(
                newStatus === 'Ativo' ? 'Ativação de Serviço' : 'Inativação de Serviço',
                `O serviço '${examName}' foi marcado como ${newStatus.toLowerCase()}.`
            );
            return { ...ex, status: newStatus };
        }
        return ex;
    });
    setPartnerExams(updatedExams);
    setPartner((prev) => (prev ? { ...prev, exams: updatedExams } : undefined));
    toast({ title: 'Status do Serviço Alterado!', description: `O serviço '${examName}' foi atualizado.`});
  };
  
  const handleDeleteExam = (examId: string) => {
      const examToDelete = partnerExams.find(ex => ex.id === examId);
      const updatedExams = partnerExams.filter(ex => ex.id !== examId);
      setPartnerExams(updatedExams);
      setPartner((prev) => (prev ? { ...prev, exams: updatedExams } : undefined));
      addLogEntry('Exclusão de Serviço', `O serviço '${examToDelete?.name}' foi excluído.`);
      toast({ title: 'Serviço Excluído!', description: 'O serviço foi removido permanentemente.', variant: 'destructive'});
  }

  const handleMiscSave = (message: string) => {
    toast({ title: 'Sucesso!', description: message });
    setIsAnexoDialogOpen(false);
    setIsNotaDialogOpen(false);
  };

  const affiliatedProfessionalsForSelect = useMemo(() => {
    return (partner?.affiliatedProfessionals || [])
        .map(link => professionals.find(p => p.id === link.professionalId))
        .filter((p): p is Professional => !!p);
  }, [partner]);


  return (
    <>
      {/* Edit Partner Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Editar Parceiro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logoUrl" className="text-right">URL do Logo</Label>
                <Input id="logoUrl" value={editFormData.logoUrl} onChange={handleEditFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Razão Social</Label>
                <Input id="name" value={editFormData.name} onChange={handleEditFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cnpj" className="text-right">CNPJ/CPF</Label>
                <Input id="cnpj" value={editFormData.cnpj} onChange={handleEditFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">Contato</Label>
                <Input id="contact" value={editFormData.contact} onChange={handleEditFormChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Endereço</Label>
                <Input id="address" value={editFormData.address} onChange={handleEditFormChange} className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">Cidade</Label>
                <Input id="city" value={editFormData.city} onChange={handleEditFormChange} className="col-span-3" />
              </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
            <Button type="button" onClick={handleEditSave}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page Header */}
      <PageHeader title={partner.name}>
        <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>Editar Parceiro</Button>
        <Button variant="destructive" disabled>Excluir Parceiro</Button>
      </PageHeader>
      
      {/* Exam Dialog */}
      <Dialog open={isExamDialogOpen} onOpenChange={setIsExamDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingExam ? 'Editar' : 'Adicionar'} Serviço/Procedimento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Nome</Label><Input id="name" value={examFormData.name} onChange={handleExamFormChange} className="col-span-3" placeholder="Ex: Limpeza Dental"/></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="nomenclature" className="text-right">Nomenclatura</Label><Input id="nomenclature" value={examFormData.nomenclature} onChange={handleExamFormChange} className="col-span-3" placeholder="Opcional (Ex: LDP01)"/></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="discount" className="text-right">Desconto</Label><Input id="discount" value={examFormData.discount} onChange={handleExamFormChange} className="col-span-3" placeholder="Ex: 20% ou R$ 50,00"/></div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="professionalId" className="text-right">Profissional</Label>
                <Select value={examFormData.professionalId || 'unassigned'} onValueChange={(v) => handleExamSelectChange('professionalId', v)}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione um profissional..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="unassigned">Não atribuído</SelectItem>
                        {affiliatedProfessionalsForSelect.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name} ({p.specialty})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="observations" className="text-right">Observações</Label><Textarea id="observations" value={examFormData.observations} onChange={handleExamFormChange} className="col-span-3" placeholder="Descreva detalhes ou condições"/></div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
            <Button type="button" onClick={handleSaveExam}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Professional Dialog */}
      <Dialog open={isAddProfDialogOpen} onOpenChange={setIsAddProfDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Profissional ao Parceiro</DialogTitle>
            <DialogDescription>Pesquise e selecione um profissional para vincular a <strong>{partner.name}</strong>.</DialogDescription>
          </DialogHeader>
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome..." value={addProfSearch} onChange={(e) => setAddProfSearch(e.target.value)} className="pl-9" />
          </div>
          <ScrollArea className="max-h-80 -mx-6">
            <div className="space-y-2 px-6 py-2">
              {unaffiliatedProfessionals.length > 0 ? (
                unaffiliatedProfessionals.map(prof => (
                  <div key={prof.id} className="flex items-center justify-between p-2 rounded-md border">
                    <div>
                      <p className="font-medium">{prof.name}</p>
                      <p className="text-sm text-muted-foreground">{prof.specialty} - {prof.register}</p>
                    </div>
                    <Button size="sm" onClick={() => handleOpenLinkDialog(prof)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Vincular
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Nenhum profissional encontrado ou todos já estão vinculados.</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Link Details Dialog (for Add/Edit) */}
      <Dialog open={isLinkDetailDialogOpen} onOpenChange={setIsLinkDetailDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editingLink ? 'Editar Detalhes do Vínculo' : 'Detalhes do Vínculo'}</DialogTitle>
                  <DialogDescription>
                      Defina os detalhes de atendimento para {editingLink ? professionals.find(p => p.id === editingLink.professionalId)?.name : linkingProfessional?.name} neste parceiro.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="price" className="text-right">Valor Particular</Label><Input id="price" value={linkFormData.price} onChange={handleLinkDetailChange} className="col-span-3" placeholder="Ex: R$ 250,00" /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="discount" className="text-right">Desconto</Label><Input id="discount" value={linkFormData.discount} onChange={handleLinkDetailChange} className="col-span-3" placeholder="Ex: 20% ou R$ 50,00" /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="observation" className="text-right">Observações</Label><Textarea id="observation" value={linkFormData.observation} onChange={handleLinkDetailChange} className="col-span-3" placeholder="Detalhes do atendimento, convênios, etc." /></div>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                  <Button onClick={handleSaveLink}>{editingLink ? 'Salvar Alterações' : 'Salvar Vínculo'}</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Informações do Parceiro</CardTitle><CardDescription>Detalhes cadastrais, contato e status.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {partner.logoUrl && (
                <div className="w-full flex justify-center py-4">
                  <Image src={partner.logoUrl} alt={`Logo de ${partner.name}`} width={100} height={100} className="rounded-lg object-contain border p-2" data-ai-hint="logo company" />
                </div>
              )}
              <div className="flex items-start gap-4"><FileText className="h-5 w-5 text-muted-foreground mt-1 shrink-0" /><div><span className="font-semibold">CNPJ</span><p className="text-muted-foreground">{partner.cnpj}</p></div></div>
              <div className="flex items-start gap-4"><Phone className="h-5 w-5 text-muted-foreground mt-1 shrink-0" /><div><span className="font-semibold">Contato</span><p className="text-muted-foreground">{partner.contact}</p></div></div>
              <div className="flex items-start gap-4"><MapPin className="h-5 w-5 text-muted-foreground mt-1 shrink-0" /><div><span className="font-semibold">Endereço</span><p className="text-muted-foreground">{partner.address}</p></div></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="font-semibold">Status</span><Badge variant={partner.status === 'Ativo' ? 'default' : 'destructive'}>{partner.status}</Badge>
                </div>
                <div className='flex items-center space-x-2'>
                    <Label htmlFor="partner-status" className="text-sm text-muted-foreground">
                        {partner.status === 'Ativo' ? 'Ativo' : 'Inativo'}
                    </Label>
                    <Switch id="partner-status" checked={partner.status === 'Ativo'} onCheckedChange={handlePartnerStatusToggle} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Profissionais Vinculados</CardTitle><CardDescription>Gerencie os profissionais e os detalhes de seus atendimentos neste parceiro.</CardDescription></div>
              <Button variant="outline" onClick={() => setIsAddProfDialogOpen(true)}><UserPlus className="mr-2 h-4 w-4" />Adicionar</Button>
            </CardHeader>
            <CardContent>
              {affiliatedProfessionalDetails.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">Valor</TableHead>
                      <TableHead className="hidden md:table-cell">Desconto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliatedProfessionalDetails.map((profLink) => (
                      <TableRow key={profLink.id}>
                        <TableCell className="font-medium">
                            {profLink.professionalName}
                            <p className="text-xs text-muted-foreground">{profLink.professionalSpecialty}</p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{profLink.price}</TableCell>
                        <TableCell className="hidden md:table-cell">{profLink.discount}</TableCell>
                         <TableCell>
                            <Badge variant={profLink.status === 'Ativo' ? 'default' : 'outline'}>
                                {profLink.status}
                            </Badge>
                         </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Ações</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => handleOpenEditLinkDialog(profLink)}>Editar Vínculo</DropdownMenuItem>
                               <DropdownMenuItem onSelect={() => handleLinkStatusToggle(profLink.id)}>
                                {profLink.status === 'Ativo' ? 'Inativar Vínculo' : 'Ativar Vínculo'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => handleRemoveLink(profLink.id)}>Remover Vínculo</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhum profissional vinculado. Clique em "Adicionar" para começar.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2"><FlaskConical className="h-5 w-5" />Serviços e Procedimentos</div>
                <Button variant="outline" size="sm" onClick={() => handleOpenExamDialog()}><PlusCircle className="mr-2 h-4 w-4" />Adicionar</Button>
              </CardTitle>
              <CardDescription>Lista de serviços, seus descontos e os profissionais responsáveis.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome ou nomenclatura..." value={examSearch} onChange={e => setExamSearch(e.target.value)} className="pl-9" />
                </div>
              {filteredExams.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Procedimento</TableHead>
                      <TableHead className="hidden sm:table-cell">Profissional</TableHead>
                      <TableHead>Desconto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">
                            {exam.name}
                             <p className="text-xs text-muted-foreground">{exam.nomenclature}</p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-muted-foreground" />
                                <span>{exam.professionalName}</span>
                            </div>
                        </TableCell>
                        <TableCell>{exam.discount}</TableCell>
                        <TableCell>
                            <Badge variant={exam.status === 'Ativo' ? 'default' : 'outline'}>
                                {exam.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Ações</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenExamDialog(exam)}>Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExamStatusToggle(exam.id)}>
                                {exam.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteExam(exam.id)}>Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhum serviço ou procedimento encontrado.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Tag className="h-4 w-4" />Nicho Principal</CardTitle></CardHeader>
            <CardContent><p className="font-semibold">{partner.niche}</p><p className="text-muted-foreground text-sm">Principal área de atuação do parceiro.</p></CardContent>
          </Card>
          
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <History className="h-4 w-4" /> Histórico de Atividades
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-64">
                        {activityLog.length > 0 ? (
                            <div className="space-y-4">
                                {activityLog.map(log => (
                                    <div key={log.id} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 pt-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{log.action}</p>
                                            <p className="text-sm text-muted-foreground">{log.details}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true, locale: ptBR })} por {log.user}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-4">
                                Nenhuma atividade registrada para este parceiro.
                            </p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
            
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Paperclip className="h-4 w-4" />Anexos</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm text-center py-4">Nenhum anexo encontrado.</p>
              <Dialog open={isAnexoDialogOpen} onOpenChange={setIsAnexoDialogOpen}>
                <DialogTrigger asChild><Button variant="secondary" className="w-full mt-2">Adicionar Anexo</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Adicionar Novo Anexo</DialogTitle><DialogDescription>Selecione um arquivo para anexar ao perfil.</DialogDescription></DialogHeader>
                  <div className="grid gap-4 py-4"><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="file" className="text-right">Arquivo</Label><Input id="file" type="file" className="col-span-3" /></div></div>
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                    <Button type="button" onClick={() => handleMiscSave('Anexo salvo (simulação).')}>Salvar Anexo</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><StickyNote className="h-4 w-4" />Notas Internas</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm text-center py-4">Nenhuma nota interna.</p>
              <Dialog open={isNotaDialogOpen} onOpenChange={setIsNotaDialogOpen}>
                <DialogTrigger asChild><Button variant="secondary" className="w-full mt-2">Adicionar Nota</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Adicionar Nota Interna</DialogTitle><DialogDescription>Esta nota será visível apenas para administradores.</DialogDescription></DialogHeader>
                  <div className="grid gap-4 py-4"><Label htmlFor="note">Nota</Label><Textarea id="note" placeholder="Digite sua nota aqui..."/></div>
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                    <Button type="button" onClick={() => handleMiscSave('Nota salva (simulação).')}>Salvar Nota</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
