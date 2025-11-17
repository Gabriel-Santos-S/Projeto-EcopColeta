import type { TipoResiduo } from "@/types";

export const getTiposResiduos = async (): Promise<TipoResiduo[]> => {
  
  const res = await fetch(`http://localhost:3000/api/tipos-residuos`);
  if (!res.ok) throw new Error("Erro ao buscar tipos de residuos");
  const data = await res.json();
  return data.data as TipoResiduo[];
}; 