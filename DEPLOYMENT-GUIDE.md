# 🚀 Guía de Deployment - POLÍTICA ARGENTINA

## Resumen del Sistema

Portal de noticias políticas argentinas con:
- ✅ Diseño Aetherium luxury con GSAP animations
- ✅ Economic Ticker estilo Bloomberg
- ✅ Generación automática de 600+ artículos con AI
- ✅ Sistema de traducción a 50 idiomas
- ✅ Admin panel completo con analytics

---

## 📋 Pre-requisitos

### Cuentas Necesarias
1. **GitHub** - Para repositorio y CI/CD (gratis)
2. **Railway** - Para hosting (trial credits + $5-10/mes)
3. **Neon** - PostgreSQL database (ya configurada)

### APIs Configuradas
- ✅ Google Gemini API (generación de artículos)
- ✅ Pexels API (imágenes profesionales)
- ✅ ElevenLabs API (text-to-speech, opcional)

---

## 🔧 Paso 1: Configurar GitHub Repository

### 1.1 Crear Repositorio
```bash
# Ve a https://github.com/new y crea un nuevo repositorio:
# Nombre: politica-argentina-portal
# Descripción: Portal de noticias políticas argentinas con diseño Aetherium
# Visibilidad: Privado
# NO inicialices con README, .gitignore, o license
```

### 1.2 Conectar Repositorio Local
```bash
cd "/Users/usuario/POLITICA ARGENTINA/PoliticaArgentina"

# Agregar remote de GitHub
git remote add origin https://github.com/TU_USUARIO/politica-argentina-portal.git

# Verificar remote
git remote -v
```

---

## 📦 Paso 2: Commit y Push

### 2.1 Stage y Commit Cambios
```bash
# Ver estado actual
git status

# Agregar todos los archivos
git add .

# Commit con mensaje descriptivo
git commit -m "feat: Add Aetherium luxury design system with Railway deployment config

- Add luxury color palette with Royal Blue, Gold, Platinum gradients
- Implement GSAP entrance animations and scroll effects
- Create Bloomberg-style Economic Ticker component
- Add comprehensive admin analytics dashboard
- Configure Railway deployment with Docker
- Set up GitHub Actions CI/CD workflow
- Add 50-language translation system with auto-reload
- Integrate Pexels API for professional images
- Generate 600+ articles with local AI"

# Push a GitHub
git push -u origin main
```

---

## 🚂 Paso 3: Configurar Railway

### 3.1 Crear Proyecto Railway
1. Ve a https://railway.app
2. Login con GitHub
3. Click "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Busca y selecciona: `politica-argentina-portal`
6. Railway detectará automáticamente el Dockerfile

### 3.2 Configurar Variables de Entorno
En Railway Dashboard → tu proyecto → Variables → Raw Editor:

```env
NODE_ENV=production
DATABASE_URL=postgresql://tu_usuario:tu_password@tu_host.neon.tech/tu_database?sslmode=require
SITE_URL=https://tu-app.up.railway.app
SITE_NAME=POLÍTICA ARGENTINA
GOOGLE_API_KEY=tu_google_api_key_aqui
PEXELS_API_KEY=tu_pexels_api_key_aqui
ELEVENLABS_API_KEY=tu_elevenlabs_api_key_aqui
PORT=5000
```

**IMPORTANTE**: Reemplaza `tu-app` con el nombre de tu Railway app.

### 3.3 Deploy Inicial
Railway comenzará el deployment automáticamente. Monitorea los logs:
- Click en tu servicio
- Pestaña "Deployments"
- Verás el build en tiempo real

⏱️ **Tiempo estimado**: 5-8 minutos

---

## 🔄 Paso 4: Configurar CI/CD Automático

### 4.1 Obtener Railway Token
```bash
# Instalar Railway CLI globalmente
npm install -g @railway/cli

# Login a Railway
railway login

# Obtener el token (copiar para GitHub)
railway whoami
```

### 4.2 Agregar Secrets a GitHub
1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Agregar los siguientes secrets:

| Name | Value |
|------|-------|
| `RAILWAY_TOKEN` | Tu token de Railway CLI |

### 4.3 Verificar Workflow
- Ve a tu repositorio → Actions
- Deberías ver el workflow "Deploy to Railway"
- El primer push ya debería estar ejecutándose

---

## 🗄️ Paso 5: Migración de Base de Datos

### 5.1 Push Schema a Producción
```bash
# Ejecutar desde local con DATABASE_URL de producción
npm run db:push
```

### 5.2 Poblar Base de Datos (Opcional)
Si tu base de datos de producción está vacía:

```bash
# Opción 1: Usar Railway CLI
railway run curl -X POST https://tu-app.up.railway.app/api/admin/populate-database

# Opción 2: Desde navegador
# Ve a https://tu-app.up.railway.app/admin
# Y ejecuta la función de población desde el admin panel
```

⏱️ **Tiempo de población**: 30-45 minutos para 600+ artículos

