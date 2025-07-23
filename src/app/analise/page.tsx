
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { partners, professionals, activityLog } from '@/lib/mock-data';
import type { Partner, Professional, ActivityLogEntry } from '@/lib/mock-data';
import { subDays, isWithinInterval, format, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Users, TrendingUp, Calendar as CalendarIcon, Link2, ListChecks } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Period = '7d' | '30d' | '90d' | 'custom';

export default function AnalisePage() {
  const [period, setPeriod] = useState<Period>('7d');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });

  const {
    filteredPartners,
    filteredProfessionals,
    filteredActivities,
    newLinksCount,
    periodLabel,
  } = useMemo(() => {
    let startDate, endDate;

    if (period === 'custom' && dateRange?.from) {
      startDate = startOfDay(dateRange.from);
      endDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
    } else {
      const periodMap = { '7d': 7, '30d': 30, '90d': 90 };
      const days = periodMap[period as '7d' | '30d' | '90d'] || 7;
      endDate = endOfDay(new Date());
      startDate = startOfDay(subDays(endDate, days - 1));
    }
    const interval = { start: startDate, end: endDate };

    const partnersInPeriod = partners.filter((p) => isWithinInterval(new Date(p.registeredAt), interval));
    const professionalsInPeriod = professionals.filter((p) => isWithinInterval(new Date(p.registeredAt), interval));
    const activitiesInPeriod = activityLog.filter((log) => isWithinInterval(new Date(log.timestamp), interval));

    const linksInPeriod = activitiesInPeriod.filter(log => log.action === 'Criação de Vínculo').length;
    
    let currentPeriodLabel = 'Período inválido';
    const periodLabels = {
      '7d': 'Últimos 7 dias',
      '30d': 'Últimos 30 dias',
      '90d': 'Últimos 90 dias',
    };

    if (period !== 'custom') {
      currentPeriodLabel = periodLabels[period];
    } else if (dateRange?.from) {
      currentPeriodLabel = dateRange.to
        ? `${format(dateRange.from, 'dd/MM/y')} - ${format(dateRange.to, 'dd/MM/y')}`
        : format(dateRange.from, 'dd/MM/y');
    }

    return {
      filteredPartners: partnersInPeriod,
      filteredProfessionals: professionalsInPeriod,
      filteredActivities: activitiesInPeriod,
      newLinksCount: linksInPeriod,
      periodLabel: currentPeriodLabel,
    };
  }, [period, dateRange]);

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    if (p !== 'custom') {
      const days = { '7d': 7, '30d': 30, '90d': 90 }[p];
      setDateRange({ from: subDays(new Date(), days - 1), to: new Date() });
    }
  };

  return (
    <>
      <PageHeader title="Análise Gerencial">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md bg-muted p-1">
            {(['7d', '30d', '90d'] as Period[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handlePeriodChange(p)}
                className={cn('transition-all', period === p ? 'shadow-sm' : '')}
              >
                {{ '7d': '7 dias', '30d': '30 dias', '90d': '90 dias' }[p]}
              </Button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground',
                  period === 'custom' && 'border-primary'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  setPeriod('custom');
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </PageHeader>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-2">Resumo do Período: {periodLabel}</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Parceiros</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{filteredPartners.length}</div>
                <p className="text-xs text-muted-foreground">Total de novos parceiros cadastrados.</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Profissionais</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{filteredProfessionals.length}</div>
                <p className="text-xs text-muted-foreground">Total de novos profissionais cadastrados.</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Vínculos</CardTitle>
                <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{newLinksCount}</div>
                <p className="text-xs text-muted-foreground">Profissionais vinculados a parceiros.</p>
            </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Resultados Detalhados</CardTitle>
            <CardDescription>Visualize os dados brutos correspondentes ao período selecionado.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="partners">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="partners">Parceiros ({filteredPartners.length})</TabsTrigger>
                    <TabsTrigger value="professionals">Profissionais ({filteredProfessionals.length})</TabsTrigger>
                    <TabsTrigger value="activities">Atividades ({filteredActivities.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="partners" className="mt-4">
                   <Table>
                        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Cidade</TableHead><TableHead>Data de Cadastro</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredPartners.length > 0 ? filteredPartners.map(p => (
                                <TableRow key={p.id}><TableCell className="font-medium">{p.name}</TableCell><TableCell><Badge variant="outline">{p.type}</Badge></TableCell><TableCell>{p.city}</TableCell><TableCell>{format(new Date(p.registeredAt), 'dd/MM/yyyy')}</TableCell></TableRow>
                            )) : <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum parceiro encontrado.</TableCell></TableRow>}
                        </TableBody>
                   </Table>
                </TabsContent>
                <TabsContent value="professionals" className="mt-4">
                    <Table>
                        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Especialidade</TableHead><TableHead>Data de Cadastro</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredProfessionals.length > 0 ? filteredProfessionals.map(p => (
                                <TableRow key={p.id}><TableCell className="font-medium">{p.name}</TableCell><TableCell><Badge variant="secondary">{p.specialty}</Badge></TableCell><TableCell>{format(new Date(p.registeredAt), 'dd/MM/yyyy')}</TableCell></TableRow>
                            )) : <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum profissional encontrado.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="activities" className="mt-4">
                     <Table>
                        <TableHeader><TableRow><TableHead>Ação</TableHead><TableHead>Detalhes</TableHead><TableHead>Usuário</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredActivities.length > 0 ? filteredActivities.map(log => (
                                <TableRow key={log.id}>
                                  <TableCell className="font-medium">{log.action}</TableCell>
                                  <TableCell className="text-muted-foreground">{log.details}</TableCell>
                                  <TableCell>{log.user}</TableCell>
                                  <TableCell>{format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhuma atividade encontrada.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
