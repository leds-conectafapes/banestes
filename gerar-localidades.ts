import { writeFileSync } from "fs";

const IBGE_BASE_URL = "https://servicodados.ibge.gov.br/api/v1/localidades";

interface IBGEEstado {
  id: number;
  sigla: string;
  nome: string;
  regiao: { id: number; sigla: string; nome: string };
}

interface IBGEMunicipio {
  id: number;
  nome: string;
}

interface MunicipioOutput {
  id: number;
  nome: string;
}

interface EstadoOutput {
  id: number;
  sigla: string;
  nome: string;
  regiao: string;
  municipios: MunicipioOutput[];
}

async function fetchEstados(): Promise<IBGEEstado[]> {
  const res = await fetch(`${IBGE_BASE_URL}/estados?orderBy=nome`);
  if (!res.ok) throw new Error(`IBGE error: ${res.status}`);
  return res.json() as Promise<IBGEEstado[]>;
}

async function fetchMunicipios(uf: string): Promise<IBGEMunicipio[]> {
  const res = await fetch(
    `${IBGE_BASE_URL}/estados/${uf}/municipios?orderBy=nome`
  );
  if (!res.ok) throw new Error(`IBGE error: ${res.status} — UF: ${uf}`);
  return res.json() as Promise<IBGEMunicipio[]>;
}

async function main() {
  console.log("Buscando estados...");
  const estados = await fetchEstados();
  console.log(`${estados.length} estados encontrados.\n`);

  const resultado: EstadoOutput[] = [];

  for (const estado of estados) {
    process.stdout.write(`[${estado.sigla}] ${estado.nome}... `);
    const municipios = await fetchMunicipios(estado.sigla);
    resultado.push({
      id: estado.id,
      sigla: estado.sigla,
      nome: estado.nome,
      regiao: estado.regiao.nome,
      municipios: municipios.map((m) => ({ id: m.id, nome: m.nome })),
    });
    console.log(`${municipios.length} municípios`);
  }

  const totalMunicipios = resultado.reduce(
    (acc, e) => acc + e.municipios.length,
    0
  );

  writeFileSync(
    "localidades-brasil.json",
    JSON.stringify(resultado, null, 2),
    "utf-8"
  );

  console.log(`\nConcluído.`);
  console.log(`Estados: ${resultado.length}`);
  console.log(`Municípios: ${totalMunicipios}`);
  console.log(`Arquivo: localidades-brasil.json`);
}

main().catch(console.error);
