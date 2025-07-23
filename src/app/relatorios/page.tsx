
'use client';
import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Printer, Phone, FileText, Building2, Download, Search, Siren, FileSearch, User, DollarSign, Percent, Info, FlaskConical, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { partners, nicheTree, professionals } from '@/lib/mock-data';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Partner, Exam, ProfessionalLink, Professional } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Combobox } from '@/components/ui/combobox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

type ReportLayout = 'grid' | 'list' | 'columns';

const cities = [...new Set(partners.map((item) => item.city))].sort();
const healthPartnerTypes = [...new Set(partners.filter(p => p.category === 'Saúde').map(p => p.type))].sort();
const otherCategories = Object.keys(nicheTree).filter(c => c !== 'Saúde');

const allExams = [
  ...new Set(
    partners.flatMap((p) => (p.exams ? p.exams.map((e) => e.name) : []))
  ),
]
  .sort()
  .map((examName) => ({
    value: examName.toLowerCase(),
    label: examName,
  }));

const allProfessionals = professionals
  .map((prof) => ({
    value: prof.id,
    label: prof.name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));


export default function RelatoriosPage() {
  const { toast } = useToast();
  const userRole = 'admin'; 

  const [partnerReportData, setPartnerReportData] = useState<Partner[] | null>(null);
  const [examReportData, setExamReportData] = useState<{ partner: Partner; exam: Exam }[] | null>(null);

  const [reportType, setReportType] = useState<'partners' | 'exams'>('partners');
  const [partnerReportType, setPartnerReportType] = useState<'health' | 'other'>('health');

  const [healthFilters, setHealthFilters] = useState({ partnerType: '', niche: '', service: '', city: '', status: 'Ativo', professionalId: '' });
  const availableHealthNiches = useMemo(() => Object.keys(nicheTree['Saúde'] || {}), []);
  const availableHealthServices = useMemo(() => {
    return healthFilters.niche ? nicheTree['Saúde'][healthFilters.niche] || [] : [];
  }, [healthFilters.niche]);
  
  const [otherFilters, setOtherFilters] = useState({ category: '', niche: '', subcategory: '', city: '', status: 'Ativo' });
  const availableOtherNiches = useMemo(() => {
    return otherFilters.category ? Object.keys(nicheTree[otherFilters.category] || {}) : [];
  }, [otherFilters.category]);
  const availableOtherSubcategories = useMemo(() => {
      return otherFilters.category && otherFilters.niche ? nicheTree[otherFilters.category]?.[otherFilters.niche] || [] : [];
  }, [otherFilters.category, otherFilters.niche]);

  const [examSearchTerm, setExamSearchTerm] = useState('');
  const [examCity, setExamCity] = useState('');

  const [reportLayout, setReportLayout] = useState<ReportLayout>('grid');
  
  const [displayOptions, setDisplayOptions] = useState({
    showLinkDetails: true,
    showPrice: true,
    showDiscount: true,
    showObservations: true,
  });

  useEffect(() => {
    const savedLayout = localStorage.getItem('whiteLabelLayout') as ReportLayout | null;
    if (savedLayout) {
        setReportLayout(savedLayout);
    }
  }, []);

  const handleDisplayOptionChange = (option: keyof typeof displayOptions, checked: boolean) => {
    setDisplayOptions(prev => ({...prev, [option]: checked}));
  }

  const handleGeneratePartnerReport = () => {
    let filteredData = partners;
    let activeFilters;

    if (partnerReportType === 'health') {
        activeFilters = healthFilters;
        filteredData = filteredData.filter((item) => item.category === 'Saúde');
        if (activeFilters.partnerType) filteredData = filteredData.filter((item) => item.type === activeFilters.partnerType);
        if (activeFilters.niche) filteredData = filteredData.filter((item) => item.niche === activeFilters.niche);
        if (activeFilters.service) {
          const lowercasedService = activeFilters.service.toLowerCase();
          filteredData = filteredData.filter(p => 
            p.exams?.some(e => e.name.toLowerCase() === lowercasedService)
          );
        }
        if (activeFilters.professionalId) {
            filteredData = filteredData.filter(p => 
                p.affiliatedProfessionals?.some(link => link.professionalId === activeFilters.professionalId)
            );
        }
    } else {
        activeFilters = otherFilters;
        if (!activeFilters.category) {
            toast({ title: 'Atenção', description: 'Por favor, selecione uma categoria.', variant: 'destructive'});
            return;
        }
        filteredData = filteredData.filter((item) => item.category === activeFilters.category);
        if (activeFilters.niche) filteredData = filteredData.filter((item) => item.niche === activeFilters.niche);
        if (activeFilters.subcategory) {
             const lowercasedSubcategory = activeFilters.subcategory.toLowerCase();
             filteredData = filteredData.filter(p => p.niche.toLowerCase() === lowercasedSubcategory);
        }
    }

    if (activeFilters.city) filteredData = filteredData.filter((item) => item.city === activeFilters.city);
    if (activeFilters.status && activeFilters.status !== 'all') {
      filteredData = filteredData.filter((item) => item.status === activeFilters.status);
    }

    setPartnerReportData(filteredData);
    setExamReportData(null);
    toast({
      title: 'Relatório Gerado',
      description: `Encontrado(s) ${filteredData.length} resultado(s).`,
    });
  };

  const handleGenerateExamReport = () => {
    if (!examSearchTerm.trim()) {
      toast({ title: 'Atenção', description: 'Por favor, digite um termo para buscar o exame.', variant: 'destructive'});
      return;
    }

    const lowercasedTerm = examSearchTerm.toLowerCase().trim();
    const results: { partner: Partner; exam: Exam }[] = [];
    
    let filteredPartners = partners.filter(p => p.status === 'Ativo');

    if (examCity) {
      filteredPartners = filteredPartners.filter(p => p.city === examCity);
    }
    
    filteredPartners.forEach(partner => {
      if (partner.exams) {
        partner.exams.forEach(exam => {
          if (exam.status === 'Ativo' && (exam.name.toLowerCase().includes(lowercasedTerm) || exam.nomenclature.toLowerCase().includes(lowercasedTerm))) {
            results.push({ partner, exam });
          }
        });
      }
    });

    setExamReportData(results);
    setPartnerReportData(null);
    toast({
      title: 'Relatório de Exames Gerado',
      description: `Encontrado(s) ${results.length} resultado(s) para sua busca.`,
    });
  };

  const handleExportCSV = () => {
    const dataToExport = partnerReportData;
    if (!dataToExport || dataToExport.length === 0) {
      toast({ title: 'Nenhum dado para exportar', description: 'Gere um relatório de parceiros antes de exportar.', variant: 'destructive' });
      return;
    }

    const headers = ['Nome', 'Categoria', 'Tipo', 'CNPJ', 'Endereço', 'Contato', 'Status'];
    const csvRows = [headers.join(',')];

    for (const partner of dataToExport) {
      const values = [ `"${partner.name.replace(/"/g, '""')}"`, `"${partner.category}"`, `"${partner.type}"`, `"${partner.cnpj}"`, `"${partner.address.replace(/"/g, '""')}"`, `"${partner.contact}"`, `"${partner.status}"` ];
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorio_parceiros.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const PartnerReportResults = ({ data }: { data: Partner[] }) => {
    const filters = partnerReportType === 'health' ? healthFilters : otherFilters;
    const { professionalId } = healthFilters;
    const serviceFilter = 'service' in filters ? filters.service : filters.subcategory;
    const nicheFilter = filters.niche;

    const layoutClasses = {
        grid: 'report-layout-grid grid grid-cols-1 md:grid-cols-2 gap-4',
        list: 'report-layout-list flex flex-col gap-4',
        columns: 'report-layout-columns space-y-4'
    };
    
    return (
      <div className={layoutClasses[reportLayout]}>
        {data.map((item) => {
          let servicesToShow = item.exams || [];
          if (serviceFilter) {
            servicesToShow = servicesToShow.filter(exam => exam.name.toLowerCase() === serviceFilter.toLowerCase());
          } else if (nicheFilter) {
            const nicheServices = (nicheTree[item.category]?.[nicheFilter] || []).map(s => s.toLowerCase());
            servicesToShow = servicesToShow.filter(exam => nicheServices.includes(exam.name.toLowerCase()));
          }

          let professionalsToShow: (ProfessionalLink & { professional: Professional })[] = [];
          if (displayOptions.showLinkDetails) {
            const allLinks = (item.affiliatedProfessionals || [])
              .map(link => ({...link, professional: professionals.find(p => p.id === link.professionalId)}))
              .filter((link): link is ProfessionalLink & { professional: Professional } => !!(link.professional && link.status === 'Ativo'));

            if (professionalId) {
              professionalsToShow = allLinks.filter(link => link.professional.id === professionalId);
            } else if (serviceFilter) {
              const serviceProfessionalIds = new Set(servicesToShow.map(s => s.professionalId));
              professionalsToShow = allLinks.filter(link => serviceProfessionalIds.has(link.professionalId));
            } else {
              professionalsToShow = allLinks;
            }
          }

          return (
            <Card key={item.id} className="no-break flex flex-col">
              <CardContent className="p-4 flex gap-4 items-start">
                  {item.logoUrl ? ( <Image src={item.logoUrl} alt={`Logo de ${item.name}`} width={64} height={64} className="rounded-md object-contain border bg-white p-1" data-ai-hint="logo company" /> ) : ( <div className="w-16 h-16 flex-shrink-0 rounded-md border bg-muted flex items-center justify-center text-muted-foreground"><Building2 className="w-8 h-8" /></div> )}
                  <div className="flex-1 space-y-2">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.address}</p>
                      <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                          <span className="flex items-center gap-1.5"><Phone size={14} /> {item.contact}</span>
                          <span className="flex items-center gap-1.5"><FileText size={14} /> {item.cnpj}</span>
                      </div>
                       <div className="text-sm flex items-center gap-2 pt-1">
                           <Badge variant="secondary">{item.type}</Badge>
                           <Badge variant="outline">{item.niche}</Badge>
                           <Badge variant={item.status === 'Ativo' ? 'default' : 'destructive'}>{item.status}</Badge>
                       </div>
                  </div>
              </CardContent>
              {professionalsToShow.length > 0 && (
                <div className="flex-grow flex flex-col">
                    <Separator />
                    <CardContent className="p-4 flex-grow">
                          <div className="mb-4">
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2"><Briefcase size={16}/>Profissionais Vinculados</h5>
                            <div className="space-y-3">
                                {professionalsToShow.map(link => (
                                    <div key={link.id} className="text-sm">
                                        <p className="font-medium flex items-center gap-2"><User size={14}/>{link.professional?.name} <span className="text-xs text-muted-foreground">({link.professional?.specialty})</span></p>
                                        <div className="pl-6 mt-1 space-y-1 text-muted-foreground">
                                            {displayOptions.showPrice && <div className="flex items-center gap-2"><DollarSign size={14} className="text-green-600"/> <strong>Valor Particular:</strong> {link.price || 'N/A'}</div>}
                                            {displayOptions.showDiscount && <div className="flex items-center gap-2"><Percent size={14} className="text-blue-600"/> <strong>Desconto:</strong> {link.discount || 'N/A'}</div>}
                                            {displayOptions.showObservations && link.observation && <p className="pt-1 flex items-start gap-2"><Info size={14} className="mt-0.5"/>{link.observation}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                          </div>
                    </CardContent>
                </div>
              )}
               {(nicheFilter || serviceFilter) && servicesToShow.length > 0 && (
                <div className="flex-grow flex flex-col">
                     <Separator />
                     <CardContent className="p-4 flex-grow">
                        <div>
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2"><FlaskConical size={16}/>Serviços de {nicheFilter}</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {servicesToShow.map(exam => (
                                    <li key={exam.id}>{exam.name} {displayOptions.showDiscount && exam.discount && <Badge variant="secondary" className="ml-2">{exam.discount}</Badge>}</li>
                                ))}
                            </ul>
                        </div>
                     </CardContent>
                 </div>
               )}
          </Card>
           )
        })}
      </div>
    );
  }

  const ExamReportResults = ({ data }: { data: { partner: Partner; exam: Exam }[] }) => {
     const layoutClasses = {
        grid: 'report-layout-grid grid grid-cols-1 md:grid-cols-2 gap-4',
        list: 'report-layout-list flex flex-col gap-4',
        columns: 'report-layout-columns space-y-4'
    };
    
    return (
      <div className={layoutClasses[reportLayout]}>
        {data.map(({ partner, exam }) => (
          <Card key={`${partner.id}-${exam.id}`} className="no-break">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                {partner.logoUrl ? ( <Image src={partner.logoUrl} alt={`Logo de ${partner.name}`} width={64} height={64} className="rounded-md object-contain border bg-white p-1" data-ai-hint="logo company" /> ) : ( <div className="w-16 h-16 flex-shrink-0 rounded-md border bg-muted flex items-center justify-center text-muted-foreground"><Building2 className="w-8 h-8" /></div> )}
                <div className="flex-1 space-y-2">
                    <h4 className="font-bold text-lg">{partner.name}</h4>
                    <p className="text-sm text-muted-foreground">{partner.address}</p>
                    <div className="text-sm text-muted-foreground flex items-center gap-x-4 gap-y-1 pt-1">
                        <span className="flex items-center gap-1.5"><Phone size={14} /> {partner.contact}</span>
                    </div>
                    <Card className="bg-muted/50 mt-2">
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">{exam.name}</CardTitle>
                         {displayOptions.showDiscount && exam.discount && <CardDescription>Desconto oferecido: <strong>{exam.discount}</strong></CardDescription>}
                      </CardHeader>
                      {displayOptions.showObservations && exam.observations && <CardContent className="p-3 pt-0 text-sm">{exam.observations}</CardContent>}
                    </Card>
                </div>
            </CardContent>
        </Card>
        ))}
      </div>
    )
  };
  
  const RenderResults = () => {
    const hasPartnerData = partnerReportData && partnerReportData.length > 0;
    const hasExamData = examReportData && examReportData.length > 0;

    if (!partnerReportData && !examReportData) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4 py-16">
                <FileSearch className="h-16 w-16" />
                <h3 className="text-lg font-semibold">Gere um Relatório</h3>
                <p>Use os filtros ao lado para começar a buscar dados.</p>
            </div>
        );
    }

    if ((partnerReportData && partnerReportData.length === 0) || (examReportData && examReportData.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4 py-16">
                <Siren className="h-16 w-16 text-destructive/50" />
                <h3 className="text-lg font-semibold">Nenhum Resultado</h3>
                <p>Não encontramos dados para os filtros selecionados. Tente uma busca mais ampla.</p>
            </div>
        );
    }
    
    if (hasPartnerData) return <PartnerReportResults data={partnerReportData} />;
    if (hasExamData) return <ExamReportResults data={examReportData} />;
    
    return null;
  }
  
  const FilterSection: React.FC<{title: string; description?: string; children: React.ReactNode; className?: string}> = ({ title, description, children, className }) => (
    <div className={cn("grid gap-2", className)}>
        <div>
            <h4 className="font-semibold">{title}</h4>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {children}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Gerador de Relatórios" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        <aside className="lg:col-span-1 print:hidden">
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>Selecione o tipo de relatório e aplique os filtros desejados.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Tabs value={reportType} onValueChange={(v) => setReportType(v as 'partners' | 'exams')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="partners">Parceiros</TabsTrigger>
                            <TabsTrigger value="exams">Exames</TabsTrigger>
                        </TabsList>
                        <TabsContent value="partners" className="pt-4">
                            <RadioGroup value={partnerReportType} onValueChange={(v) => setPartnerReportType(v as 'health' | 'other')} className="flex items-center space-x-4 mb-6">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="health" id="r-health" />
                                    <Label htmlFor="r-health">Saúde</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="r-other" />
                                    <Label htmlFor="r-other">Outras Áreas</Label>
                                </div>
                            </RadioGroup>
                            {partnerReportType === 'health' ? (
                                <div className="space-y-6">
                                    <FilterSection title="Buscar por Profissional">
                                        <Combobox 
                                            items={allProfessionals} 
                                            value={healthFilters.professionalId} 
                                            onValueChange={(v) => setHealthFilters(f => ({ ...f, professionalId: v}))}
                                            placeholder="Selecione um profissional..."
                                            emptyMessage="Nenhum profissional encontrado."
                                        />
                                    </FilterSection>
                                    <FilterSection title="Tipo de Parceiro"><Select value={healthFilters.partnerType} onValueChange={(v) => setHealthFilters(f => ({ ...f, partnerType: v === 'all' ? '' : v }))}><SelectTrigger id="health-partnerType"><SelectValue placeholder="Todos os tipos" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os tipos</SelectItem>{healthPartnerTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></FilterSection>
                                    <FilterSection title="Especialidade"><Select value={healthFilters.niche} onValueChange={(v) => setHealthFilters(f => ({ ...f, niche: v === 'all' ? '' : v, service: '' }))}><SelectTrigger id="health-niche"><SelectValue placeholder="Todas as especialidades" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as especialidades</SelectItem>{availableHealthNiches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select></FilterSection>
                                    {healthFilters.niche && <FilterSection title="Serviço"><Select value={healthFilters.service} onValueChange={(v) => setHealthFilters(f => ({ ...f, service: v === 'all' ? '' : v }))}><SelectTrigger id="health-service"><SelectValue placeholder="Todos os serviços" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os serviços</SelectItem>{availableHealthServices.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></FilterSection>}
                                    <FilterSection title="Localização"><Select value={healthFilters.city} onValueChange={(v) => setHealthFilters(f => ({...f, city: v === 'all' ? '' : v}))}><SelectTrigger id="health-city"><SelectValue placeholder="Todas as cidades" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as cidades</SelectItem>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></FilterSection>
                                    {userRole === 'admin' && <FilterSection title="Status"><Select value={healthFilters.status} onValueChange={(v) => setHealthFilters(f => ({...f, status: v}))}><SelectTrigger id="health-status"><SelectValue placeholder="Selecione um status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="Ativo">Apenas Ativos</SelectItem><SelectItem value="Inativo">Apenas Inativos</SelectItem></SelectContent></Select></FilterSection>}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <FilterSection title="Categoria"><Select value={otherFilters.category} onValueChange={(v) => setOtherFilters(f => ({ ...f, category: v, niche: '', subcategory: '' }))}><SelectTrigger id="other-category"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger><SelectContent>{otherCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></FilterSection>
                                    {otherFilters.category && <FilterSection title="Serviços"><Select value={otherFilters.niche} onValueChange={(v) => setOtherFilters(f => ({ ...f, niche: v === 'all' ? '' : v, subcategory: '' }))} disabled={!otherFilters.category}><SelectTrigger id="other-niche"><SelectValue placeholder="Todos os serviços" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os serviços</SelectItem>{availableOtherNiches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select></FilterSection>}
                                    {otherFilters.niche && <FilterSection title="Subcategoria"><Select value={otherFilters.subcategory} onValueChange={(v) => setOtherFilters(f => ({ ...f, subcategory: v === 'all' ? '' : v }))}><SelectTrigger id="other-subcategory"><SelectValue placeholder="Todas as subcategorias" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as subcategorias</SelectItem>{availableOtherSubcategories.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></FilterSection>}
                                    <FilterSection title="Localização"><Select value={otherFilters.city} onValueChange={(v) => setOtherFilters(f => ({...f, city: v === 'all' ? '' : v}))}><SelectTrigger id="other-city"><SelectValue placeholder="Todas as cidades" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as cidades</SelectItem>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></FilterSection>
                                    {userRole === 'admin' && <FilterSection title="Status"><Select value={otherFilters.status} onValueChange={(v) => setOtherFilters(f => ({...f, status: v}))}><SelectTrigger id="other-status"><SelectValue placeholder="Selecione um status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="Ativo">Apenas Ativos</SelectItem><SelectItem value="Inativo">Apenas Inativos</SelectItem></SelectContent></Select></FilterSection>}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="exams" className="pt-4 space-y-6">
                            <FilterSection title="Nome ou Nomenclatura do Exame" description="Digite para buscar e autocompletar.">
                                <Combobox items={allExams} value={examSearchTerm} onValueChange={setExamSearchTerm} placeholder="Busque um exame..." emptyMessage="Nenhum exame encontrado."/>
                            </FilterSection>
                            <FilterSection title="Localização">
                                <Select value={examCity} onValueChange={(value) => setExamCity(value === 'all-cities' ? '' : value)}>
                                    <SelectTrigger id="exam-city"><SelectValue placeholder="Todas as cidades" /></SelectTrigger>
                                    <SelectContent><SelectItem value="all-cities">Todas as cidades</SelectItem>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </FilterSection>
                        </TabsContent>
                    </Tabs>
                    <Separator className="my-6" />
                     <FilterSection title="Opções de Exibição" className="space-y-2">
                        {reportType === 'partners' && (
                          <div className="flex items-center space-x-2">
                              <Checkbox id="display-link-details" checked={displayOptions.showLinkDetails} onCheckedChange={(c) => handleDisplayOptionChange('showLinkDetails', !!c)} />
                              <Label htmlFor="display-link-details" className="font-normal cursor-pointer">Exibir detalhes dos vínculos</Label>
                          </div>
                        )}
                        <div className={cn("space-y-2", reportType === 'partners' && displayOptions.showLinkDetails ? 'pl-6' : '')}>
                          {(!displayOptions.showLinkDetails && reportType !== 'partners') || displayOptions.showLinkDetails && (
                            <>
                              {reportType === 'partners' && <div className="flex items-center space-x-2">
                                  <Checkbox id="display-price" checked={displayOptions.showPrice} onCheckedChange={(c) => handleDisplayOptionChange('showPrice', !!c)} />
                                  <Label htmlFor="display-price" className="font-normal cursor-pointer">Exibir valor particular</Label>
                              </div>}
                              <div className="flex items-center space-x-2">
                                  <Checkbox id="display-discount" checked={displayOptions.showDiscount} onCheckedChange={(c) => handleDisplayOptionChange('showDiscount', !!c)} />
                                  <Label htmlFor="display-discount" className="font-normal cursor-pointer">Exibir descontos</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <Checkbox id="display-observations" checked={displayOptions.showObservations} onCheckedChange={(c) => handleDisplayOptionChange('showObservations', !!c)} />
                                  <Label htmlFor="display-observations" className="font-normal cursor-pointer">Exibir observações</Label>
                              </div>
                            </>
                          )}
                        </div>
                    </FilterSection>
                </CardContent>
                <CardFooter>
                     <Button className="w-full" onClick={reportType === 'partners' ? handleGeneratePartnerReport : handleGenerateExamReport}>
                        <Search className="mr-2 h-4 w-4" />
                        Gerar Relatório
                    </Button>
                </CardFooter>
            </Card>
        </aside>

        <main className="lg:col-span-3">
             <Card className="min-h-full print:shadow-none print:border-none print:bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between print:hidden">
                    <div>
                        <CardTitle>Visualização do Relatório</CardTitle>
                        <CardDescription>Os resultados filtrados aparecerão aqui.</CardDescription>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button variant="outline" size="icon" onClick={handleExportCSV} aria-label="Exportar para CSV" disabled={!partnerReportData || partnerReportData.length === 0}>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => window.print()} aria-label="Imprimir Relatório" disabled={(!partnerReportData && !examReportData) || (partnerReportData?.length === 0 && examReportData?.length === 0)}>
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="print:p-0">
                   <div className="print-area">
                    <RenderResults />
                   </div>
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
