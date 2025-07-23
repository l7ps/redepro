
'use client';

import { Bar, BarChart, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';
import { Activity, Building2, Users, Hospital, HeartPulse, Map, Tag } from 'lucide-react';
import { partners, professionals, activityLog } from '@/lib/mock-data';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  const recentActivity = activityLog.slice(0, 5);

  const {
    totalPartners,
    activePartners,
    totalProfessionals,
    totalAffiliations,
    hospitals,
    clinics,
    cityRanking,
    nicheRanking,
  } = useMemo(() => {
    const cityCount: { [key: string]: number } = {};
    const nicheCount: { [key: string]: number } = {};

    partners.forEach((p) => {
      cityCount[p.city] = (cityCount[p.city] || 0) + 1;
      nicheCount[p.niche] = (nicheCount[p.niche] || 0) + 1;
    });

    return {
      totalPartners: partners.length,
      activePartners: partners.filter((p) => p.status === 'Ativo').length,
      totalProfessionals: professionals.length,
      totalAffiliations: partners.reduce((acc, p) => acc + (p.affiliatedProfessionals?.length || 0), 0),
      hospitals: partners.filter((p) => p.type === 'Hospital'),
      clinics: partners.filter((p) => p.type.toLowerCase().includes('clínica')),
      cityRanking: Object.entries(cityCount).sort((a, b) => b[1] - a[1]),
      nicheRanking: Object.entries(nicheCount).sort((a, b) => b[1] - a[1]),
    };
  }, []);

  return (
    <>
      <PageHeader title="Painel Principal" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
         <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Parceiros</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPartners}</div>
                <p className="text-xs text-muted-foreground">{activePartners} ativos</p>
              </CardContent>
            </Card>
          </DialogTrigger>
           <DialogContent className="sm:max-w-lg">
             <DialogHeader>
                <DialogTitle>Todos os Parceiros ({totalPartners})</DialogTitle>
                <DialogDescription>Lista de todos os parceiros cadastrados na rede.</DialogDescription>
             </DialogHeader>
              <ScrollArea className="max-h-96">
                <Table>
                    <TableHeader>
                      <TableRow><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Cidade</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                        {partners.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>{item.city}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </ScrollArea>
           </DialogContent>
        </Dialog>

        <Dialog>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hospitais</CardTitle>
                    <Hospital className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{hospitals.length}</div>
                    <p className="text-xs text-muted-foreground">Total de hospitais na rede</p>
                  </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Hospitais ({hospitals.length})</DialogTitle>
                    <DialogDescription>Lista de todos os hospitais cadastrados.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                    <Table>
                        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Cidade</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {hospitals.map(item => (
                                <TableRow key={item.id}><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.city}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
        
        <Dialog>
             <DialogTrigger asChild>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clínicas</CardTitle>
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{clinics.length}</div>
                    <p className="text-xs text-muted-foreground">Total de clínicas na rede</p>
                  </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Clínicas ({clinics.length})</DialogTitle>
                    <DialogDescription>Lista de todas as clínicas cadastradas.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                    <Table>
                        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Cidade</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {clinics.map(item => (
                                <TableRow key={item.id}><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.city}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Profissionais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProfessionals}</div>
            <p className="text-xs text-muted-foreground">+5 este mês (simulado)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vínculos Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAffiliations}</div>
            <p className="text-xs text-muted-foreground">+10% desde o mês passado (simulado)</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Dialog>
            <DialogTrigger asChild>
                <Card className="lg:col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5" /> Cidades em Destaque</CardTitle>
                    <CardDescription>Cidades com o maior número de parceiros.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                        {cityRanking.slice(0, 4).map(([city, count]) => (
                            <div key={city} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{city}</span>
                                <span className="text-muted-foreground font-bold">{count} {count > 1 ? 'parceiros' : 'parceiro'}</span>
                            </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                 <DialogHeader>
                    <DialogTitle>Parceiros por Cidade</DialogTitle>
                    <DialogDescription>Contagem total de parceiros em cada cidade da rede.</DialogDescription>
                 </DialogHeader>
                 <ScrollArea className="max-h-96">
                    <Table>
                        <TableHeader><TableRow><TableHead>Cidade</TableHead><TableHead className="text-right">Quantidade</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {cityRanking.map(([city, count]) => (
                                <TableRow key={city}>
                                    <TableCell className="font-medium">{city}</TableCell>
                                    <TableCell className="text-right font-bold">{count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </ScrollArea>
            </DialogContent>
        </Dialog>
        
        <Dialog>
            <DialogTrigger asChild>
                 <Card className="lg:col-span-1 cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5" /> Especialidades em Destaque</CardTitle>
                    <CardDescription>Principais áreas de atuação dos parceiros.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2">
                        {nicheRanking.slice(0, 4).map(([niche, count]) => (
                            <div key={niche} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{niche}</span>
                                <span className="text-muted-foreground font-bold">{count} {count > 1 ? 'parceiros' : 'parceiro'}</span>
                            </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
            </DialogTrigger>
             <DialogContent className="sm:max-w-md">
                 <DialogHeader>
                    <DialogTitle>Parceiros por Especialidade</DialogTitle>
                    <DialogDescription>Contagem total de parceiros para cada especialidade/nicho.</DialogDescription>
                 </DialogHeader>
                 <ScrollArea className="max-h-96">
                    <Table>
                        <TableHeader><TableRow><TableHead>Especialidade/Nicho</TableHead><TableHead className="text-right">Quantidade</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {nicheRanking.map(([niche, count]) => (
                                <TableRow key={niche}>
                                    <TableCell className="font-medium">{niche}</TableCell>
                                    <TableCell className="text-right font-bold">{count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </ScrollArea>
            </DialogContent>
        </Dialog>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
             <CardDescription>Últimas ações realizadas no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
             {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((log) => (
                   <Link key={log.id} href={log.partnerId ? `/parceiros/${log.partnerId}` : '#'} className="block rounded-lg -m-2 p-2 hover:bg-muted/50 transition-colors">
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 pt-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-tight">{log.action}</p>
                            <p className="text-sm text-muted-foreground">{log.details}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: ptBR })}
                            </p>
                        </div>
                    </div>
                   </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma atividade recente para mostrar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
