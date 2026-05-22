const IBGE_BASE_URL = "https://servicodados.ibge.gov.br/api/v1/localidades";

// --- Interfaces raw (IBGE API) ---

interface IBGEEstado {
  id: number;
  sigla: string;
  nome: string;
  regiao: { id: number; sigla: string; nome: string };
}

interface IBGEMunicipio {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: { id: number; sigla: string; nome: string };
    };
  };
}

// --- Interfaces de domínio ---

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: string;
}

export interface Municipio {
  id: number;
  nome: string;
  uf: string;
}

export interface Naturalidade {
  municipio: string;
  uf: string;
  codigoIBGE: number;
}

// --- Mappers ---

function mapEstado(raw: IBGEEstado): Estado {
  return { id: raw.id, sigla: raw.sigla, nome: raw.nome, regiao: raw.regiao.nome };
}

function mapMunicipio(raw: IBGEMunicipio): Municipio {
  return {
    id: raw.id,
    nome: raw.nome,
    uf: raw.microrregiao.mesorregiao.UF.sigla,
  };
}

// --- Funções públicas ---

export async function listarEstados(): Promise<Estado[]> {
  const res = await fetch(`${IBGE_BASE_URL}/estados?orderBy=nome`);
  if (!res.ok) throw new Error(`IBGE API error: ${res.status}`);
  const data: IBGEEstado[] = await res.json();
  return data.map(mapEstado);
}

export async function listarMunicipiosPorUF(uf: string): Promise<Municipio[]> {
  const res = await fetch(
    `${IBGE_BASE_URL}/estados/${uf.toUpperCase()}/municipios?orderBy=nome`
  );
  if (!res.ok) throw new Error(`IBGE API error: ${res.status}`);
  const data: IBGEMunicipio[] = await res.json();
  return data.map(mapMunicipio);
}

export async function buscarNaturalidade(
  municipio: string,
  uf: string
): Promise<Naturalidade | null> {
  const municipios = await listarMunicipiosPorUF(uf);
  const found = municipios.find(
    (m) => m.nome.toLowerCase() === municipio.toLowerCase()
  );
  if (!found) return null;
  return { municipio: found.nome, uf: found.uf, codigoIBGE: found.id };
}

// --- Exemplo de uso ---

async function main() {
  console.log("=== Estados ===\n");
  const estados = await listarEstados();
  estados.forEach((e) => console.log(`[${e.sigla}] ${e.nome} — ${e.regiao}`));

  console.log("\n=== Municípios do ES ===\n");
  const municipios = await listarMunicipiosPorUF("ES");
  console.log(`Total: ${municipios.length}`);
  municipios.slice(0, 5).forEach((m) => console.log(`[${m.id}] ${m.nome}`));

  console.log("\n=== Busca: Vitória/ES ===\n");
  const nat = await buscarNaturalidade("Vitória", "ES");
  console.log(nat ? JSON.stringify(nat, null, 2) : "Não encontrada");
}

main().catch(console.error);
