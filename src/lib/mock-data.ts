import { subDays, subMonths } from 'date-fns';

export type Exam = {
  id: string;
  name: string;
  nomenclature: string;
  discount: string;
  observations: string;
  status: 'Ativo' | 'Inativo';
  professionalId?: string;
};

export type ProfessionalLink = {
  id: string;
  professionalId: string;
  price: string;
  discount: string;
  observation: string;
  status: 'Ativo' | 'Inativo';
}

export type Partner = {
  id: string;
  name: string;
  category: 'Saúde' | 'Estética' | 'Lazer' | 'Educação';
  type: 'Clínica' | 'Laboratório' | 'Hospital' | string;
  cnpj: string;
  contact: string;
  city: string;
  address: string;
  status: 'Ativo' | 'Inativo';
  niche: string;
  logoUrl?: string;
  exams?: Exam[];
  affiliatedProfessionals?: ProfessionalLink[];
  registeredAt: string; // ISO 8601 format
};

export type ActivityLogEntry = {
  id: string;
  partnerId?: string;
  professionalId?: string;
  timestamp: string; // ISO 8601 format
  user: string;
  action: string;
  details: string;
};

export type Professional = {
  id: string;
  name: string;
  register: string;
  specialty: string;
  registeredAt: string; // ISO 8601 format
};


