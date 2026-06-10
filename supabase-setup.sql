-- ============================================================
--  Portaria CEPE — banco de dados compartilhado (Supabase)
--  Cole TODO este conteúdo no Supabase: menu "SQL Editor" -> New query
--  -> cole -> botão "Run". Pronto, a tabela e as permissões são criadas.
-- ============================================================

create table if not exists public.visitantes (
  id       text primary key,
  cpf      text,
  entrada  timestamptz,
  saida    timestamptz,
  data     jsonb not null,           -- registro completo do visitante
  criado_em timestamptz default now()
);

create index if not exists visitantes_entrada_idx on public.visitantes (entrada desc);
create index if not exists visitantes_cpf_idx      on public.visitantes (cpf);

-- Liga a segurança em nível de linha
alter table public.visitantes enable row level security;

-- Política (MVP): permite que o app (chave pública "anon") leia e grave.
-- ATENÇÃO: qualquer pessoa com o link do app pode ler/gravar visitantes.
-- Para apertar depois, troque por Supabase Auth + políticas por usuário.
drop policy if exists "acesso_app_anon" on public.visitantes;
create policy "acesso_app_anon"
  on public.visitantes
  for all
  to anon
  using (true)
  with check (true);
