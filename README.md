#PROJETO RedePro - Sistema de Gerenciamento de Rede de Credenciados

> Plataforma moderna e white-label para administrar redes de clínicas, hospitais, laboratórios, academias e profissionais associados.

![Badge](https://img.shields.io/badge/feito%20com-Next.js%20%7C%20TypeScript-blue)  
![Badge](https://img.shields.io/badge/licença-MIT-green)

---

## ✨ Visão Geral

O **RedePro** é uma plataforma web projetada para escalar a gestão de redes credenciadas. Ele oferece:

- Um **painel visual** com KPIs, rankings e histórico;
- Cadastro e gerenciamento completo de **parceiros** e **profissionais**;
- **Relatórios inteligentes** com múltiplos filtros;
- **Customização completa** com logo, cor e identidade visual (white-label);
- Tudo com **tecnologia moderna** (Next.js + Firebase + Tailwind CSS).

---

## ⚙️ Funcionalidades em Destaque

### 🧭 Dashboard Inteligente
- KPIs ao vivo (profissionais, vínculos, clínicas, cidades).
- Histórico de atividade da rede.

### 👥 Parceiros e Profissionais
- Cadastro completo, busca e filtros.
- Vínculo entre locais e serviços.
- Página 360º de cada profissional/parceiro.

### 🧱 Nichos e Serviços
- Organização hierárquica de serviços por categorias/subcategorias.
- Edição e controle via UI amigável.

### 📑 Relatórios Dinâmicos
- Busca multifiltros:
  - Por parceiro, profissional, localização, serviço, status...
- Resultado pronto para **exportação PDF**.

### 🎨 Personalização White-label
- Upload de logo;
- Escolha de cor primária;
- Rodapé personalizado nos relatórios.

---

## 🧠 Exemplo de Código (TypeScript + React)

tsx
// Exemplo: agrupando profissionais por especialidade no painel
import { Profissional } from "@/types";

function agruparPorEspecialidade(profissionais: Profissional[]) {
  return profissionais.reduce((acc, prof) => {
    const key = prof.especialidade || "Não informada";
    acc[key] = acc[key] || [];
    acc[key].push(prof);
    return acc;
  }, {} as Record<string, Profissional[]>);
}
