export interface Pessoa {
  cpf: string;
  nome: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_uf?: string;
  data_nascimento?: string;
  telefone?: string;
  email?: string;
}

export interface Empresa {
  cnpj: string;
  razao_social: string;
  area_atuacao?: string;
}

export interface Cooperativa {
  id_coop?: number;
  nome: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_uf?: string;
  capacidade_processamento?: number;
}

export interface PontoColeta {
  id_ponto?: number;
  localizacao: string;
  capacidade?: number;
  tipos_aceitos?: string;
}

export interface TipoResiduo {
  id_tipo?: number;
  nome: string;
  descricao?: string;
}

export interface Residuo {
  id_residuo?: number;
  id_tipo: number;
  peso: number;
  data_registro?: string;
  id_coop?: number;
  cnpj_empresa?: string;
  tipo_nome?: string;
  tipo_descricao?: string;
}

export interface Coleta {
  id_coleta?: number;
  data: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  cpf: string;
  id_ponto: number;
  pessoa_nome?: string;
  ponto_localizacao?: string;
}

export interface ColetaResiduo {
  id_coleta: number;
  id_residuo: number;
  peso_coletado?: number;
  quantidade?: number;
}

export interface ColetaResiduoJuntos{
  id_coleta: number,
  data: string,
  status: string,
  cpf: string, 
  nome_pessoa: string,
  localizacao: string,
  tipos_residuos: string,
  peso_total: number,
  pontos_coleta: number,
  status_formatado: string,
  data_formatada: string
}



export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}