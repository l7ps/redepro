'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { nicheTree } from '@/lib/mock-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Pencil, Trash2, PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function NichosPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = Object.keys(nicheTree);

  const handleSave = () => {
    toast({
      title: 'Sucesso!',
      description: 'Nova categoria salva (simulação).',
    });
    setIsDialogOpen(false);
  };
  return (
    <>
      <PageHeader title="Gerenciamento de Nichos">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Adicionar Nicho
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Nicho</DialogTitle>
              <DialogDescription>
                Digite o nome da novo nicho de serviço (Ex: Psicologia).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Psicologia"
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
      </PageHeader>
      <Card>
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Nichos por Categoria</CardTitle>
                <CardDescription>
                  Organize e filtre os nichos de serviço oferecidos pelos parceiros.
                </CardDescription>
              </div>
               <div className="relative w-full sm:w-auto sm:min-w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nicho ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
               {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
            </TabsList>
            {categories.map((category) => {
              const lowercasedTerm = searchTerm.toLowerCase().trim();
              const allNiches = Object.entries(nicheTree[category] as Record<string, string[]>);
              const filteredNiches = lowercasedTerm
                ? allNiches.filter(([niche, subNiches]) =>
                    niche.toLowerCase().includes(lowercasedTerm) ||
                    subNiches.some(sub => sub.toLowerCase().includes(lowercasedTerm))
                  )
                : allNiches;

              return (
                <TabsContent key={category} value={category}>
                  {filteredNiches.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredNiches.map(([niche, subNiches]) => (
                        <AccordionItem value={niche} key={niche}>
                          <AccordionTrigger className="text-lg font-medium hover:no-underline">
                            <div className="flex items-center gap-4">
                              <span>{niche}</span>
                              <Badge variant="secondary">
                                {subNiches.length} serviços
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 pl-4 pt-2">
                              {subNiches.map((sub) => (
                                <li
                                  key={sub}
                                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                                >
                                  <span className="text-muted-foreground">{sub}</span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <Pencil className="h-4 w-4" />
                                      <span className="sr-only">Editar</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Excluir</span>
                                    </Button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                     <div className="text-center py-16 text-muted-foreground">
                        <p>Nenhum nicho ou serviço encontrado.</p>
                        <p className="text-sm">
                          Tente ajustar o termo de busca.
                        </p>
                    </div>
                  )}
              </TabsContent>
              )
            })}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
