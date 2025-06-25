#!/bin/bash

# Script para configurar o banco de dados DeathBoard no MySQL existente
echo "🔧 Configurando banco de dados DeathBoard..."

# Variáveis de ambiente (ajuste conforme necessário)
MYSQL_HOST=${MYSQL_HOST:-localhost}
MYSQL_PORT=${MYSQL_PORT:-3306}
MYSQL_USER=${MYSQL_USER:-root}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-catarino}
MYSQL_DATABASE=${MYSQL_DATABASE:-deathboard}

echo "📊 Conectando ao MySQL em $MYSQL_HOST:$MYSQL_PORT..."

# Criar banco de dados se não existir
mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Banco de dados '$MYSQL_DATABASE' criado/verificado com sucesso!"
else
    echo "❌ Erro ao criar banco de dados. Verifique as credenciais do MySQL."
    exit 1
fi

# Executar script de inicialização
echo "📝 Executando script de inicialização..."
mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < init.sql

if [ $? -eq 0 ]; then
    echo "✅ Script de inicialização executado com sucesso!"
    echo "🎉 Banco de dados DeathBoard configurado e pronto para uso!"
else
    echo "❌ Erro ao executar script de inicialização."
    exit 1
fi

echo ""
echo "📋 Próximos passos:"
echo "1. Execute: docker compose up -d"
echo "2. Acesse: http://localhost:3001"
echo "3. Verifique o health check: http://localhost:3001/api/health" 