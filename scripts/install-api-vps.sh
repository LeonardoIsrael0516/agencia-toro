#!/usr/bin/env bash
set -euo pipefail

COMPOSE_PROJECT="${COMPOSE_PROJECT:-agencia-toro}"
INSTALL_DIR="${INSTALL_DIR:-/opt/agencia-toro}"
API_PORT="${API_PORT:-3333}"
REPO_URL="${REPO_URL:-}"
SKIP_CLONE=false
FORCE_ENV=false
UPDATE_ONLY=false

log() {
  printf '[agencia-toro] %s\n' "$*"
}

die() {
  printf '[agencia-toro] ERRO: %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Uso: install-api-vps.sh [opcoes]

Instala a API Agencia Toro via Docker, isolada de outros stacks (ex.: getfy na porta 80).

Opcoes:
  --skip-clone    Nao clona o repo; usa INSTALL_DIR existente
  --force         Sobrescreve deploy/.env existente
  --update        Atualiza codigo (git pull), rebuild e restart (sem re-seed)
  -h, --help      Mostra esta ajuda

Variaveis de ambiente:
  REPO_URL        URL do repositorio Git (obrigatorio sem --skip-clone)
  INSTALL_DIR     Diretorio de instalacao (padrao: /opt/agencia-toro)
  API_PORT        Porta da API no host (padrao: 3333)
  COMPOSE_PROJECT Nome do projeto Docker Compose (padrao: agencia-toro)

  ADMIN_EMAIL     E-mail do admin (ou prompt interativo)
  ADMIN_PASSWORD  Senha do admin (ou prompt interativo)
  CORS_ORIGINS    Origens CORS separadas por virgula (ou prompt interativo)

Exemplo:
  export REPO_URL="https://github.com/SEU_USER/agencia-toro.git"
  sudo bash scripts/install-api-vps.sh
EOF
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --skip-clone) SKIP_CLONE=true ;;
      --force) FORCE_ENV=true ;;
      --update) UPDATE_ONLY=true ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        die "Opcao desconhecida: $1 (use --help)"
        ;;
    esac
    shift
  done

  if [[ "$SKIP_CLONE" == true && "$INSTALL_DIR" == "/opt/agencia-toro" ]]; then
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    INSTALL_DIR="$(cd "${script_dir}/.." && pwd)"
  fi
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Comando obrigatorio nao encontrado: $1"
}

check_docker() {
  require_command docker
  docker compose version >/dev/null 2>&1 || die "docker compose nao disponivel"
  docker info >/dev/null 2>&1 || die "Docker nao esta rodando ou sem permissao"
}

check_port_free() {
  if command -v ss >/dev/null 2>&1; then
    if ss -tuln | grep -q ":${API_PORT} "; then
      die "Porta ${API_PORT} ja esta em uso. Escolha outra com API_PORT=XXXX"
    fi
    return
  fi

  if command -v lsof >/dev/null 2>&1; then
    if lsof -i ":${API_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
      die "Porta ${API_PORT} ja esta em uso. Escolha outra com API_PORT=XXXX"
    fi
    return
  fi

  log "Aviso: nao foi possivel verificar se a porta ${API_PORT} esta livre (ss/lsof ausentes)"
}

clone_or_update_repo() {
  if [[ "$SKIP_CLONE" == true ]]; then
    [[ -d "$INSTALL_DIR" ]] || die "INSTALL_DIR nao existe: $INSTALL_DIR"
    log "Usando codigo existente em ${INSTALL_DIR}"
    if [[ -d "${INSTALL_DIR}/.git" ]]; then
      log "Atualizando repositorio (git pull)..."
      git -C "$INSTALL_DIR" pull --ff-only
    fi
    return
  fi

  [[ -n "$REPO_URL" ]] || die "REPO_URL e obrigatorio (ex.: https://github.com/USER/agencia-toro.git)"

  if [[ -d "$INSTALL_DIR/.git" ]]; then
    log "Diretorio ${INSTALL_DIR} ja existe; executando git pull..."
    git -C "$INSTALL_DIR" pull --ff-only
  else
    log "Clonando ${REPO_URL} em ${INSTALL_DIR}..."
    mkdir -p "$(dirname "$INSTALL_DIR")"
    git clone "$REPO_URL" "$INSTALL_DIR"
  fi
}

prompt_if_empty() {
  local var_name="$1"
  local prompt_text="$2"
  local secret="${3:-false}"
  local current_value="${!var_name:-}"

  if [[ -n "$current_value" ]]; then
    return
  fi

  if [[ "$secret" == true ]]; then
    read -r -s -p "$prompt_text: " current_value
    echo
  else
    read -r -p "$prompt_text: " current_value
  fi

  printf -v "$var_name" '%s' "$current_value"
}

