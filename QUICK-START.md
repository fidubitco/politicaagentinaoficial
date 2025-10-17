# ⚡ QUICK START - Deployment Rápido

Sigue estos pasos en orden. Total: 15-20 minutos.

---

## 📍 PASO 1: Railway (Backend) - 10 minutos

### 1.1 Crear Proyecto

1. Abre Railway:
   ```
   https://railway.app
   ```

2. Login con GitHub → "New Project" → "Deploy from GitHub repo"

3. Selecciona: `fidubitco/politicaagentinaoficial`

### 1.2 Configurar Variables

1. Railway Dashboard → Tu proyecto → **Variables** → **Raw Editor**

2. Abre el archivo `.env.railway` en tu proyecto local

3. **Copia TODO** el contenido

4. Pégalo en Railway Raw Editor

5. Click **"Add"** o **"Save"**

### 1.3 Esperar Deployment

- Ve a **Deployments**
- Espera 5-8 minutos
- Estado: **Success** ✅

### 1.4 Copiar URL

1. Click en **Settings** → **Domains**

2. Copia la URL completa (sin https://):
   ```
   Ejemplo: politicaargentinaoficial-production.up.railway.app
   ```

3. **Guarda esta URL** - la necesitas para el siguiente paso

---

## 📍 PASO 2: Actualizar vercel.json - 1 minuto

### Opción A: Automática (Con mi ayuda)

Envíame tu URL de Railway y yo actualizo el archivo automáticamente.

**Ejemplo:**
```
URL de Railway: politicaargentinaoficial-production.up.railway.app
```

### Opción B: Manual

1. Abre `vercel.json`

2. Busca `YOUR_RAILWAY_APP_URL` (aparece 2 veces)

3. Reemplaza con tu URL de Railway:

**Línea 10-12:**
```json
"destination": "https://TU-URL-RAILWAY.up.railway.app/api/:path*"
```

**Línea 47-49:**
```json
"env": {
  "VITE_API_URL": "https://TU-URL-RAILWAY.up.railway.app"
}
```

4. Guarda el archivo

5. Commit y push:
```bash
git add vercel.json
git commit -m "chore: update Railway URL"
git push origin main
```

---

## 📍 PASO 3: Vercel (Frontend) - 5 minutos

### 3.1 Ejecutar Script Automático

```bash
./deploy-vercel.sh
```

El script hará:
1. Instalar Vercel CLI (si no está instalado)
2. Login a Vercel
3. Deploy preview
4. Preguntar si quieres deploy a producción

### 3.2 Configuración Durante el Deploy

Cuando `vercel` te pregunte:

**Set up and deploy?** → `Y` (Yes)

**Which scope?** → Selecciona tu cuenta

**Link to existing project?** → `N` (No)

**Project name?** → `politicaargentinaoficial` (o presiona Enter)

**In which directory is your code located?** → `./` (presiona Enter)

**Want to override settings?** → `Y` (Yes)

**Build Command?** → `npm run build`

**Output Directory?** → `client/dist`

**Development Command?** → `npm run dev` (presiona Enter)

### 3.3 Agregar Variable de Entorno

El script preguntará por `VITE_API_URL`:

```
VITE_API_URL=https://TU-URL-RAILWAY.up.railway.app
```

Reemplaza con tu URL real de Railway.

### 3.4 Deploy a Producción

Cuando el script pregunte:
```
¿Desplegar a producción? (y/n):
```

Presiona `y` y Enter.

---

## ✅ PASO 4: Verificación - 2 minutos

### 4.1 Test Backend

```bash
# Reemplaza con tu URL de Railway
curl https://TU-URL-RAILWAY.up.railway.app/api/health
```

**Respuesta esperada:**
```json
{"status":"healthy","timestamp":"...","uptime":...}
```

### 4.2 Test Frontend

1. Abre en navegador:
   ```
   https://politicaargentinaoficial.vercel.app
   ```

2. Presiona **F12** → Pestaña **Network**

3. Busca requests a `/api/articles`

4. Verifica que el **dominio sea tu Railway URL**

### 4.3 Test Admin

Abre:
```
https://politicaargentinaoficial.vercel.app/admin
```

---

## 🎉 ¡Listo!

Tu portal está en producción:

- **Frontend:** https://politicaargentinaoficial.vercel.app
- **Backend:** https://TU-URL-RAILWAY.up.railway.app
- **Admin:** https://politicaargentinaoficial.vercel.app/admin

---

## 📊 Resumen de Costos

- Vercel: **Gratis**
- Railway: **$5-10/mes**
- Neon: **Gratis**
- **Total: $5-10/mes**

---

## ❓ Troubleshooting Rápido

### CORS Error
- Verifica que Railway esté desplegado con los últimos cambios
- Railway Dashboard → Deployments → Redeploy

### 404 en API
- Verifica `VITE_API_URL` en Vercel Settings → Environment Variables
- Re-deploy Vercel

### Build Error
```bash
npm run build
# Arreglar errores y push
git push origin main
```

---

## 📖 Documentación Completa

Para más detalles:
- `DEPLOYMENT-STEPS.md` - Guía paso a paso detallada
- `HYBRID-DEPLOYMENT-GUIDE.md` - Arquitectura y optimizaciones

---

## 🚀 ¡Comienza Ahora!

**Empieza con PASO 1 (Railway)** →  https://railway.app