export const partners: Partner[] = [
  {
    id: 'est-1',
    name: 'Clínica Sorriso Feliz',
    category: 'Saúde',
    type: 'Clínica',
    cnpj: '12.345.678/0001-99',
    contact: '(11) 98765-4321',
    city: 'São Paulo',
    address: 'Av. Paulista, 1000, Bela Vista, São Paulo - SP',
    status: 'Ativo',
    niche: 'Odontologia',
    logoUrl: 'https://placehold.co/128x128/EBF4FF/76A9EA.png',
    affiliatedProfessionals: [
      { id: 'aff-1', professionalId: 'prof-1', price: 'R$ 200,00', discount: '10% no plano', observation: 'Atende apenas particular.', status: 'Ativo' }
    ],
    exams: [
      { id: 'ex1-1', name: 'Limpeza Dental Completa', nomenclature: 'ODT001', discount: '20%', observations: 'Inclui aplicação de flúor.', status: 'Ativo', professionalId: 'prof-1' },
      { id: 'ex1-2', name: 'Extração de Siso', nomenclature: 'ODT004', discount: '10%', observations: 'Requer avaliação prévia.', status: 'Ativo', professionalId: 'prof-1' },
      { id: 'ex1-3', name: 'Restauração Dentária', nomenclature: 'ODT005', discount: '15%', observations: 'Uso de resina composta.', status: 'Ativo', professionalId: 'prof-1' },
      { id: 'ex1-4', name: 'Clareamento a Laser', nomenclature: 'ODT002', discount: 'R$ 150,00', observations: 'Desconto na primeira sessão.', status: 'Inativo' },
    ],
    registeredAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: 'est-2',
    name: 'Laboratório Vida & Saúde',
    category: 'Saúde',
    type: 'Laboratório',
    cnpj: '98.765.432/0001-11',
    contact: '(21) 91234-5678',
    city: 'Rio de Janeiro',
    address: 'R. da Glória, 123, Glória, Rio de Janeiro - RJ',
    status: 'Inativo',
    niche: 'Análises Clínicas',
    logoUrl: 'https://placehold.co/128x128/FFF4E5/FFA82B.png',
    affiliatedProfessionals: [],
    exams: [
       { id: 'ex2-1', name: 'Hemograma Completo', nomenclature: 'LAB001', discount: '10%', observations: 'Não necessita de jejum.', status: 'Ativo' },
    ],
    registeredAt: subDays(new Date(), 80).toISOString(),
  },
  {
    id: 'est-3',
    name: 'Hospital Central',
    category: 'Saúde',
    type: 'Hospital',
    cnpj: '55.444.333/0001-22',
    contact: '(31) 99999-8888',
    city: 'Belo Horizonte',
    address: 'Av. Afonso Pena, 500, Centro, Belo Horizonte - MG',
    status: 'Ativo',
    niche: 'Dermatologia',
    logoUrl: 'https://placehold.co/128x128/F0F9FF/3B82F6.png',
    affiliatedProfessionals: [
      { id: 'aff-2', professionalId: 'prof-3', price: 'R$ 400,00', discount: 'Convênio X', observation: 'Atendimento com hora marcada.', status: 'Ativo' }
    ],
    exams: [
      { id: 'ex3-1', name: 'Peeling Químico', nomenclature: 'DER001', discount: '10%', observations: 'Consulta de avaliação gratuita.', status: 'Ativo', professionalId: 'prof-3' },
      { id: 'ex3-2', name: 'Aplicação de Toxina Botulínica', nomenclature: 'DER002', discount: 'R$ 200,00', observations: 'Por área aplicada.', status: 'Ativo', professionalId: 'prof-3' },
    ],
    registeredAt: subMonths(new Date(), 5).toISOString(),
  },
  {
    id: 'est-4',
    name: 'Orto Center',
    category: 'Saúde',
    type: 'Clínica',
    cnpj: '11.222.333/0001-44',
    contact: '(51) 98888-7777',
    city: 'Porto Alegre',
    address: 'R. dos Andradas, 700, Centro Histórico, Porto Alegre - RS',
    status: 'Ativo',
    niche: 'Odontologia',
    logoUrl: 'https://placehold.co/128x128/F3E8FF/A855F7.png',
    affiliatedProfessionals: [
      { id: 'aff-3', professionalId: 'prof-1', price: 'R$ 150,00', discount: '', observation: 'Apenas manutenção.', status: 'Ativo' }
    ],
    exams: [
        { id: 'ex4-1', name: 'Manutenção de Aparelho Ortodôntico', nomenclature: 'ODT003', discount: '5%', observations: 'Pagamento em dia.', status: 'Ativo', professionalId: 'prof-1' },
    ],
    registeredAt: subDays(new Date(), 25).toISOString(),
  },
  {
    id: 'est-5',
    name: 'Bella Pele Estética Avançada',
    category: 'Estética',
    type: 'Clínica de Estética',
    cnpj: '22.333.444/0001-55',
    contact: '(11) 91111-2222',
    city: 'São Paulo',
    address: 'R. Oscar Freire, 500, Jardins, São Paulo - SP',
    status: 'Ativo',
    niche: 'Harmonização Facial',
    logoUrl: 'https://placehold.co/128x128/FEF2F2/EF4444.png',
     affiliatedProfessionals: [
      { id: 'aff-4', professionalId: 'prof-5', price: 'R$ 1.200,00', discount: '10%', observation: 'Pacote com 3 sessões.', status: 'Ativo' }
    ],
    exams: [
        { id: 'ex5-1', name: 'Preenchimento Labial', nomenclature: 'EST001', discount: '10%', observations: 'Uso de ácido hialurônico.', status: 'Ativo', professionalId: 'prof-5' },
    ],
    registeredAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: 'est-6',
    name: 'Crescer Cursos',
    category: 'Educação',
    type: 'Escola de Idiomas',
    cnpj: '33.444.555/0001-66',
    contact: '(41) 93333-4444',
    city: 'Curitiba',
    address: 'Av. Batel, 1230, Batel, Curitiba - PR',
    status: 'Ativo',
    niche: 'Cursos de Idiomas',
    logoUrl: 'https://placehold.co/128x128/ECFEFF/0891B2.png',
    affiliatedProfessionals: [],
    exams: [
       { id: 'ex6-1', name: 'Curso de Inglês Intensivo', nomenclature: 'EDU001', discount: '15%', observations: 'Duração de 6 meses.', status: 'Ativo' },
    ],
    registeredAt: subDays(new Date(), 45).toISOString(),
  },
  {
    id: 'est-7',
    name: 'Academia Corpo em Movimento',
    category: 'Lazer',
    type: 'Academia',
    cnpj: '44.555.666/0001-77',
    contact: '(71) 95555-6666',
    city: 'Salvador',
    address: 'Av. Oceânica, 2400, Ondina, Salvador - BA',
    status: 'Inativo',
    niche: 'Fitness',
    logoUrl: 'https://placehold.co/128x128/F7FEE7/65A30D.png',
    affiliatedProfessionals: [],
    exams: [
        { id: 'ex7-1', name: 'Plano Anual Completo', nomenclature: 'LAZ001', discount: 'R$ 50,00 na primeira mensalidade', observations: 'Acesso a todas as aulas.', status: 'Ativo' },
    ],
    registeredAt: subMonths(new Date(), 6).toISOString(),
  },
  {
    id: 'est-8',
    name: 'CardioCor',
    category: 'Saúde',
    type: 'Clínica',
    cnpj: '55.666.777/0001-88',
    contact: '(11) 92222-3333',
    city: 'São Paulo',
    address: 'Av. Dr. Arnaldo, 455, Cerqueira César, São Paulo - SP',
    status: 'Ativo',
    niche: 'Cardiologia',
    logoUrl: 'https://placehold.co/128x128/FFF1F2/E11D48.png',
    affiliatedProfessionals: [
      { id: 'aff-5', professionalId: 'prof-4', price: 'R$ 350,00', discount: '15% para retorno', observation: 'Atende convênios selecionados.', status: 'Ativo' }
    ],
    exams: [
        { id: 'ex8-1', name: 'Eletrocardiograma (ECG)', nomenclature: 'CARD001', discount: '10%', observations: 'Resultado em 30 minutos.', status: 'Ativo', professionalId: 'prof-4' },
        { id: 'ex8-2', name: 'Teste Ergométrico', nomenclature: 'CARD002', discount: '5%', observations: 'Requer agendamento prévio e preparo.', status: 'Ativo', professionalId: 'prof-4' },
    ],
    registeredAt: subDays(new Date(), 12).toISOString(),
  },
  {
    id: 'est-9',
    name: 'Clínica Bem-Estar',
    category: 'Saúde',
    type: 'Clínica',
    cnpj: '66.777.888/0001-99',
    contact: '(21) 94444-5555',
    city: 'Rio de Janeiro',
    address: 'Av. das Américas, 500, Barra da Tijuca, Rio de Janeiro - RJ',
    status: 'Ativo',
    niche: 'Clínica Geral',
    logoUrl: 'https://placehold.co/128x128/F0FDF4/22C55E.png',
    affiliatedProfessionals: [
      { id: 'aff-6', professionalId: 'prof-8', price: 'R$ 180,00', discount: 'Pacote de check-up', observation: 'Atendimento geral e encaminhamentos.', status: 'Ativo' }
    ],
    exams: [
        { id: 'ex9-1', name: 'Consulta de Rotina', nomenclature: 'GER001', discount: '20% para primeira consulta', observations: '', status: 'Ativo', professionalId: 'prof-8' },
    ],
    registeredAt: subDays(new Date(), 32).toISOString(),
  },
  {
    id: 'est-10',
    name: 'Hospital Infantil Pequeno Príncipe',
    category: 'Saúde',
    type: 'Hospital',
    cnpj: '77.888.999/0001-00',
    contact: '(41) 96666-7777',
    city: 'Curitiba',
    address: 'Av. Iguaçu, 1500, Água Verde, Curitiba - PR',
    status: 'Ativo',
    niche: 'Pediatria',
    logoUrl: 'https://placehold.co/128x128/E0F2FE/0EA5E9.png',
    affiliatedProfessionals: [
      { id: 'aff-7', professionalId: 'prof-9', price: 'R$ 250,00', discount: '', observation: 'Atendimento de emergência e consultas.', status: 'Ativo' }
    ],
    exams: [
        { id: 'ex10-1', name: 'Consulta Pediátrica de Rotina', nomenclature: 'PED001', discount: '10% irmãos', observations: 'Foco em acompanhamento do crescimento.', status: 'Ativo', professionalId: 'prof-9' },
        { id: 'ex10-2', name: 'Atendimento de Emergência Pediátrica', nomenclature: 'PED002', discount: '', observations: 'Disponível 24h.', status: 'Ativo', professionalId: 'prof-9' },
    ],
    registeredAt: subDays(new Date(), 15).toISOString(),
  }
];

