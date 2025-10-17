#!/bin/bash
# Script de Deployment para Vercel Frontend
# Ejecutar después de tener Railway configurado

echo "🚀 Deployment de Frontend a Vercel"
echo "=================================="
echo ""

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI instalado"
    echo ""
fi

# Login a Vercel
echo "🔐 Iniciando login a Vercel..."
echo "Se abrirá tu navegador para autenticarte"
echo ""
vercel login

echo ""
echo "📋 Configuración del proyecto:"
echo "   - Build Command: npm run build"
echo "   - Output Directory: client/dist"
echo "   - Development Command: npm run dev"
echo ""
echo "⚠️  IMPORTANTE: Cuando te pregunte por VITE_API_URL,"
echo "   usa tu URL de Railway (ejemplo: https://tu-app.up.railway.app)"
echo ""

# Deploy a Vercel (preview)
echo "🚀 Desplegando preview..."
vercel

echo ""
echo "✅ Preview deployment completo!"
echo ""
read -p "¿Desplegar a producción? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Desplegando a producción..."
    vercel --prod
    echo ""
    echo "✅ Deployment a producción completo!"
    echo ""
    echo "📊 Tu sitio está live en:"
    echo "   https://politicaargentinaoficial.vercel.app"
fi

echo ""
echo "🎉 ¡Deployment completo!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Verifica que el sitio carga: https://politicaargentinaoficial.vercel.app"
echo "   2. Abre DevTools (F12) y verifica requests a Railway"
echo "   3. Prueba el Admin Panel: https://politicaargentinaoficial.vercel.app/admin"
echo ""
