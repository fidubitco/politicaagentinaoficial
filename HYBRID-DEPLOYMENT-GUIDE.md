# 🚀 Guía de Deployment Híbrido - POLÍTICA ARGENTINA

## Arquitectura Híbrida: Vercel + Railway

Esta guía explica cómo desplegar el portal usando una arquitectura híbrida que separa frontend y backend para máximo rendimiento:

- **Frontend en Vercel**: Sitio estático servido desde CDN global
- **Backend en Railway**: API completa con background jobs y scheduler

---

## 🎯 Ventajas del Setup Híbrido

### Frontend en Vercel
- ✅ CDN global con 300+ edge locations
- ✅ Despliegues instantáneos (<30 segundos)
- ✅ Preview deployments automáticos por PR
- ✅ Cache automático de assets
- ✅ SSL/HTTPS incluido
- ✅ 100GB bandwidth gratis
- ✅ Tier gratuito generoso

### Backend en Railway
- ✅ Soporte completo para Express.js
- ✅ Background jobs sin límites de tiempo
- ✅ Scheduler automático (node-cron)
- ✅ WebSockets support
- ✅ Puppeteer para scraping
- ✅ PostgreSQL connection persistente
- ✅ Docker deployment completo

---

## 📋 Pre-requisitos

### Cuentas Necesarias
1. **GitHub** - Repositorio (gratis)
2. **Vercel** - Frontend hosting (gratis)
3. **Railway** - Backend hosting ($5-10/mes)
4. **Neon** - PostgreSQL database (ya configurada)

### APIs Configuradas
- ✅ Google Gemini API
- ✅ Pexels API
- ✅ ElevenLabs API (opcional)

---

## 🔧 Paso 1: Configurar Railway (Backend)

### 1.1 Crear Proyecto Railway
1. Ve a https://railway.app
2. Login con GitHub
3. Click "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Busca: `politicaargentinaoficial`
6. Railway detectará automáticamente el Dockerfile

### 1.2 Variables de Entorno en Railway
En Railway Dashboard → tu proyecto → Variables → Raw Editor:

```env
NODE_ENV=production
DATABASE_URL=postgresql://tu_usuario:tu_password@tu_host.neon.tech/tu_database?sslmode=require
SITE_URL=https://tu-railway-app.up.railway.app
SITE_NAME=POLÍTICA ARGENTINA
GOOGLE_API_KEY=tu_google_api_key_aqui
PEXELS_API_KEY=tu_pexels_api_key_aqui
ELEVENLABS_API_KEY=tu_elevenlabs_api_key_aqui
PORT=5000
```

### 1.3 Verificar Deployment
Railway comenzará el build automáticamente:
- Tiempo estimado: 5-8 minutos
- Verifica logs en Railway Dashboard → Deployments

### 1.4 Obtener URL de Railway
Una vez desplegado, copia la URL de tu backend:
```
https://tu-railway-app.up.railway.app
```

**IMPORTANTE**: Necesitarás esta URL para configurar Vercel.

---

## 🌐 Paso 2: Configurar Vercel (Frontend)

### 2.1 Actualizar vercel.json con Railway URL

El archivo `vercel.json` ya está configurado, pero necesitas actualizar la URL de Railway:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://TU_RAILWAY_APP_URL/api/:path*"
    }
  ],
  "env": {
    "VITE_API_URL": "https://TU_RAILWAY_APP_URL"
  }
}
```

**Reemplaza** `TU_RAILWAY_APP_URL` con la URL real de Railway (sin `/` al final).

### 2.2 Crear Proyecto Vercel

#### Opción A: Desde la CLI
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login a Vercel
vercel login

# Deploy (desde la raíz del proyecto)
vercel

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Tu cuenta
# - Link to existing project? No
# - Project name: politicaargentinaoficial
# - Directory: ./
# - Override settings? No
```

#### Opción B: Desde el Dashboard
1. Ve a https://vercel.com/new
2. Importa repositorio de GitHub: `politicaargentinaoficial`
3. Configure Project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`

### 2.3 Variables de Entorno en Vercel
En Vercel Dashboard → tu proyecto → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://tu-railway-app.up.railway.app` |

**IMPORTANTE**: Reemplaza con la URL real de Railway.

### 2.4 Re-deploy Vercel
Después de agregar las variables de entorno:
```bash
vercel --prod
```

