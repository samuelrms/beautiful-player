#!/bin/bash

set -e

echo "🔢 Qual tipo de versionamento deseja fazer?"
echo "1) patch  (ex: 0.1.7 → 0.1.8)"
echo "2) minor  (ex: 0.1.8 → 0.2.0)"
echo "3) major  (ex: 0.2.0 → 1.0.0)"
read -p "Escolha (1/2/3): " choice

case $choice in
  1)
    VERSION_TYPE="patch"
    ;;
  2)
    VERSION_TYPE="minor"
    ;;
  3)
    VERSION_TYPE="major"
    ;;
  *)
    echo "❌ Escolha inválida. Saindo..."
    exit 1
    ;;
esac

echo "📦 Rodando build antes do versionamento..."
pnpm run build

echo "🏷 Fazendo bump de versão: $VERSION_TYPE..."
pnpm version $VERSION_TYPE

echo "📤 Enviando commit e tag para o repositório remoto..."
git push origin main
git push --tags

echo "✅ Versão publicada com sucesso!"