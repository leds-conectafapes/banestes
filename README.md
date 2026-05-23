# banestes — Clients TypeScript BACEN + IBGE

Consultas a APIs públicas brasileiras: agências Banestes (BACEN) e localidades (IBGE).

## Estrutura

```
banestes/
  ├── banestes.ts              # Client TypeScript — API BACEN
  └── agencias_banestes.json   # Snapshot 86 agências (21/05/2026)
ibge/
  ├── naturalidade.ts          # Client TypeScript — API IBGE Localidades
  ├── gerar-localidades.ts     # Script gerador do JSON completo
  ├── localidades-brasil.json  # 27 estados + 5.571 municípios
  ├── estados-brasil.json      # 27 estados
  └── naturalidade.example.json
```

---

# banestes/ — API BACEN

**Base URL:** `https://olinda.bcb.gov.br/olinda/servico/Informes_Agencias/versao/v1/odata`

## Endpoints

| Operação | Endpoint |
|---|---|
| Todas as agências Banestes | `GET /Agencias?$filter=contains(NomeIf,'BANESTES')&$format=json&$top=200` |
| Por código COMPE | `GET /Agencias?$filter=contains(NomeIf,'BANESTES') and CodigoCompe eq '00044'&$format=json` |
| Por município | `GET /Agencias?$filter=contains(NomeIf,'BANESTES') and Municipio eq 'VITORIA'&$format=json` |
| Schema | `GET /$metadata` |

## Campos retornados

| Campo | Descrição |
|---|---|
| `CodigoCompe` | Código COMPE do banco (ex: `021` = Banestes) |
| `NomeAgencia` | Nome da agência |
| `NomeIf` | Nome da instituição financeira |
| `Endereco` | Logradouro |
| `Numero` | Número |
| `Bairro` | Bairro |
| `Municipio` | Município |
| `UF` | Estado |
| `Cep` | CEP |
| `DDD` | DDD |
| `Telefone` | Telefone |
| `DataInicio` | Data de abertura |
| `Segmento` | Segmento da instituição |
| `Posicao` | Data de referência dos dados |

## Parâmetros OData

| Parâmetro | Descrição | Exemplo |
|---|---|---|
| `$filter` | Filtro | `CodigoCompe eq '00044'` |
| `$top` | Limite de registros | `$top=100` |
| `$skip` | Paginação (offset) | `$skip=50` |
| `$orderby` | Ordenação | `$orderby=NomeAgencia asc` |
| `$format` | Formato | `json` ou `xml` |
| `$select` | Campos específicos | `$select=CodigoCompe,NomeAgencia` |

## Execução

```bash
npx ts-node banestes/banestes.ts
```

---

# ibge/ — API IBGE Localidades

**Base URL:** `https://servicodados.ibge.gov.br/api/v1/localidades`

## Endpoints

| Operação | Endpoint |
|---|---|
| Todos os estados | `GET /estados?orderBy=nome` |
| Municípios por UF | `GET /estados/{UF}/municipios?orderBy=nome` |
| Município por ID | `GET /municipios/{id}` |

## Campos — Estado

| Campo | Descrição |
|---|---|
| `id` | Código numérico IBGE |
| `sigla` | Sigla (ex: `ES`, `SP`) |
| `nome` | Nome completo |
| `regiao` | Nome da região (Norte, Nordeste, etc.) |

## Campos — Município

| Campo | Descrição |
|---|---|
| `id` | Código IBGE (7 dígitos) |
| `nome` | Nome do município |
| `uf` | Sigla do estado |

## Funções exportadas (`naturalidade.ts`)

| Função | Retorno |
|---|---|
| `listarEstados()` | 27 estados ordenados por nome |
| `listarMunicipiosPorUF(uf)` | Municípios de uma UF (ex: `"ES"`) |
| `buscarNaturalidade(municipio, uf)` | `{ municipio, uf, codigoIBGE }` ou `null` |

## Exemplo de uso

```typescript
import { buscarNaturalidade } from "./ibge/naturalidade";

const nat = await buscarNaturalidade("Vitória", "ES");
// { municipio: "Vitória", uf: "ES", codigoIBGE: 3205309 }
```

## Gerar JSON de localidades

```bash
npx ts-node ibge/gerar-localidades.ts
# gera localidades-brasil.json com 5.571 municípios
```
