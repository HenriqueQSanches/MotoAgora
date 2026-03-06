# Moto Agora - Sistema de Rastreamento e Gestao de Motos

Projeto fullstack para gestao operacional de motos, manutencao por quilometragem, cobrancas e alertas automatizados via WhatsApp, com backend em Python (FastAPI) e frontend em React + TypeScript.

## Objetivo

Entregar uma plataforma com foco em:
- cadastro de clientes e motos;
- controle de odometro e pernoite;
- manutencao preventiva por KM;
- cobranca e acompanhamento financeiro;
- dashboard operacional com indicadores-chave.

## Stack definida

- **Frontend:** React, TypeScript, Vite, Axios, React Query
- **Backend:** Python, FastAPI, SQLAlchemy, Alembic, Pydantic
- **Infra:** PostgreSQL, Redis, Docker
- **Integracoes:** API WhatsApp e SGLock (financeiro)

## Onde gerar cada parte (sem comandos)

- Gere o **frontend** dentro de `frontend/`.
- Gere o **backend** dentro de `backend/`.
- Mantenha configuracoes de ambiente/containers em `docker/`.
- Mantenha documentos comerciais e tecnicos em `docs/`.

> Padrao recomendado: manter tudo em monorepo para facilitar deploy, versionamento e manutencao.

## Estrutura base do projeto

```txt
projeto_motos/
  backend/
    app/
      main.py
      core/
        config.py
        security.py
        database.py
        redis_client.py
      models/
        cliente_model.py
        moto_model.py
        manutencao_model.py
        cobranca_model.py
      schemas/
        cliente_schema.py
        moto_schema.py
        manutencao_schema.py
        cobranca_schema.py
      repositories/
        cliente_repository.py
        moto_repository.py
        manutencao_repository.py
        cobranca_repository.py
      services/
        whatsapp_service.py
        manutencao_service.py
        rastreamento_service.py
        cobranca_service.py
      routes/
        cliente_routes.py
        moto_routes.py
        manutencao_routes.py
        cobranca_routes.py
        dashboard_routes.py
      jobs/
        verificar_troca_oleo.py
        verificar_cobrancas.py
    tests/
    requirements.txt
    alembic.ini
  frontend/
    src/
      assets/
      components/
        layout/
          Header/
            index.tsx
            style.css
          Sidebar/
            index.tsx
            style.css
        ui/
          Card/
            index.tsx
            style.css
          Button/
            index.tsx
            style.css
      pages/
        dashboard/
          index.tsx
          style.css
        motos/
          index.tsx
          style.css
        manutencao/
          index.tsx
          style.css
        financeiro/
          index.tsx
          style.css
        about/
          index.tsx
          style.css
      services/
        api.ts
        motos_service.ts
        manutencao_service.ts
        cobranca_service.ts
      hooks/
      types/
      utils/
      router/
        index.tsx
      App.tsx
      main.tsx
  docker/
    docker-compose.yml
  docs/
  README.md
```

## Sobre o padrao `pages/about/index.tsx + style.css`

Esse padrao funciona muito bem para este projeto e e simples de manter.

### Vantagens
- organizacao por pagina/modulo;
- facil de localizar arquivos rapidamente;
- ideal para times pequenos (ou dev unico).

### Convencao recomendada
- cada pagina e componente com sua propria pasta;
- `index.tsx` para logica/markup;
- `style.css` local da pagina/componente;
- nomes de pasta em minusculo para manter consistencia.

Se depois o projeto crescer muito, pode migrar gradualmente para `style.module.css` sem quebrar a arquitetura.

## Modulos funcionais (MVP)

1. **Clientes**
   - cadastro, listagem, edicao.
2. **Motos**
   - cadastro, placa, modelo, odometro, KM troca de oleo, pernoite.
3. **Manutencao**
   - registros, custos, historico, alerta automatico por KM.
4. **Financeiro**
   - cobrancas, vencimento, status (PENDENTE/PAGO/ATRASADO), lembretes.
5. **Dashboard**
   - total de motos, manutencoes pendentes, cobrancas atrasadas, pernoite.

## Regras tecnicas importantes

- incluir `empresa_id` nas tabelas principais desde o inicio;
- usar migrations com Alembic desde a primeira versao;
- separar regra de negocio em `services/` (evitar regra em rota);
- usar Redis para fila/cache/jobs e nao apenas como opcional;
- manter padrao de resposta da API com validacoes claras.

## Resultado esperado

Um sistema com visual profissional (alinhado a identidade Moto Agora), arquitetura escalavel e base pronta para evolucao futura para modelo SaaS.

---

Todos os direitos são reservados para Henrique Sanches, Mariana Pivoto e Pedro Dantas.
