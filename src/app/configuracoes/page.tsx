
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Building2, Eye, LayoutGrid, List, Columns, Palette, Check } from 'lucide-react';
import Image from 'next/image';

type ReportLayout = 'grid' | 'list' | 'columns';

interface ThemeColor {
  name: string;
  className: string;
  primary: string;
}

const themeColors: ThemeColor[] = [
  { name: 'Verde', className: 'bg-green-600', primary: '142.1 76.2% 36.3%' },
  { name: 'Padrão (Azul)', className: 'bg-blue-600', primary: '221.2 83.2% 53.3%' },
  { name: 'Roxo', className: 'bg-purple-600', primary: '262.1 83.3% 57.8%' },
  { name: 'Laranja', className: 'bg-orange-600', primary: '24.6 95% 53.1%' },
  { name: 'Cinza', className: 'bg-slate-600', primary: '215.3 19.3% 34.5%' },
];

const PreviewCard = ({ className }: { className?: string }) => (
    <div className={cn("bg-background/50 border rounded-lg p-3 space-y-2", className)}>
        <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground/50"/>
            <div className="h-3.5 bg-muted rounded-full w-3/4"></div>
        </div>
        <div className="h-2.5 bg-muted rounded-full w-full"></div>
        <div className="h-2.5 bg-muted rounded-full w-5/6"></div>
    </div>
);

const layoutOptions: { id: ReportLayout; label: string; icon: React.ElementType }[] = [
    { id: 'grid', label: 'Grade Compacta', icon: LayoutGrid },
    { id: 'list', label: 'Lista Vertical', icon: List },
    { id: 'columns', label: 'Colunas Duplas', icon: Columns },
];

const applyTheme = (primaryHsl: string) => {
    document.documentElement.style.setProperty('--primary', primaryHsl);
    document.documentElement.style.setProperty('--ring', primaryHsl);
};

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [reportFooter, setReportFooter] = useState('');
  const [selectedLayout, setSelectedLayout] = useState<ReportLayout>('grid');
  const [selectedColor, setSelectedColor] = useState<ThemeColor>(themeColors[0]);

  useEffect(() => {
    const savedLogo = localStorage.getItem('whiteLabelLogo');
    const savedFooter = localStorage.getItem('whiteLabelFooter');
    const savedLayout = localStorage.getItem('whiteLabelLayout') as ReportLayout | null;
    const savedColorName = localStorage.getItem('themeColorName');
    
    const colorToApply = themeColors.find(c => c.name === savedColorName) || themeColors[0];
    
    if (savedLogo) setLogoPreview(savedLogo);
    if (savedFooter) setReportFooter(savedFooter);
    if (savedLayout) setSelectedLayout(savedLayout);
    
    setSelectedColor(colorToApply);
    applyTheme(colorToApply.primary);
  }, []);
  
  const handleColorSelect = (color: ThemeColor) => {
      setSelectedColor(color);
      applyTheme(color.primary);
  }

  const handleSave = () => {
    if (logoPreview) {
      localStorage.setItem('whiteLabelLogo', logoPreview);
    } else {
      localStorage.removeItem('whiteLabelLogo');
    }
    localStorage.setItem('whiteLabelFooter', reportFooter);
    localStorage.setItem('whiteLabelLayout', selectedLayout);
    localStorage.setItem('themeColorName', selectedColor.name);
    
    toast({
      title: 'Configurações Salvas!',
      description: 'Suas personalizações foram aplicadas.',
    });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPreview = (layout: ReportLayout) => {
    switch (layout) {
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
            <PreviewCard />
          </div>
        );
      case 'list':
        return (
          <div className="flex flex-col gap-4">
            <PreviewCard />
            <PreviewCard />
          </div>
        );
      case 'columns':
        return (
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-4">
                <PreviewCard />
                <PreviewCard />
            </div>
            <div className="flex flex-col gap-4">
                <PreviewCard />
                <PreviewCard />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader title="Configurações">
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </PageHeader>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personalização da Marca (White-Label)</CardTitle>
            <CardDescription>
              Ajuste a aparência dos relatórios e documentos para refletir a
              identidade da sua empresa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="logoUpload">Logo da Empresa</Label>
               <Input
                id="logoUpload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="cursor-pointer"
              />
               {logoPreview && (
                <div className="mt-4 p-4 border rounded-lg inline-block">
                  <p className="text-sm font-medium mb-2">Pré-visualização:</p>
                  <Image
                    src={logoPreview}
                    alt="Pré-visualização do logo"
                    width={128}
                    height={128}
                    className="rounded-md object-contain"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Este logo aparecerá no cabeçalho dos relatórios impressos.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportFooter">Mensagem de Rodapé</Label>
              <Textarea
                id="reportFooter"
                placeholder="Ex: Contato: (XX) XXXX-XXXX | www.suaempresa.com"
                value={reportFooter}
                onChange={(e) => setReportFooter(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Esta mensagem será exibida no rodapé de todos os relatórios.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette /> Tema da Interface
                </CardTitle>
                <CardDescription>
                    Selecione a cor primária para a interface. A alteração é aplicada em tempo real.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {themeColors.map(color => (
                        <div key={color.name} className="flex flex-col items-center gap-2">
                             <button
                                onClick={() => handleColorSelect(color)}
                                className={cn(
                                    'w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center',
                                    selectedColor.name === color.name ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'
                                )}
                             >
                                <div className={cn('w-10 h-10 rounded-full', color.className)}>
                                    {selectedColor.name === color.name && (
                                        <div className="w-full h-full flex items-center justify-center bg-black/30 rounded-full">
                                            <Check className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                </div>
                             </button>
                             <span className="text-sm text-muted-foreground">{color.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Layout dos Relatórios</CardTitle>
            <CardDescription>
              Escolha o formato de exibição padrão para os relatórios gerados e visualize como ficará.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coluna de Opções */}
              <div className="md:col-span-1 space-y-4">
                 <h4 className="font-medium">Selecione uma opção</h4>
                {layoutOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedLayout(option.id)}
                    className={cn(
                      'w-full border-2 rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-all',
                      selectedLayout === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <option.icon className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-left">{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Coluna de Pré-visualização */}
              <div className="md:col-span-2">
                <div className="sticky top-4">
                  <h4 className="font-medium mb-4 flex items-center gap-2 text-muted-foreground"><Eye className="w-4 h-4"/> Pré-visualização</h4>
                  <div className="w-full bg-muted rounded-xl border p-6 min-h-[300px]">
                      {renderPreview(selectedLayout)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
