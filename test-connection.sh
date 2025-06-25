#!/bin/bash

# Script para testar a conexão com o banco de dados existente
echo "🔍 Testando conexão com o banco de dados..."

# Variáveis de ambiente
MYSQL_HOST=${MYSQL_HOST:-mysql-n8n}
MYSQL_PORT=${MYSQL_PORT:-3306}
MYSQL_USER=${MYSQL_USER:-root}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-catarino}
MYSQL_DATABASE=${MYSQL_DATABASE:-deathboard}

echo "📊 Conectando ao MySQL em $MYSQL_HOST:$MYSQL_PORT..."

# Testar conexão
mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD -e "USE $MYSQL_DATABASE; SHOW TABLES;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Conexão com banco de dados estabelecida com sucesso!"
    echo "📋 Tabelas encontradas:"
    mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD -e "USE $MYSQL_DATABASE; SHOW TABLES;" 2>/dev/null
    echo ""
    echo "🎉 Banco de dados está pronto para uso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Execute: docker compose up -d"
    echo "2. Acesse: http://localhost:3001"
    echo "3. Verifique o health check: http://localhost:3001/api/health"
else
    echo "❌ Erro ao conectar com banco de dados."
    echo "Verifique:"
    echo "- Se o MySQL está rodando"
    echo "- Se as credenciais estão corretas"
    echo "- Se o banco '$MYSQL_DATABASE' existe"
    exit 1
fi 