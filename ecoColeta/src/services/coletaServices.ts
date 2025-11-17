import type { ApiResponse, Coleta, ColetaResiduoJuntos, PontoColeta } from "@/types";


export const getAllColetas = async (): Promise<Coleta[]> => {
  const res = await fetch(`http://localhost:3000/api/coletas`);
  if (!res.ok) throw new Error("Erro ao buscar empresas");
  const data = await res.json();
  return data.data as Coleta[];
}; 


export const getAllPontoColeta = async (): Promise<PontoColeta[]> => {
  const res = await fetch(`http://localhost:3000/api/pontos-coleta`);
  if (!res.ok) throw new Error("Erro ao buscar  ponto de coletas");
  const data = await res.json();
  return data.data as PontoColeta[];
}; 

export const creatColeta = async (coleta: Coleta): Promise<ApiResponse> => {
  const response = await fetch(`http://localhost:3000/api/coletas/coleta-cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coleta)
  });
  if (!response.ok) throw new Error("Erro ao criar coleta");

  return await response.json();
};

export const getCpfColetaResiduo = async (cpf: string): Promise<ColetaResiduoJuntos[]> => {
  const res = await fetch(`http://localhost:3000/api/coletas/coletas-residuos/${cpf}`);
  if (!res.ok) throw new Error("Erro ao buscar pontos coletas + residuos");
  const data = await res.json();
  return data.data as ColetaResiduoJuntos[];
}; 
