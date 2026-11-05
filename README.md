# OpenOrg — Arquivo Digital no GitHub Pages

Acervo estilo Archive.org, 100% estático e profissional (visual escuro estilo OpenCode).
**Nada é compilado/baixado no seu computador:** o GitHub Actions valida e publica no GitHub Pages a cada push.

## Estrutura
```
/index.html, /style.css, /app.js   → site (sem build, HTML/CSS/JS puro)
/data/index.json                   → catálogo (título, autor, coleção, tags, tamanho, SHA-256…)
 /files/                           → seus arquivos (vídeo, imagem, áudio, PDF, texto…)
 /.github/workflows/pages.yml      → CI: valida + deploy no Pages (roda no GitHub)
```

## Publicar (uma única vez)
1. Gere um PAT (classic) com escopo `repo` em github.com/settings/tokens
2. Envie esta pasta para o repositório `Eliene-byte/OpenOrg` (pelo botão **Add file → Upload files** no site do GitHub, ou `git push`)
3. No repositório: **Settings → Pages → Source: GitHub Actions**
4. Acesse `https://eliene-byte.github.io/OpenOrg/`

## Adicionar arquivos
- **Pelo site:** botão "Publicar arquivo" → cole o PAT → arraste arquivos → Publicar. O site envia via API para `/files` e atualiza `/data/index.json` sozinho.
- **Pelo GitHub:** arraste arquivos em `/files` (Upload files) e edite `/data/index.json` (ícone de lápis) — ou deixe o site fazer por você.

## Recursos
Busca instantânea (`/`), filtros por tipo/coleção, ordenação, preview de imagem/vídeo/áudio/PDF/texto, download, SHA-256, estatísticas e coleções — tudo no navegador, sem servidor.

> Limite do GitHub: arquivos ≤ 100 MB por arquivo (recomendado < 25 MB), repositório com limite de tamanho — para arquivos grandes, use GitHub Releases ou um bucket externo e aponte `path` como URL completa no `index.json`.