export const professionals: Professional[] = [
  {
    id: 'prof-1',
    name: 'Dr. João Silva',
    register: 'CRO-SP 12345',
    specialty: 'Odontologia',
    registeredAt: subDays(new Date(), 10).toISOString(),
  },
  {
    id: 'prof-2',
    name: 'Dra. Maria Oliveira',
    register: 'CREFITO 54321',
    specialty: 'Fisioterapia',
    registeredAt: subDays(new Date(), 8).toISOString(),
  },
  {
    id: 'prof-3',
    name: 'Dr. Carlos Pereira',
    register: 'CRM-MG 98765',
    specialty: 'Dermatologia',
    registeredAt: subMonths(new Date(), 4).toISOString(),
  },
  {
    id: 'prof-4',
    name: 'Dra. Ana Costa',
    register: 'CRM-SP 54321',
    specialty: 'Cardiologia',
    registeredAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: 'prof-5',
    name: 'Dra. Isabela Lima',
    register: 'CRF-SP 67890',
    specialty: 'Harmonização Facial',
    registeredAt: subDays(new Date(), 28).toISOString(),
  },
  {
    id: 'prof-6',
    name: 'Prof. Ricardo Mendes',
    register: 'Licenciatura 9876',
    specialty: 'Cursos de Idiomas',
    registeredAt: subMonths(new Date(), 2).toISOString(),
  },
  {
    id: 'prof-7',
    name: 'Lucas Ferreira',
    register: 'CREF 1234-G/BA',
    specialty: 'Fitness',
    registeredAt: subMonths(new Date(), 7).toISOString(),
  },
  {
    id: 'prof-8',
    name: 'Dr. Lucas Martins',
    register: 'CRM-RJ 11223',
    specialty: 'Clínica Geral',
    registeredAt: subDays(new Date(), 40).toISOString(),
  },
  {
    id: 'prof-9',
    name: 'Dra. Beatriz Lima',
    register: 'CRM-PR 44556',
    specialty: 'Pediatria',
    registeredAt: subDays(new Date(), 6).toISOString(),
  },
];

