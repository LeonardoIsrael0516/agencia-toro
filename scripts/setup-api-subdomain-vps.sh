#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-/opt/agencia-toro}"
API_PORT="${API_PORT:-3333}"
API_HOST="${API_HOST:-api.agenciatoro.com.br}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-api.agenciatoro.com.br}"

log() { printf '[api-subdomain] %s\n' "$*"; }
die() { printf '[api-subdomain] ERRO: %s\n' "$*" >&2; exit 1; }

usage() {
  cat <<EOF
Configura o subdominio ${API_HOST} no nginx para apontar para a API na porta ${API_PORT}.

Uso:
  sudo bash scripts/setup-api-subdomain-vps.sh

Variaveis:
  INSTALL_DIR     Repo na VPS (padrao: /opt/agencia-toro)
  API_PORT        Porta da API no host (padrao: 3333)
  API_HOST        Hostname do subdominio (padrao: api.agenciatoro.com.br)

Pre-requisitos:
  - API rodando: curl http://127.0.0.1:${API_PORT}/health
  - DNS A/AAAA de ${API_HOST} apontando para esta VPS
  - nginx instalado (nao altera o getfy; adiciona apenas um server_name novo)

EOF
}

require_root() {
  [[ "${EUID:-$(id -u)}" -eq 0 ]] || die "Execute com sudo"
}

check_api() {
  require_command curl
  local url="http://127.0.0.1:${API_PORT}/health"
  log "Verificando API em ${url}..."
  curl -fsS "$url" >/dev/null || die "API nao responde em ${url}. Suba o container primeiro."
  log "API OK"
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Comando obrigatorio ausente: $1"
}

install_nginx_site() {
  require_command nginx

  local src="${INSTALL_DIR}/deploy/nginx/api.agenciatoro.com.br.conf"
  [[ -f "$src" ]] || die "Arquivo nginx nao encontrado: ${src}"

  local dest="/etc/nginx/sites-available/${NGINX_SITE_NAME}"
  cp "$src" "$dest"
  ln -sf "$dest" "/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"

  log "Testando configuracao nginx..."
  nginx -t

  systemctl reload nginx
  log "Nginx recarregado com server_name ${API_HOST}"
}

issue_tls_cert() {
  if command -v certbot >/dev/null 2>&1; then
    log "Emitindo/renovando certificado TLS com certbot..."
    certbot --nginx -d "$API_HOST" --non-interactive --agree-tos -m "${CERTBOT_EMAIL:-}" || {
      log "Aviso: certbot falhou. Rode manualmente:"
      log "  sudo certbot --nginx -d ${API_HOST}"
    }
    return
  fi

  log "certbot nao encontrado. Com Cloudflare proxy (nuvem laranja), HTTPS na borda pode bastar."
  log "Sem certbot, garanta TLS no proxy existente ou instale: sudo apt install certbot python3-certbot-nginx"
}

print_summary() {
  cat <<EOF

========================================
 Subdominio API configurado
========================================

Host:     https://${API_HOST}
Backend:  http://127.0.0.1:${API_PORT}
Health:   https://${API_HOST}/health

Teste:
  curl -fsS https://${API_HOST}/health

Cloudflare (se usar proxy):
  - Registro A de ${API_HOST} -> IP da VPS
  - SSL/TLS: Full (strict) se tiver certificado no nginx; senao Full

CRM (variavel API_URL no Worker):
  API_URL=https://${API_HOST}

Nao remove nem altera o getfy/Gateway — apenas adiciona um server block para ${API_HOST}.

EOF
}

main() {
  case "${1:-}" in
    -h|--help) usage; exit 0 ;;
  esac

  if [[ "$0" == *"/scripts/"* ]]; then
    INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
  fi

  require_root
  check_api
  install_nginx_site
  issue_tls_cert
  print_summary
}

main "$@"
