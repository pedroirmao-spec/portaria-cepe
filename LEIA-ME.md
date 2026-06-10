# Portaria CEPE — Sistema de Controle de Visitantes

Aplicativo web para portaria: cadastro de visitantes com foto, validação de CPF,
registro de veículo, controle de entrada/saída ("quem está no local agora") e
**dashboard com gráficos**.

É um site **estático** (um único `index.html`), então roda em qualquer servidor web.

---

## ✅ O que já está pronto

- **Login** (acesso de teste: `admin@cepe.com` / `123456`) + cadastro de usuários
- **Registrar entrada**: Nome, CPF, RG, Telefone, Empresa, Destino, Motivo + **foto** (webcam)
- **Validação de CPF** real (dígitos verificadores) + máscara automática + aviso de duplicado
- **Registro de veículo**: placa (validada nos formatos `ABC1234` e `ABC1D23`), modelo, cor
- **No local agora**: lista de quem está dentro + botão "Registrar saída"
- **Histórico**: busca por nome/CPF + exportação **CSV**
- **Dashboard** com gráficos:
  - Visitantes por mês (12 meses) e por dia (30 dias)
  - Horários de pico
  - Entrada de carros por mês
  - Top 10 empresas
  - Motivos de visita
  - Cartões de resumo (KPIs)
- Botão **"Gerar dados de exemplo"** (no Dashboard) pra você ver os gráficos preenchidos

---

## ▶️ Como testar no seu PC

**Opção A — rápida:** dê duplo clique em `index.html` (abre no navegador).
> Obs.: nesse modo a *webcam* pode não abrir (o navegador bloqueia câmera em arquivos locais). Use a Opção B abaixo.

**Opção B — com webcam funcionando (recomendada):**
1. Tenha o Node.js instalado
2. Nesta pasta, rode: `node server.js`
3. Abra `http://localhost:8080`

---

## 🌐 Como hospedar NO SERVIDOR DE VOCÊS

O app é só arquivos estáticos. Escolha conforme o servidor:

### IIS (Windows Server)
1. Copie a pasta para `C:\inetpub\wwwroot\portaria\`
2. No IIS, o site já serve `index.html`. Acesse `http://servidor/portaria/`

### Apache
- Copie os arquivos para a pasta pública (ex.: `/var/www/html/portaria/`)
- Acesse `http://servidor/portaria/`

### Nginx
```
location /portaria/ {
    alias /var/www/portaria/;
    index index.html;
}
```

### Node (qualquer SO)
```
node server.js 8080
```
Para deixar rodando sempre, use **PM2**: `pm2 start server.js --name portaria`

> 🔒 **Importante:** para a **webcam** funcionar quando hospedado, o site precisa
> estar em **HTTPS** (ou em `localhost`). Em IIS/Apache/Nginx, basta ativar um
> certificado SSL (ex.: Let's Encrypt).

---

## ⚠️ Importante sobre os DADOS (ler!)

Hoje os dados são salvos **no navegador de cada máquina** (`localStorage`).
Isso significa:
- Funciona 100% offline e sem banco de dados.
- **MAS os dados NÃO são compartilhados** entre computadores/navegadores diferentes.

Se a portaria for usada em **vários computadores** e todos precisarem ver os
**mesmos registros**, o próximo passo é ligar o app a um **banco de dados no
servidor** (ex.: Supabase, ou um banco no servidor de vocês com uma API).
Isso já está previsto e é fácil de evoluir — é só pedir.
