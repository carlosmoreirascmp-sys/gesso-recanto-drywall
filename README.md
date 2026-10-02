# Gesso Recanto — site principal e serviços

Páginas públicas no mesmo domínio e projeto Vercel:

- Principal: https://gessorecantosp.com.br/
- Gesso: https://gessorecantosp.com.br/gesso
- Drywall e instalação: https://gessorecantosp.com.br/drywall
- Materiais para drywall: https://gessorecantosp.com.br/materiais-drywall

As rotas em `vercel.json` são avaliadas antes dos arquivos. A inicial está em
`principal/`, gesso em `gesso/`, a página de drywall em `drywall/index.html`
(usando os arquivos da raiz) e materiais em `materiais/`. Cada página usa
caminhos absolutos para carregar suas mídias mesmo sem barra final no endereço.

Os antigos subdomínios de obra e materiais redirecionam com HTTP 308 para os
novos caminhos, preservando parâmetros de campanha. O subdomínio de gessos
redireciona no projeto Vercel separado `gesso-recanto`. O sitemap inclui as
quatro páginas e os eventos GA4 preservam os identificadores de cada serviço.
