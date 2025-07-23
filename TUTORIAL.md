# Tutorial: Exportando o Projeto para o GitHub e Rodando Localmente

Este guia irá orientá-lo passo a passo para baixar o código-fonte da sua aplicação do Firebase Studio, colocá-lo em seu próprio repositório no GitHub e executá-lo em sua máquina local.

## Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em seu computador:

1.  **Node.js**: Essencial para rodar a aplicação e instalar suas dependências. [Baixe aqui](https://nodejs.org/).
2.  **Git**: O sistema de controle de versão que usaremos para gerenciar o código e conectá-lo ao GitHub. [Baixe aqui](https://git-scm.com/).
3.  **Conta no GitHub**: Você precisará de uma conta para criar seu repositório. [Crie uma aqui](https://github.com/join).

---

## Passo 1: Baixar o Código do Projeto

O ponto de partida é baixar o código-fonte completo diretamente do navegador, no ambiente do Firebase Studio.

1.  No Firebase Studio, procure pela opção de **Download** ou **Exportar como .zip**.
2.  Clique nela para baixar um arquivo `.zip` contendo todos os arquivos da sua aplicação.
3.  Após o download, descompacte o arquivo `.zip` em uma pasta de sua preferência no seu computador.

---

## Passo 2: Criar um Novo Repositório no GitHub

Agora, vamos preparar o "lar" do seu projeto no GitHub.

1.  Acesse o site do [GitHub](https://github.com/) e faça login.
2.  Clique no ícone de `+` no canto superior direito e selecione **"New repository"**.
3.  Dê um nome ao seu repositório (ex: `redepro-app`).
4.  Você pode adicionar uma descrição (opcional).
5.  Mantenha o repositório como **Público** ou **Privado**, conforme sua preferência.
6.  **Importante**: NÃO marque as opções "Add a README file", "Add .gitignore" ou "Choose a license", pois nosso projeto já possui esses arquivos.
7.  Clique em **"Create repository"**.

Na próxima página, o GitHub exibirá a URL do seu novo repositório. Mantenha essa página aberta, pois você precisará da URL em breve. Ela será algo como: `https://github.com/seu-usuario/seu-repositorio.git`.

---

## Passo 3: Conectar seu Projeto Local ao Repositório GitHub

Nesta etapa, usaremos o terminal (ou prompt de comando) para enviar o código que você baixou para o repositório que acabou de criar.

1.  **Abra o terminal**.
2.  **Navegue até a pasta** onde você descompactou o projeto.
    ```bash
    cd caminho/para/a/pasta/do/projeto
    ```

3.  **Inicialize o Git** na pasta do seu projeto. Isso o transforma em um repositório Git local.
    ```bash
    git init
    ```

4.  **Adicione todos os arquivos** do projeto para serem monitorados pelo Git.
    ```bash
    git add .
    ```

5.  **Faça o primeiro "commit"**. Um commit é como um "ponto de salvamento" na história do seu projeto.
    ```bash
    git commit -m "Commit inicial do projeto RedePro"
    ```

6.  **Renomeie a branch principal para `main`**, que é o padrão atual.
    ```bash
    git branch -M main
    ```

7.  **Adicione o repositório remoto**. É aqui que você diz ao seu Git local para onde ele deve enviar os arquivos. Copie a URL do repositório que você criou no Passo 2.
    ```bash
    git remote add origin https://github.com/seu-usuario/seu-repositorio.git
    ```
    *(Lembre-se de substituir pela sua URL real!)*

8.  **Envie (push) seu código** para o GitHub.
    ```bash
    git push -u origin main
    ```
    O Git pode pedir suas credenciais do GitHub para autorizar o envio.

Pronto! Se você atualizar a página do seu repositório no GitHub, verá todos os arquivos do projeto lá.

---

## Passo 4: Rodar o Projeto Localmente

Para garantir que tudo está funcionando corretamente, vamos rodar a aplicação na sua máquina.

1.  No mesmo terminal, na pasta do projeto, **instale todas as dependências** (os pacotes que a aplicação precisa para funcionar).
    ```bash
    npm install
    ```
    *Este processo pode levar alguns minutos.*

2.  Após a instalação, **inicie o servidor de desenvolvimento**.
    ```bash
    npm run dev
    ```

3.  O terminal mostrará uma mensagem indicando que o servidor está rodando, geralmente em `http://localhost:3000`.
4.  **Abra seu navegador** e acesse [http://localhost:3000](http://localhost:3000).

Você deverá ver sua aplicação funcionando exatamente como no ambiente do Firebase Studio. Agora você tem controle total sobre o código, pode fazer alterações localmente, enviá-las para seu GitHub e fazer o deploy para onde quiser!
