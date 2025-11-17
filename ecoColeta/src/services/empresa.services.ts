import type { ApiResponse, Empresa } from "@/types";

export const creatEmpresa = async (empresa: Empresa): Promise<ApiResponse> => {
  const response = await fetch(`http://localhost:3000/api/empresas/cadastra`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresa)
  });
  if (!response.ok) throw new Error("Erro ao criar empresa");

  return await response.json();
};

export const getAllEmpresas = async (): Promise<Empresa[]> => {
  const res = await fetch(`http://localhost:3000/api/empresas`);
  if (!res.ok) throw new Error("Erro ao buscar empresas");
  const data = await res.json();
  return data.data as Empresa[];
}; 