export const nicheTree: Record<string, Record<string, string[]>> = {
  'Saúde': {
    'Odontologia': ['Limpeza Dental Completa', 'Implantes', 'Ortodontia', 'Clareamento a Laser', 'Extração de Siso', 'Restauração Dentária'],
    'Fisioterapia': ['Respiratória', 'Ortopédica', 'Neurológica'],
    'Dermatologia': ['Peeling Químico', 'Aplicação de Toxina Botulínica', 'Cirúrgica'],
    'Análises Clínicas': ['Hemograma Completo', 'Bioquímica', 'Hematologia', 'Microbiologia'],
    'Cardiologia': ['Eletrocardiograma (ECG)', 'Teste Ergométrico', 'Ecocardiograma', 'Holter 24h'],
    'Clínica Geral': ['Consulta de Rotina', 'Check-up', 'Atestado de Saúde Ocupacional'],
    'Pediatria': ['Consulta Pediátrica de Rotina', 'Atendimento de Emergência Pediátrica', 'Vacinação'],
  },
  'Estética': {
    'Harmonização Facial': ['Preenchimento Labial', 'Toxina Botulínica', 'Fios de Sustentação'],
    'Tratamentos Corporais': ['Massagem Modeladora', 'Drenagem Linfática', 'Criolipólise'],
  },
  'Educação': {
    'Cursos de Idiomas': ['Curso de Inglês Intensivo', 'Espanhol', 'Francês', 'Alemão'],
    'Aulas de Reforço': ['Matemática', 'Física', 'Química'],
  },
  'Lazer': {
    'Fitness': ['Plano Anual Completo', 'Musculação', 'Treinamento Funcional', 'Aulas Coletivas'],
    'Clubes e Parques': ['Acesso ao Clube', 'Piscina', 'Quadras Esportivas'],
  }
};

export const activityLog: ActivityLogEntry[] = [
    {
        id: 'log-1',
        partnerId: 'est-1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Criação de Parceiro',
        details: "Parceiro 'Clínica Sorriso Feliz' foi cadastrado no sistema."
    },
    {
        id: 'log-2',
        partnerId: 'est-1',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Criação de Serviço',
        details: "Serviço 'Limpeza Dental Completa' foi adicionado."
    },
    {
        id: 'log-3',
        partnerId: 'est-2',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Inativação de Parceiro',
        details: "O parceiro foi marcado como inativo."
    },
    {
        id: 'log-4',
        partnerId: 'est-5',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Criação de Parceiro',
        details: "Parceiro 'Bella Pele Estética Avançada' foi cadastrado."
    },
    {
        id: 'log-5',
        partnerId: 'est-1',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Edição de Serviço',
        details: "Serviço 'Limpeza Dental Completa' foi atualizado."
    },
    {
        id: 'log-6',
        professionalId: 'prof-2',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Criação de Profissional',
        details: "Profissional 'Dra. Maria Oliveira' foi cadastrado(a)."
    },
     {
        id: 'log-7',
        professionalId: 'prof-2',
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Edição de Profissional',
        details: "A especialidade de 'Dra. Maria Oliveira' foi atualizada."
    },
    {
        id: 'log-8',
        partnerId: 'est-8',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Criação de Parceiro',
        details: "Parceiro 'CardioCor' foi cadastrado no sistema."
    },
    {
        id: 'log-9',
        professionalId: 'prof-9',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Criação de Profissional',
        details: "Profissional 'Dra. Beatriz Lima' foi cadastrado(a)."
    },
     {
        id: 'log-10',
        partnerId: 'est-1',
        professionalId: 'prof-1',
        timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Criação de Vínculo',
        details: "Dr. João Silva vinculado a Clínica Sorriso Feliz"
    },
     {
        id: 'log-11',
        partnerId: 'est-8',
        professionalId: 'prof-4',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Admin',
        action: 'Criação de Vínculo',
        details: "Dra. Ana Costa vinculada a CardioCor"
    }
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
