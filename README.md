
# API_Utopia603

API criada com NestJS para normalização e armazenamento de dados de usuários de programa de fidelidade em PostgreSQL.

## Objetivo

- Ler planilhas CSV de clientes de fidelidade.
- Normalizar dados em duas tabelas:
  - **Usuário** (UUID, nome, email, senha nula no início)
  - **Fidelidade** (saldo de pontos, pontos resgatados, última atividade, referência ao usuário)
- Expor API REST para manipulação dos dados.

## Funcionalidades

- CRUD completo de usuários (`/usuarios`)
  - **Criar** usuário (`POST /usuarios`)
  - **Listar** usuários (`GET /usuarios`)
  - **Buscar por ID** (`GET /usuarios/:id`)
  - **Editar** usuário (`PUT /usuarios/:id`)
  - **Excluir** usuário (`DELETE /usuarios/:id`)
- (Em breve) CRUD para fidelidade (`/fidelidades`)
- Leitura e processamento de arquivos CSV para popular o banco.
- Senha do usuário gerada no primeiro login (campo pode ser nulo inicialmente).

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz seguindo o modelo `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=suasenha
DB_DATABASE=api_utopia
```

## Execução

```bash
npm run start:dev
```
Acesse as rotas padrão em `http://localhost:3000`.

## Exemplos de requisição

### Criar usuário

```json
POST /usuarios
{
  "nome": "Nome do usuário",
  "email": "email@exemplo.com"
}
```

### Editar usuário

```json
PUT /usuarios/{id}
{
  "nome": "Novo nome",
  "email": "novoemail@exemplo.com",
  "senha": "novasenhaopcional"
}
```

## Estrutura de banco

- **Usuário**
  - id (UUID, PK)
  - nome (string)
  - email (string, único)
  - senha (string | nulo, gerada no primeiro acesso)
- **Fidelidade** (próxima etapa)
  - id (PK)
  - id_usuario (UUID, FK)
  - saldo_pontos (int)
  - pontos_resgatados (int)
  - ultima_atividade (timestamp)

## Próximos Passos

- CRUD de Fidelidade.
- Importação automatizada de CSV.
- Autenticação JWT.
- Documentação Swagger.