O desde Vercel Dashboard → Deployments → Re-deploy

---

## ✅ Paso 3: Verificación

### 3.1 Health Checks

#### Verificar Backend (Railway)
```bash
# Health check
curl https://tu-railway-app.up.railway.app/api/health

# Debería retornar:
{
  "status": "healthy",
  "timestamp": "2025-01-...",
  "uptime": 123456
}

# Test API artículos
curl https://tu-railway-app.up.railway.app/api/articles
```

#### Verificar Frontend (Vercel)
```bash
# Homepage
curl https://politicaargentinaoficial.vercel.app

# Debería retornar HTML del frontend
```

### 3.2 Test de Comunicación Frontend-Backend

1. Abre el navegador en tu URL de Vercel:
   ```
   https://politicaargentinaoficial.vercel.app
   ```

2. Abre DevTools (F12) → Network tab

3. Verifica que las requests a `/api/*` se redirigen correctamente a Railway

4. Deberías ver:
   - ✅ Request a `/api/articles`
   - ✅ Response con status 200
   - ✅ Datos JSON de artículos

### 3.3 Checklist de Funcionalidad

- [ ] **Homepage carga en Vercel**
  - Ve a: `https://politicaargentinaoficial.vercel.app`
  - Verifica: GSAP animations funcionando
  - Verifica: Economic Ticker animado
  - Verifica: Assets cargan desde Vercel CDN

- [ ] **API funciona desde Railway**
  - DevTools → Network → Verifica requests a Railway
  - Verifica: CORS headers presentes
  - Verifica: Responses correctas

- [ ] **Admin Panel accesible**
  - Ve a: `https://politicaargentinaoficial.vercel.app/admin`
  - Verifica: Dashboard analytics carga
  - Verifica: Operaciones CRUD funcionan

- [ ] **Traducciones funcionan**
  - Click en Language Selector
  - Verifica: Recarga automática
  - Verifica: Contenido traducido

---

## 🔄 Workflow de Desarrollo

### Deploy Automático

Cada push a `main` despliega automáticamente:

```bash
# 1. Hacer cambios
# ... editar código ...

# 2. Commit
git add .
git commit -m "feat: add new feature"

# 3. Push
git push origin main

# 4. GitHub Actions despliega a Railway automáticamente
# 5. Vercel despliega frontend automáticamente
# 6. Apps actualizadas en ~5-8 minutos
```

### Preview Deployments (Vercel)

Vercel crea preview deployments automáticos para cada PR:
```
https://politicaargentinaoficial-git-feature-branch.vercel.app
```

**IMPORTANTE**: Los preview deployments también pueden comunicarse con Railway gracias a la regex en CORS:
```javascript
/https:\/\/politicaargentinaoficial-.*\.vercel\.app$/
```

---

## 🐛 Troubleshooting

### Problema: CORS errors en DevTools

**Error:**
```
Access to fetch at 'https://tu-railway-app.up.railway.app/api/articles'
from origin 'https://politicaargentinaoficial.vercel.app' has been blocked by CORS policy
```

**Solución:**
1. Verificar que `server/index.ts` tiene configuración CORS correcta
2. Verificar que Railway está desplegado con los cambios de CORS
3. Verificar que la URL de Vercel está en `corsOptions.origin`

### Problema: API requests van a localhost

**Error:** Frontend intenta conectarse a `http://localhost:5000` en producción

**Solución:**
1. Verificar variable de entorno en Vercel: `VITE_API_URL`
2. Verificar que el código usa `import.meta.env.VITE_API_URL`
3. Re-deploy Vercel después de agregar la variable

### Problema: 404 en rutas de frontend

**Error:** Rutas como `/admin`, `/article/123` retornan 404 en Vercel

**Solución:** El `vercel.json` ya está configurado con rewrites, pero verifica:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://tu-railway-app.up.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Problema: Railway build falla

**Solución:**
```bash
# Verificar build local
npm run build

# Verificar TypeScript
npm run check

# Ver logs en Railway Dashboard
railway logs
```

---

## 📊 Monitoreo

### Métricas Railway (Backend)
- **CPU**: <60%
- **Memory**: <500MB
- **Response Time**: <200ms promedio

### Métricas Vercel (Frontend)
- **Build Time**: <2 minutos
- **Deploy Time**: <30 segundos
- **Bandwidth**: Monitorear en Dashboard

