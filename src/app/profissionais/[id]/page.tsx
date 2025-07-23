
'use client';

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { partners, professionals, activityLog } from '@/lib/mock-data';
import type { Partner, ProfessionalLink, ActivityLogEntry, Exam } from '@/lib/mock-data';
import { User, Award, Tag, Briefcase, Link as LinkIcon, History, FlaskConical, DollarSign, Percent } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';


interface AffiliationInfo {
  partner: Partner;
  link: ProfessionalLink;
  services: Exam[];
}

export default function ProfissionalDetalhesPage() {
  const params = useParams<{ id: string }>();

  const professional = useMemo(
    () => professionals.find((p) => p.id === params.id),
    [params.id]
  );
  
  const professionalActivityLog = useMemo(() => {
    return activityLog.filter(log => log.professionalId === params.id)
                      .sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
  }, [params.id]);

  const affiliations = useMemo(() => {
    if (!professional) return [];
    const results: AffiliationInfo[] = [];
    for (const partner of partners) {
      if (partner.affiliatedProfessionals) {
        for (const link of partner.affiliatedProfessionals) {
          if (link.professionalId === professional.id) {
            const servicesForProfessional = (partner.exams || []).filter(
              (exam) => exam.professionalId === professional.id && exam.status === 'Ativo'
            );
            results.push({ partner, link, services: servicesForProfessional });
          }
        }
      }
    }
    return results;
  }, [professional]);

  if (!professional) {
    notFound();
  }

  return (
    <>
      <PageHeader title={professional.name} />
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Profissional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <User className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <span className="font-semibold">Nome Completo</span>
                  <p className="text-muted-foreground">{professional.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Award className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <span className="font-semibold">Nº de Registro</span>
                  <p className="text-muted-foreground">
                    {professional.register}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Tag className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <span className="font-semibold">Especialidade</span>
                  <p className="text-muted-foreground">
                    {professional.specialty}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <History className="h-4 w-4" /> Histórico de Atividades
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-64">
                        {professionalActivityLog.length > 0 ? (
                            <div className="space-y-4">
                                {professionalActivityLog.map(log => (
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
                                Nenhuma atividade registrada para este profissional.
                            </p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        {/* Affiliations Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Vínculos com Parceiros ({affiliations.length})
              </CardTitle>
              <CardDescription>
                Parceiros onde este profissional atende e os serviços que oferece.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {affiliations.length > 0 ? (
                <div className="space-y-4">
                  {affiliations.map(({ partner, link, services }) => (
                    <Card key={`${partner.id}-${link.id}`} className="bg-muted/50">
                        <CardHeader className="flex flex-row justify-between items-start pb-4">
                            <div>
                                <h4 className="font-semibold">{partner.name}</h4>
                                <p className="text-sm text-muted-foreground">{partner.city}</p>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/parceiros/${partner.id}`}>
                                    <LinkIcon className="mr-2 h-3 w-3" /> Ver Parceiro
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm space-y-2 text-foreground">
                                <div className="flex items-center gap-2">
                                    <DollarSign size={14} className="text-green-600"/> 
                                    <strong>Valor Atendimento:</strong> {link.price || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Percent size={14} className="text-blue-600"/> 
                                    <strong>Desconto:</strong> {link.discount || 'N/A'}
                                </div>
                            </div>
                            {services.length > 0 && (
                                <>
                                    <Separator className="my-3" />
                                    <h5 className="text-sm font-semibold mb-2 flex items-center gap-2"><FlaskConical size={14} /> Serviços Prestados</h5>
                                    <ul className="list-disc list-inside pl-1 space-y-1">
                                    {services.map(service => (
                                        <li key={service.id} className="text-sm text-muted-foreground">
                                            {service.name} <Badge variant="secondary" className="ml-1">{service.discount}</Badge>
                                        </li>
                                    ))}
                                    </ul>
                                </>
                            )}
                        </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    Este profissional não está vinculado a nenhum parceiro no
                    momento.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
