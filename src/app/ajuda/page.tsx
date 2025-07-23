import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HelpCircle, Link2 } from 'lucide-react';

export default function AjudaPage() {
  return (
    <>
      <PageHeader title="Central de Ajuda" />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Guia para Administradores</CardTitle>
            <CardDescription>
              Aprenda a gerenciar todos os aspectos da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Gerenciando Parceiros</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>
                    A seção <strong>Parceiros</strong> permite o controle total sobre as
                    clínicas, hospitais, laboratórios e outras entidades da rede.
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Como Cadastrar um Novo Parceiro:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>
                        Navegue até a página{' '}
                        <a href="/parceiros" className="text-primary hover:underline">
                          Parceiros
                        </a>{' '}
                        no menu lateral.
                      </li>
                      <li>Clique no botão <strong>"Novo Parceiro"</strong> no topo da página.</li>
                      <li>
                        Preencha o formulário com as informações (Razão Social,
                        CNPJ, Tipo, Categoria, etc.).
                      </li>
                      <li>Clique em <strong>"Salvar"</strong> para concluir o cadastro.</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Como Editar ou Excluir um Parceiro:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                       <li>Na lista de parceiros, localize o que deseja modificar.</li>
                       <li>Clique no ícone de três pontos (...) na coluna "Ações".</li>
                       <li>
                         Selecione <strong>"Ver Detalhes"</strong> para ir à página do parceiro. Lá você encontrará os botões para <strong>"Editar"</strong> ou <strong>"Excluir"</strong>.
                       </li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Gerenciando Profissionais</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>
                    A seção <strong>Profissionais</strong> é onde você gerencia os perfis de
                    todos os profissionais da rede.
                  </p>
                   <div>
                    <h4 className="font-semibold mb-2">Como Cadastrar um Novo Profissional:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>
                        Acesse a página{' '}
                        <a href="/profissionais" className="text-primary hover:underline">
                          Profissionais
                        </a>.
                      </li>
                      <li>Clique em <strong>"Novo Profissional"</strong>.</li>
                      <li>Preencha os dados como nome, registro e especialidade.</li>
                      <li>Clique em <strong>"Salvar"</strong>.</li>
                    </ol>
                  </div>
                   <div>
                    <h4 className="font-semibold mb-2">Como Editar ou Excluir um Profissional:</h4>
                     <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                       <li>Na lista, encontre o profissional desejado.</li>
                       <li>Use o menu de três pontos (...) para escolher entre <strong>"Editar"</strong> ou <strong>"Excluir"</strong>.</li>
                    </ol>
                  </div>
                   <div>
                    <h4 className="font-semibold mb-2">Como Vincular um Profissional a um Parceiro:</h4>
                     <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Navegue até a página de <a href="/parceiros" className="text-primary hover:underline">Parceiros</a> e clique em "Ver Detalhes" no parceiro desejado.</li>
                        <li>Na página de detalhes do parceiro, localize o card "Profissionais Vinculados".</li>
                        <li>Clique no botão <strong>"Adicionar"</strong>.</li>
                        <li>Uma janela se abrirá com a lista de todos os profissionais disponíveis (com busca). Clique em "Adicionar" ao lado do profissional que deseja vincular.</li>
                        <li>Para remover um vínculo, utilize o menu de ações na linha do profissional e selecione "Remover Vínculo". Você também pode ativar ou inativar o vínculo por ali.</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Gerenciando Nichos</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>
                   A seção <strong>Nichos</strong> serve para organizar as áreas de atuação e
                   serviços oferecidos. A página é organizada por categorias (Saúde, Estética, etc.).
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Como Adicionar uma Categoria de Nicho:</h4>
                     <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>
                        Vá para a página de{' '}
                        <a href="/nichos" className="text-primary hover:underline">
                          Nichos
                        </a>.
                      </li>
                      <li>Clique em <strong>"Adicionar Categoria"</strong>.</li>
                      <li>Dê um nome para a nova categoria (Ex: Odontologia) e salve.</li>
                    </ol>
                  </div>
                   <div>
                    <h4 className="font-semibold mb-2">Como Gerenciar Subcategorias:</h4>
                     <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                       <li>Expanda uma categoria de nicho para ver suas subcategorias (serviços).</li>
                       <li>
                         Use os ícones de <strong>lápis</strong> (Editar) e <strong>lixeira</strong> (Excluir) para
                         gerenciar cada subcategoria individualmente.
                       </li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
                <AccordionItem value="item-4">
                <AccordionTrigger>Gerando Relatórios</AccordionTrigger>
                <AccordionContent className="space-y-4">
                    <p>
                        A funcionalidade de <strong>Relatórios</strong> permite extrair dados
                        consolidados da plataforma com base em filtros específicos.
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>
                            Acesse a página{' '}
                            <a href="/relatorios" className="text-primary hover:underline">
                                Relatórios
                            </a>.
                        </li>
                        <li>
                            Utilize os filtros à esquerda para refinar sua busca (ex: por cidade, categoria, nicho).
                        </li>
                        <li>
                            Clique em <strong>"Gerar Relatório"</strong>. Os resultados serão exibidos na área de visualização.
                        </li>
                         <li>
                            Para imprimir, clique no ícone de <strong>impressora</strong>. Para baixar como CSV, clique no ícone de <strong>download</strong>.
                         </li>
                    </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guia para Visualizadores</CardTitle>
            <CardDescription>
              Aprenda a navegar e consultar informações na plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Como visualizador, seu acesso é focado na consulta de informações. Você pode usar o menu lateral para navegar entre as diferentes seções:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Painel:</strong> Tenha uma visão geral com os principais indicadores da rede.</li>
                <li><strong>Parceiros:</strong> Consulte a lista de todos os parceiros ativos, seus contatos e localizações.</li>
                <li><strong>Profissionais:</strong> Veja os profissionais cadastrados e suas especialidades.</li>
                <li><strong>Nichos:</strong> Explore as categorias e subcategorias de serviços oferecidos.</li>
            </ul>
             <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertTitle>Pesquisa e Relatórios</AlertTitle>
              <AlertDescription>
                Embora não possa editar, você pode usar a página de <strong>Relatórios</strong> para filtrar e visualizar dados de parceiros ativos. Use os filtros para encontrar as informações que precisa.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
