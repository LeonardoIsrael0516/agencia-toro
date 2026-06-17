#!/usr/bin/env bash
set -euo pipefail

# Roteia api.agenciatoro.com.br direto para localhost:3333 via Cloudflare Tunnel.
# Nao mexe na porta 80 do getfy.

TUNNEL_NAME="${TUNNEL_NAME:-agencia-toro-api}"
API_HOST="${API_HOST:-api.agenciatoro.com.br}"
API_PORT="${API_PORT:-3333}"
CONFIG_DIR="${CONFIG_DIR:-/etc/cloudflared}"
CREDENTIALS_DIR="${CREDENTIALS_DIR:-${CONFIG_DIR}/credentials}"

log() { printf '[cf-tunnel] %s\n' "$*"; }
die() { printf '[cf-tunnel] ERRO: %s\n' "$*" >&2; exit 1; }

usage() {
  cat <<EOF
Uso: sudo bash scripts/setup-api-cloudflare-tunnel.sh

Pre-requisitos:
  1. Conta Cloudflare com dominio agenciatoro.com.br
  2. API respondendo: curl http://127.0.0.1:${API_PORT}/health
  3. cloudflared instalado (o script tenta instalar se faltar)

Passos manuais no painel Cloudflare (uma vez):
  - Zero Trust > Networks > Tunnels > Create tunnel (ou use este script)
  - Autentique cloudflared: cloudflared tunnel login

O script cria o tunnel "${TUNNEL_NAME}" e publica ${API_HOST} -> http://127.0.0.1:${API_PORT}

Depois, no DNS do Cloudflare:
  - Remova o registro A de "api" (se existir)
  - O comando "tunnel route dns" cria o CNAME automaticamente

EOF
}

require_root() {
  [[ "${EUID:-$(id -u)}" -eq 0 ]] || die "Execute com sudo"
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Comando obrigatorio ausente: $1"
}

install_cloudflared() {
  if command -v cloudflared >/dev/null 2>&1; then
    return
  fi

  log "Instalando cloudflared..."
  require_command curl
  mkdir -p /usr/local/bin
  curl -fsSL -o /usr/local/bin/cloudflared \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  chmod +x /usr/local/bin/cloudflared
  log "cloudflared instalado em /usr/local/bin/cloudflared"
}

check_api() {
  require_command curl
  curl -fsS "http://127.0.0.1:${API_PORT}/health" >/dev/null \
    || die "API nao responde em http://127.0.0.1:${API_PORT}/health"
  log "API OK na porta ${API_PORT}"
}

ensure_tunnel() {
  require_command cloudflared

  if ! cloudflared tunnel list 2>/dev/null | grep -q "${TUNNEL_NAME}"; then
    log "Criando tunnel ${TUNNEL_NAME}..."
    cloudflared tunnel create "${TUNNEL_NAME}"
  else
    log "Tunnel ${TUNNEL_NAME} ja existe"
  fi

  local tunnel_id
  tunnel_id="$(cloudflared tunnel list | awk -v name="${TUNNEL_NAME}" '$2 == name { print $1 }' | head -n1)"
  [[ -n "${tunnel_id}" ]] || die "Nao foi possivel obter o ID do tunnel ${TUNNEL_NAME}"

  local default_cred="/root/.cloudflared/${tunnel_id}.json"
  local cred_file="${CREDENTIALS_DIR}/${tunnel_id}.json"

  if [[ -f "${default_cred}" && ! -f "${cred_file}" ]]; then
    mkdir -p "${CREDENTIALS_DIR}"
    cp "${default_cred}" "${cred_file}"
  fi

  if [[ ! -f "${cred_file}" && -f "${default_cred}" ]]; then
    cred_file="${default_cred}"
  fi

  [[ -f "${cred_file}" ]] || die "Credenciais do tunnel nao encontradas. Rode: cloudflared tunnel login && cloudflared tunnel create ${TUNNEL_NAME}"

  printf '%s\n%s' "${tunnel_id}" "${cred_file}"
}

write_config() {
  local tunnel_id="$1"
  local cred_file="$2"
  local config_file="${CONFIG_DIR}/config.yml"

  mkdir -p "${CONFIG_DIR}"

  cat >"${config_file}" <<EOF
tunnel: ${TUNNEL_NAME}
credentials-file: ${cred_file}

ingress:
  - hostname: ${API_HOST}
    service: http://127.0.0.1:${API_PORT}
  - service: http_status:404
EOF

  log "Config escrita em ${config_file}"
}

route_dns() {
  log "Publicando DNS ${API_HOST} no tunnel..."
  cloudflared tunnel route dns "${TUNNEL_NAME}" "${API_HOST}" || {
    log "Aviso: route dns falhou (registro pode ja existir). Verifique no painel Cloudflare."
  }
}

install_service() {
  log "Instalando servico systemd cloudflared..."
  cloudflared --config "${CONFIG_DIR}/config.yml" service install
  systemctl enable cloudflared
  systemctl restart cloudflared
  systemctl --no-pager --full status cloudflared || true
  log "Tunnel ativo. Teste: curl -fsS https://${API_HOST}/health"
  log "Config: ${CONFIG_DIR}/config.yml"
}

main() {
  case "${1:-}" in
    -h|--help) usage; exit 0 ;;
  esac

  require_root
  install_cloudflared
  check_api

  if ! cloudflared tunnel list >/dev/null 2>&1; then
    die "cloudflared nao autenticado. Rode: cloudflared tunnel login"
  fi

  local tunnel_id cred_file
  read -r tunnel_id cred_file < <(ensure_tunnel)
  write_config "${tunnel_id}" "${cred_file}"
  route_dns
  install_service

  cat <<EOF

========================================
 Cloudflare Tunnel configurado
========================================

${API_HOST} -> http://127.0.0.1:${API_PORT}

Teste:
  curl -fsS https://${API_HOST}/health

CRM:
  API_URL=https://${API_HOST}

O getfy na porta 80 permanece intocado.

EOF
}

main "$@"
