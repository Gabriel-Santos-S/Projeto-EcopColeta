import type { ApiResponse, Cooperativa } from "@/types";

export const creatCooperativa = async (cooperativa: Cooperativa): Promise<ApiResponse> => {
  const response = await fetch(`http://localhost:3000/api/cooperativas/cadastra`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cooperativa)
  });
  if (!response.ok) throw new Error("Erro ao criar cooperativa");

  return await response.json();
};

export const getAllCooperativas = async (): Promise<Cooperativa[]> => {
  const res = await fetch(`http://localhost:3000/api/cooperativas`);
  if (!res.ok) throw new Error("Erro ao buscar cooperativas");
  const data = await res.json();
  return data.data as Cooperativa[];
}; 