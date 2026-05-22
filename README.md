# Agências Banestes — API BACEN

Dados extraídos da API pública do **Banco Central do Brasil (BACEN)** — serviço `Informes_Agencias`.

## Base URL

```
https://olinda.bcb.gov.br/olinda/servico/Informes_Agencias/versao/v1/odata
```

## Endpoints

### Listar agências por banco (nome)

```
GET /Agencias?$filter=contains(NomeIf,'BANESTES')&$format=json&$top=200
```

### Buscar agência por código COMPE

```
GET /Agencias?$filter=contains(NomeIf,'BANESTES') and CodigoCompe eq '00044'&$format=json
```

### Buscar agências por município

```
GET /Agencias?$filter=contains(NomeIf,'BANESTES') and Municipio eq 'VITORIA'&$format=json
```

### Ver schema (campos disponíveis)

```
GET /$metadata
```

## Campos retornados

| Campo | Descrição |
|---|---|
| `CodigoCompe` | Código da agência (4 dígitos com zero) |
| `NomeAgencia` | Nome da agência |
| `NomeIf` | Nome da instituição financeira |
| `CodigoCompe` | Código COMPE do banco (ex: `021` = Banestes) |
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

## Parâmetros OData suportados

| Parâmetro | Descrição | Exemplo |
|---|---|---|
| `$filter` | Filtro | `CodigoCompe eq '00044'` |
| `$top` | Limite de registros | `$top=100` |
| `$skip` | Paginação (offset) | `$skip=50` |
| `$orderby` | Ordenação | `$orderby=NomeAgencia asc` |
| `$format` | Formato da resposta | `json` ou `xml` |
| `$select` | Campos específicos | `$select=CodigoCompe,NomeAgencia` |

## Arquivos

| Arquivo | Descrição |
|---|---|
| `banestes.ts` | Client TypeScript — consulta agências via API BACEN |
| `agencias_banestes.json` | Snapshot das 86 agências Banestes (posição 21/05/2026) |
| `naturalidade.ts` | Client TypeScript — estados e municípios via API IBGE |
| `naturalidade.example.json` | Exemplo de resposta: estados, municípios, naturalidade |

## Execução do TypeScript

```bash
npx ts-node banestes.ts
npx ts-node naturalidade.ts
```

---

# Naturalidade — API IBGE

Dados extraídos da API pública do **IBGE** — serviço `Localidades`.

## Base URL

```
https://servicodados.ibge.gov.br/api/v1/localidades
```

## Endpoints

### Listar todos os estados

```
GET /estados?orderBy=nome
```

### Listar municípios por UF

```
GET /estados/{UF}/municipios?orderBy=nome
```

### Buscar município por ID

```
GET /municipios/{id}
```

## Campos retornados — Estado

| Campo | Descrição |
|---|---|
| `id` | Código numérico IBGE do estado |
| `sigla` | Sigla (ex: `ES`, `SP`) |
| `nome` | Nome completo do estado |
| `regiao.sigla` | Sigla da região (N, NE, SE, S, CO) |
| `regiao.nome` | Nome da região |

## Campos retornados — Município

| Campo | Descrição |
|---|---|
| `id` | Código IBGE do município (7 dígitos) |
| `nome` | Nome do município |
| `microrregiao.mesorregiao.UF.sigla` | Sigla do estado |

## Funções exportadas (`naturalidade.ts`)

| Função | Descrição |
|---|---|
| `listarEstados()` | Retorna todos os 27 estados ordenados por nome |
| `listarMunicipiosPorUF(uf)` | Retorna municípios de uma UF (ex: `"ES"`) |
| `buscarNaturalidade(municipio, uf)` | Retorna `{ municipio, uf, codigoIBGE }` ou `null` |

## Exemplo de uso

```typescript
import { buscarNaturalidade } from "./naturalidade";

const nat = await buscarNaturalidade("Vitória", "ES");
// { municipio: "Vitória", uf: "ES", codigoIBGE: 3205309 }
```
