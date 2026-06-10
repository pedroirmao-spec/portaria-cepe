# Guia de Instalação no Servidor Windows — Portaria CEPE

Este guia mostra como hospedar o sistema **Portaria CEPE** em um servidor Windows
da empresa. Pode ser entregue à equipe de TI.

O app é **estático** (HTML/CSS/JavaScript) — não precisa de PHP nem banco de dados.

---

## PASSO 0 — Copiar os arquivos para o servidor

Copie a pasta **`Portaria-CEPE`** inteira para o servidor (via rede, pendrive ou
área de trabalho remota). Sugestão de local:

```
C:\PortariaCEPE\
```

A pasta deve conter: `index.html`, `logo-cepe.png`, `server.js`, `LEIA-ME.md`.

---

## CAMINHO A — IIS (recomendado para Windows Server)

O IIS já vem no Windows Server, serve arquivos estáticos nativamente e **inicia
sozinho** com o servidor. **Não precisa instalar o Node.**

### A.1 — Ativar o IIS (se ainda não estiver ativo)
1. Abra o **Gerenciador do Servidor** → **Adicionar Funções e Recursos**
2. Avance até **Funções do Servidor** → marque **Servidor Web (IIS)**
3. Conclua a instalação

> Em um Windows comum (não Server): Painel de Controle → Programas → **Ativar ou
> desativar recursos do Windows** → marque **Serviços de Informações da Internet**.

### A.2 — Publicar o site
1. Copie o conteúdo da pasta para: `C:\inetpub\wwwroot\portaria\`
2. Abra o **Gerenciador do IIS** (digite `inetmgr` no Iniciar)
3. O site já estará acessível em: `http://localhost/portaria/`
   (o IIS abre o `index.html` automaticamente)

### A.3 — HTTPS (necessário para a WEBCAM funcionar na rede) 🔒
A câmera só funciona em `localhost` ou em **HTTPS**. Para a portaria usar a webcam
acessando pela rede, ative HTTPS:
1. No IIS, selecione o servidor → **Certificados de Servidor** → **Criar
   Certificado Autoassinado** → dê um nome (ex.: `portaria`)
2. Selecione o site → **Associações (Bindings)** → **Adicionar** → tipo **https**,
   porta **443**, escolha o certificado criado
3. Acesse por `https://IP-DO-SERVIDOR/portaria/`
   (na primeira vez o navegador avisa que o certificado não é confiável — clique
   em **Avançado → Prosseguir**. Para sumir o aviso de vez, a TI pode instalar o
   certificado como confiável no PC da portaria.)

---

## CAMINHO B — Node.js (alternativa, sem IIS)

Use se preferir não mexer no IIS. Requer o **Node.js** instalado no servidor
(https://nodejs.org — versão LTS).

### B.1 — Testar
1. Abra o **Prompt de Comando** na pasta (ex.: `cd C:\PortariaCEPE`)
2. Rode: `node server.js`
3. Acesse `http://localhost:8080`

### B.2 — Iniciar automaticamente quando o servidor ligar
Para não precisar abrir na mão toda vez, crie uma tarefa agendada:
1. Abra o **Agendador de Tarefas** → **Criar Tarefa**
2. **Geral:** marque "Executar estando o usuário conectado ou não" e "Executar
   com privilégios mais altos"
3. **Disparadores:** novo → "Ao iniciar o computador"
4. **Ações:** novo → Programa: `node` → Argumentos: `server.js` → Iniciar em:
   `C:\PortariaCEPE`
5. Salve. Pronto — o servidor sobe sozinho a cada reinício.

> Webcam pela rede: o Node deste guia serve em **HTTP**. Para a câmera funcionar
> na rede, use a solução de webcam abaixo (HTTPS ou ajuste no navegador).

---

## LIBERAR O ACESSO NA REDE (Firewall)

Para outros computadores acessarem, libere a porta no firewall do servidor.
No **PowerShell como Administrador**:

```powershell
# Para o Caminho A (IIS / HTTPS):
New-NetFirewallRule -DisplayName "Portaria CEPE HTTP"  -Direction Inbound -Protocol TCP -LocalPort 80  -Action Allow
New-NetFirewallRule -DisplayName "Portaria CEPE HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow

# Para o Caminho B (Node na porta 8080):
New-NetFirewallRule -DisplayName "Portaria CEPE 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

---

## SOLUÇÃO PARA A WEBCAM (resumo)

A câmera precisa de **contexto seguro**. Escolha UMA opção:

- **Opção 1 (recomendada): HTTPS** — veja o passo A.3 (IIS). É o jeito "certo".
- **Opção 2 (rápida): ajuste no navegador da portaria** — no Chrome do PC da
  portaria, acesse `chrome://flags/#unsafely-treat-insecure-origin-as-secure`,
  cole o endereço do servidor (ex.: `http://192.168.100.50:8080`), selecione
  **Enabled** e reinicie o navegador. A câmera passa a funcionar nesse PC.

---

## COMO A PORTARIA VAI ACESSAR

Depois de instalado, no computador da portaria, abra o navegador e acesse:

- IIS com HTTPS:  `https://IP-DO-SERVIDOR/portaria/`
- IIS sem HTTPS:  `http://IP-DO-SERVIDOR/portaria/`
- Node:           `http://IP-DO-SERVIDOR:8080`

(Troque `IP-DO-SERVIDOR` pelo IP real do servidor, ex.: `192.168.100.50`.)

**Login de teste:** `admin@cepe.com` / senha `123456`

---

## LEMBRETE SOBRE OS DADOS

Os registros ficam salvos **no navegador do computador da portaria** (não no
servidor). Funciona bem para 1 computador. Se no futuro precisarem que vários
PCs vejam os mesmos dados, será necessário adicionar um banco de dados central —
isso pode ser feito quando quiserem.