generate_env_file() {
  local env_file="${INSTALL_DIR}/deploy/.env"

  if [[ -f "$env_file" && "$FORCE_ENV" != true ]]; then
    log "Arquivo ${env_file} ja existe; mantendo (use --force para sobrescrever)"
    return
  fi

  if [[ "$UPDATE_ONLY" == true ]]; then
    return
  fi

  prompt_if_empty ADMIN_EMAIL "E-mail do administrador" false
  prompt_if_empty ADMIN_PASSWORD "Senha do administrador (min. 8 caracteres)" true
  prompt_if_empty CORS_ORIGINS "CORS_ORIGINS (URLs do CRM e site, separadas por virgula)" false

  [[ -n "${ADMIN_EMAIL:-}" ]] || die "ADMIN_EMAIL e obrigatorio"
  [[ -n "${ADMIN_PASSWORD:-}" ]] || die "ADMIN_PASSWORD e obrigatorio"
  [[ ${#ADMIN_PASSWORD} -ge 8 ]] || die "ADMIN_PASSWORD deve ter no minimo 8 caracteres"
  [[ -n "${CORS_ORIGINS:-}" ]] || die "CORS_ORIGINS e obrigatorio"

  require_command openssl

  local jwt_access jwt_refresh lead_ingest
  jwt_access="$(openssl rand -hex 32)"
  jwt_refresh="$(openssl rand -hex 32)"
  lead_ingest="$(openssl rand -hex 16)"

  mkdir -p "${INSTALL_DIR}/deploy"

  cat >"$env_file" <<EOF
DATABASE_URL=file:./data/production.sqlite
PORT=3333
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_DOMAIN=

JWT_ACCESS_SECRET=${jwt_access}
JWT_REFRESH_SECRET=${jwt_refresh}
LEAD_INGEST_SECRET=${lead_ingest}

ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
CORS_ORIGINS=${CORS_ORIGINS}
EOF

  chmod 600 "$env_file"
  log "Arquivo ${env_file} criado"
}

compose() {
  docker compose -p "$COMPOSE_PROJECT" -f "${INSTALL_DIR}/deploy/docker-compose.yml" "$@"
}

deploy_stack() {
  log "Construindo imagem Docker..."
  compose build

  log "Subindo container agencia-toro-api na porta ${API_PORT}..."
  compose up -d
}

setup_database() {
  if [[ "$UPDATE_ONLY" == true ]]; then
    log "Modo --update: pulando db:push e db:seed"
    return
  fi

  log "Aplicando schema do banco (db:push)..."
  compose exec -T api npm run db:push

  log "Executando seed do admin (db:seed:prod)..."
  compose exec -T api npm run db:seed:prod
}

wait_for_health() {
  local attempts=30
  local url="http://127.0.0.1:${API_PORT}/health"

  require_command curl

  log "Aguardando API em ${url}..."
  for ((i = 1; i <= attempts; i++)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      log "Health check OK"
      return
    fi
    sleep 2
  done

  die "API nao respondeu em /health apos ${attempts} tentativas. Verifique: compose logs api"
}

print_summary() {
  local public_ip env_file
  env_file="${INSTALL_DIR}/deploy/.env"

  if command -v hostname >/dev/null 2>&1; then
    public_ip="$(curl -fsS --max-time 3 https://api.ipify.org 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}' || echo 'IP_DA_VPS')"
  else
    public_ip="IP_DA_VPS"
  fi

  cat <<EOF

========================================
 API Agencia Toro instalada com sucesso
========================================

URL publica:  http://${public_ip}:${API_PORT}
Health:       http://${public_ip}:${API_PORT}/health
Admin:        ${ADMIN_EMAIL:-(ver ${env_file})}

Stack isolado:
  - Projeto Compose: ${COMPOSE_PROJECT}
  - Container:       agencia-toro-api
  - Volume SQLite:   agencia-toro-data
  - Rede:            agencia-toro-net

Nao interfere no getfy (porta 80 permanece intocada).

Comandos uteis:
  cd ${INSTALL_DIR}/deploy
  docker compose -p ${COMPOSE_PROJECT} logs -f api
  docker compose -p ${COMPOSE_PROJECT} restart api
  bash ${INSTALL_DIR}/scripts/install-api-vps.sh --skip-clone --update

Firewall (se usar ufw):
  sudo ufw allow ${API_PORT}/tcp

EOF
}

main() {
  parse_args "$@"

  log "Iniciando deploy da API Agencia Toro"
  log "Este script NAO altera containers getfy nem usa a porta 80"

  check_docker

  if [[ "$UPDATE_ONLY" != true ]]; then
    check_port_free
  fi

  clone_or_update_repo
  generate_env_file
  deploy_stack
  setup_database
  wait_for_health
  print_summary
}

main "$@"
