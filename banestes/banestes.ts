const BASE_URL =
  "https://olinda.bcb.gov.br/olinda/servico/Informes_Agencias/versao/v1/odata";

interface Agencia {
  codigo: string | null;
  nome: string;
  bairro: string;
  municipio: string;
  uf: string;
  endereco: string;
  numero: string;
  complemento: string;
  cep: string;
  ddd: string;
  telefone: string;
  dataInicio: string;
  segmento: string;
}

interface BacenAgencia {
  CodigoCompe: string;
  NomeAgencia: string;
  Bairro: string;
  Municipio: string;
  UF: string;
  Endereco: string;
  Numero: string;
  Complemento: string;
  Cep: string;
  DDD: string;
  Telefone: string;
  DataInicio: string;
  Segmento: string;
}

interface BacenResponse {
  value: BacenAgencia[];
}

function buildUrl(filters: string[], top = 200, skip = 0): string {
  const params = new URLSearchParams({
    $filter: filters.join(" and "),
    $format: "json",
    $top: String(top),
    $skip: String(skip),
    $orderby: "CodigoCompe asc",
  });
  return `${BASE_URL}/Agencias?${params}`;
}

function mapAgencia(raw: BacenAgencia): Agencia {
  return {
    codigo: raw.CodigoCompe || null,
    nome: raw.NomeAgencia,
    bairro: raw.Bairro,
    municipio: raw.Municipio,
    uf: raw.UF,
    endereco: raw.Endereco,
    numero: raw.Numero,
    complemento: raw.Complemento,
    cep: raw.Cep,
    ddd: raw.DDD,
    telefone: raw.Telefone,
    dataInicio: raw.DataInicio,
    segmento: raw.Segmento,
  };
}

async function fetchAgencias(extraFilters: string[] = []): Promise<Agencia[]> {
  const filters = ["contains(NomeIf,'BANESTES')", ...extraFilters];
  const url = buildUrl(filters);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`BACEN API error: ${res.status}`);
  const data: BacenResponse = await res.json();
  return data.value.map(mapAgencia);
}

async function buscarPorCodigo(codigo: string): Promise<Agencia | null> {
  const padded = codigo.padStart(5, "0");
  const agencias = await fetchAgencias([`CodigoCompe eq '${padded}'`]);
  return agencias[0] ?? null;
}

async function buscarPorMunicipio(municipio: string): Promise<Agencia[]> {
  return fetchAgencias([`Municipio eq '${municipio.toUpperCase()}'`]);
}

async function listarTodas(): Promise<Agencia[]> {
  return fetchAgencias();
}

async function main() {
  console.log("=== Todas as agências Banestes ===\n");
  const todas = await listarTodas();
  console.log(`Total: ${todas.length} agências\n`);
  todas.forEach((a) =>
    console.log(`[${a.codigo ?? "N/A"}] ${a.nome} — ${a.municipio}/${a.uf}`)
  );

  console.log("\n=== Busca por código 00044 ===\n");
  const ag = await buscarPorCodigo("00044");
  console.log(ag ? JSON.stringify(ag, null, 2) : "Não encontrada");

  console.log("\n=== Agências em Vitória ===\n");
  const vitoria = await buscarPorMunicipio("VITORIA");
  vitoria.forEach((a) => console.log(`[${a.codigo}] ${a.nome} — ${a.bairro}`));
}

main().catch(console.error);
