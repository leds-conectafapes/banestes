import { writeFileSync } from "fs";

const IBGE_PAISES_URL = "https://servicodados.ibge.gov.br/api/v1/paises";

interface IBGEPais {
  id: {
    "M49": number;
    "ISO-3166-1-ALPHA-2": string;
    "ISO-3166-1-ALPHA-3": string;
  };
  nome: {
    abreviado: string;
    "abreviado-EN": string;
    "abreviado-ES": string;
  };
  localizacao: {
    regiao: { id: { M49: number }; nome: string } | null;
    "sub-regiao": { id: { M49: number }; nome: string } | null;
  };
}

export interface Pais {
  iso2: string;
  iso3: string;
  m49: number;
  nome: string;
  nomeEN: string;
  nomeES: string;
  subRegiao: string | null;
  regiao: string | null;
}

function mapPais(raw: IBGEPais): Pais {
  return {
    iso2: raw.id["ISO-3166-1-ALPHA-2"],
    iso3: raw.id["ISO-3166-1-ALPHA-3"],
    m49: raw.id["M49"],
    nome: raw.nome.abreviado,
    nomeEN: raw.nome["abreviado-EN"],
    nomeES: raw.nome["abreviado-ES"],
    subRegiao: raw.localizacao?.["sub-regiao"]?.nome ?? null,
    regiao: raw.localizacao?.regiao?.nome ?? null,
  };
}

export async function listarPaises(): Promise<Pais[]> {
  const res = await fetch(IBGE_PAISES_URL);
  if (!res.ok) throw new Error(`IBGE API error: ${res.status}`);
  const data: IBGEPais[] = await res.json();
  return data.map(mapPais).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

async function main() {
  console.log("Buscando países...");
  const paises = await listarPaises();
  console.log(`${paises.length} países encontrados.\n`);

  writeFileSync("paises.json", JSON.stringify(paises, null, 2), "utf-8");

  console.log("Arquivo: paises.json");
  console.log("\nAmostra (5 primeiros):");
  paises.slice(0, 5).forEach((p) =>
    console.log(`[${p.iso2}/${p.iso3}] ${p.nome} — ${p.regiao ?? "sem região"}`)
  );
}

main().catch(console.error);