### Health Checks Automáticos

Railway ya tiene configurado:
```json
{
  "healthcheckPath": "/api/articles",
  "healthcheckTimeout": 100
}
```

---

## 💰 Costos Estimados

| Servicio | Tier | Costo Mensual |
|----------|------|---------------|
| **Vercel** | Hobby | Gratis |
| - Deployments | Ilimitados | $0 |
| - Bandwidth | 100GB | $0 |
| - Build Time | 6000 min | $0 |
| **Railway** | Hobby | $5-10 |
| - CPU/Memory | Incluido | ~$5 |
| - Bandwidth | 100GB | Incluido |
| **Neon PostgreSQL** | Free | Gratis |
| - Storage | 0-0.5GB | $0 |
| - Compute | Shared | $0 |
| **APIs** | Free Tier | Gratis |
| - Gemini | 15 req/min | $0 |
| - Pexels | 200 req/hora | $0 |
| **TOTAL** | | **~$5-10/mes** |

---

## 🎯 Optimizaciones Recomendadas

### 1. Vercel Edge Config
Almacena configuración global en Vercel Edge para acceso ultra-rápido:
```bash
vercel env add EDGE_CONFIG
```

### 2. Railway Auto-scaling
Configurar escalado automático en Railway:
```json
{
  "deploy": {
    "numReplicas": 1,
    "autoscaling": {
      "minReplicas": 1,
      "maxReplicas": 3,
      "cpuThreshold": 80
    }
  }
}
```

### 3. CDN para Imágenes
Usar Vercel Image Optimization para imágenes de Pexels:
```jsx
import Image from 'next/image'

<Image
  src={article.imageUrl}
  width={800}
  height={600}
  loader={vercelLoader}
/>
```

### 4. Caching Strategies

#### Frontend (Vercel)
```json
{
  "headers": [
    {
      "source": "/assets/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Backend (Railway)
Agregar cache headers en responses:
```typescript
res.set('Cache-Control', 'public, max-age=300');
```

---

## 🔐 Seguridad

### Headers de Seguridad
El `vercel.json` ya incluye:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Variables de Entorno
- ✅ NUNCA commitear `.env` files
- ✅ Usar variables de entorno específicas por plataforma
- ✅ Rotar API keys regularmente

### CORS
Configuración segura ya implementada en `server/index.ts`:
```typescript
const corsOptions = {
  origin: [
    'https://politicaargentinaoficial.vercel.app',
    /https:\/\/politicaargentinaoficial-.*\.vercel\.app$/,
  ],
  credentials: true,
};
```

---

## 📈 Próximos Pasos

### 1. Custom Domain
**Vercel:**
```bash
vercel domains add politicaargentina.com
```

**Railway:**
- Railway Dashboard → Settings → Domains → Add Custom Domain

### 2. Analytics
Integrar Vercel Analytics:
```bash
npm install @vercel/analytics
```

```tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 3. Error Tracking
Integrar Sentry para ambos entornos:
```bash
npm install @sentry/react @sentry/node
```

### 4. Monitoring
- **Frontend**: Vercel Analytics + Lighthouse CI
- **Backend**: Railway Metrics + Custom logging

---

## 📞 Soporte

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **GitHub Repo**: https://github.com/fidubitco/politicaargentinaoficial

---

## ✨ Resumen de URLs

### Producción
- **Frontend (Vercel)**: `https://politicaargentinaoficial.vercel.app`
- **Backend (Railway)**: `https://tu-railway-app.up.railway.app`
- **Admin Panel**: `https://politicaargentinaoficial.vercel.app/admin`

### Desarrollo
- **Local Frontend**: `http://localhost:5173`
- **Local Backend**: `http://localhost:5000`
- **Local Admin**: `http://localhost:5000/admin`

---

## 🎉 ¡Setup Híbrido Completo!

Tu portal ahora tiene:
- ✅ Frontend ultra-rápido en Vercel CDN global
- ✅ Backend completo en Railway con Docker
- ✅ CI/CD automático para ambas plataformas
- ✅ CORS configurado para comunicación segura
- ✅ Preview deployments automáticos
- ✅ SSL/HTTPS en ambos entornos
- ✅ Escalabilidad independiente frontend/backend
- ✅ Costos optimizados (~$5-10/mes total)

**¡Tu sitio está LIVE en arquitectura híbrida profesional!**