---

## ✅ Paso 6: Verificación y Testing

### 6.1 Health Checks
```bash
# Verificar API
curl https://tu-app.up.railway.app/api/articles

# Verificar Health
curl https://tu-app.up.railway.app/api/health
```

### 6.2 Checklist de Funcionalidad

- [ ] **Homepage carga correctamente**
  - Ve a: `https://tu-app.up.railway.app`
  - Verifica: Economic Ticker animado visible
  - Verifica: GSAP animations funcionando
  - Verifica: Diseño Aetherium (gradientes luxury)

- [ ] **Admin Panel accesible**
  - Ve a: `https://tu-app.up.railway.app/admin`
  - Verifica: Todas las páginas cargan
  - Verifica: AdminAnalytics muestra gráficos

- [ ] **Traducciones funcionan**
  - Click en Language Selector
  - Selecciona idioma diferente
  - Verifica: Página se recarga automáticamente

- [ ] **Artículos se visualizan**
  - Click en cualquier artículo
  - Verifica: Contenido HTML renderizado correctamente
  - Verifica: Imágenes de Pexels cargan

### 6.3 Performance Testing
```bash
# Lighthouse CI desde terminal
npm install -g @lhci/cli
lhci autorun --url=https://tu-app.up.railway.app
```

**Objetivos de Lighthouse:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 🔄 Workflow de Desarrollo Continuo

### Deploy Automático
Cada vez que hagas push a `main`, el CI/CD se ejecuta:

```bash
# 1. Hacer cambios localmente
# ... editar archivos ...

# 2. Commit cambios
git add .
git commit -m "feat: add new feature"

# 3. Push a GitHub
git push origin main

# 4. GitHub Actions se ejecuta automáticamente
# 5. Railway despliega automáticamente
# 6. Tu app se actualiza en ~5-8 minutos
```

### Monitoreo de Deployments
- **GitHub Actions**: Ver logs en GitHub → Actions
- **Railway Logs**: `railway logs` en terminal
- **Railway Dashboard**: Ver métricas en tiempo real

---

## 🐛 Troubleshooting

### Problema: Build falla en Railway
**Solución:**
```bash
# Verificar que todas las dependencias están en package.json
npm install

# Verificar TypeScript compile localmente
npm run check

# Verificar build local
npm run build
```

### Problema: Variables de entorno no funcionan
**Solución:**
1. Verificar en Railway Dashboard → Variables
2. Asegurar que DATABASE_URL tiene `?sslmode=require`
3. Reiniciar deployment: Railway Dashboard → ... → Restart

### Problema: Database connection error
**Solución:**
```bash
# Verificar connection string
echo $DATABASE_URL

# Test connection desde Railway CLI
railway run npm run db:push
```

### Problema: CI/CD no se ejecuta
**Solución:**
1. Verificar que el workflow existe: `.github/workflows/railway-deploy.yml`
2. Verificar secret RAILWAY_TOKEN en GitHub Settings
3. Verificar permisos: Settings → Actions → General → Workflow permissions

---

## 📊 Monitoreo en Producción

### Métricas Importantes

**Railway Dashboard:**
- CPU Usage: <60%
- Memory: <500MB
- Network: <1GB/día

**Application Health:**
```bash
# Endpoint de health check
curl https://tu-app.up.railway.app/api/health

# Respuesta esperada:
{
  "status": "healthy",
  "timestamp": "2025-01-...",
  "uptime": 123456
}
```

---

## 💰 Costos Estimados

| Servicio | Costo |
|----------|-------|
| Railway (Hobby Plan) | $5-10/mes |
| Neon PostgreSQL | Gratis (0-0.5GB) |
| GitHub Actions | Gratis (2000 min/mes) |
| APIs (Gemini, Pexels) | Gratis (tier gratuito) |
| **TOTAL** | **~$5-10/mes** |

---

## 🎯 Próximos Pasos

### Mejoras Recomendadas
1. **Custom Domain**: Conectar dominio propio en Railway
2. **CDN**: Configurar Cloudflare para imágenes
3. **Monitoring**: Agregar Sentry para error tracking
4. **Backups**: Configurar backups automáticos en Neon
5. **Analytics**: Integrar Google Analytics/Plausible

### Migración a Next.js 15 (Futuro)
Sigue la guía en: `NEXTJS-15-MIGRATION-GUIDE.md`

---

## 📞 Soporte

- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **GitHub Actions**: https://docs.github.com/actions

---

## ✨ ¡Felicidades!

Tu portal de noticias políticas profesional está ahora en producción con:
- ✅ Deploy automático con CI/CD
- ✅ Diseño luxury Aetherium
- ✅ 600+ artículos generados con AI
- ✅ Sistema de traducción a 50 idiomas
- ✅ Admin panel completo
- ✅ Economic Ticker animado
- ✅ GSAP animations profesionales

**URL de Producción**: `https://tu-app.up.railway.app`

🎉 **¡Tu sitio está LIVE!**
