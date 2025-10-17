# 🚀 Pasos de Deployment - GUÍA RÁPIDA

Sigue estos pasos en orden para desplegar tu portal:

---

## ✅ PASO 1: Configurar Railway (Backend)

### 1.1 Crear Proyecto en Railway

1. **Abrir Railway:**
   ```
   https://railway.app
   ```

2. **Login con GitHub:**
   - Click en "Login"
   - Selecciona "Login with GitHub"
   - Autoriza Railway a acceder a tus repositorios

3. **Crear Nuevo Proyecto:**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Busca: `fidubitco/politicaagentinaoficial`
   - Click en el repositorio para seleccionarlo
   - Railway detectará automáticamente el `Dockerfile`

### 1.2 Configurar Variables de Entorno

1. **Abrir Variables:**
   - En Railway Dashboard → Click en tu proyecto
   - Ve a la pestaña "Variables"
   - Click en "Raw Editor" (esquina superior derecha)

2. **Copiar Variables:**
   - Abre el archivo `.env.railway` en tu proyecto local
   - Copia TODO el contenido
   - Pégalo en el Raw Editor de Railway

3. **Guardar:**
   - Click en "Add" o "Save"
   - Railway re-desplegará automáticamente

### 1.3 Esperar Deployment

- Ve a la pestaña "Deployments"
- Espera 5-8 minutos
- Verifica que el estado sea "Success" ✅

### 1.4 Copiar URL de Railway

1. **Obtener URL:**
   - En Railway Dashboard → Tu proyecto
   - Click en "Settings"
   - Busca "Domains"
   - Copia la URL que aparece (ejemplo: `politicaargentinaoficial-production.up.railway.app`)

2. **Guardar URL:**
   - Copia esta URL completa
   - La necesitarás para el siguiente paso

**IMPORTANTE:** Copia esta URL ahora:
```
https://__________________.up.railway.app
```

---

## ✅ PASO 2: Actualizar vercel.json

Ahora que tienes la URL de Railway, necesitas actualizarla en tu proyecto local:

### 2.1 Editar vercel.json

1. Abre `vercel.json` en tu editor
2. Busca `YOUR_RAILWAY_APP_URL` (aparece 2 veces)
3. Reemplázalo con tu URL real de Railway

**Antes:**
```json
"destination": "https://YOUR_RAILWAY_APP_URL/api/:path*"
```

**Después:**
```json
"destination": "https://tu-app-real.up.railway.app/api/:path*"
```

### 2.2 Commit y Push

```bash
git add vercel.json
git commit -m "chore: update Railway URL in vercel.json"
git push origin main
```

---

## ✅ PASO 3: Configurar Vercel (Frontend)

### Opción A: Desde CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI globalmente
npm install -g vercel

# 2. Login a Vercel
vercel login
# Se abrirá el navegador para autenticarte

# 3. Deploy (desde la raíz del proyecto)
vercel

# Responde a los prompts:
# - Set up and deploy? → Yes
# - Which scope? → Tu cuenta personal
# - Link to existing project? → No
# - Project name? → politicaargentinaoficial
# - In which directory is your code located? → ./
# - Want to override settings? → Yes
#   - Build Command? → npm run build
#   - Output Directory? → client/dist
#   - Development Command? → npm run dev

# 4. Deploy a producción
vercel --prod
```

### Opción B: Desde Dashboard

1. **Abrir Vercel:**
   ```
   https://vercel.com/new
   ```

2. **Importar Repositorio:**
   - Login con GitHub
   - Click en "Import Project"
   - Busca: `fidubitco/politicaagentinaoficial`
   - Click "Import"

3. **Configurar Proyecto:**

   **Framework Preset:** Other

   **Build & Development Settings:**
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

   **Root Directory:** `./` (dejar por defecto)

4. **Variables de Entorno:**
   - Click en "Environment Variables"
   - Agregar:
     - Name: `VITE_API_URL`
     - Value: `https://tu-railway-app.up.railway.app` (tu URL de Railway)
     - Environments: Production, Preview, Development (seleccionar todos)

5. **Deploy:**
   - Click en "Deploy"
   - Espera 2-3 minutos

---

## ✅ PASO 4: Verificación

### 4.1 Test Backend (Railway)

```bash
# Health check
curl https://tu-railway-app.up.railway.app/api/health

# Debería retornar:
# {"status":"healthy","timestamp":"...","uptime":...}

# Test artículos
curl https://tu-railway-app.up.railway.app/api/articles
```

### 4.2 Test Frontend (Vercel)

1. **Abrir en navegador:**
   ```
   https://politicaargentinaoficial.vercel.app
   ```

2. **Verificar en DevTools:**
   - Presiona F12
   - Ve a la pestaña "Network"
   - Recarga la página
   - Busca requests a `/api/articles`
   - Verifica que el dominio sea tu Railway URL

3. **Test Admin Panel:**
   ```
   https://politicaargentinaoficial.vercel.app/admin
   ```

### 4.3 Checklist Final

- [ ] Backend desplegado en Railway ✅
- [ ] Frontend desplegado en Vercel ✅
- [ ] Homepage carga correctamente
- [ ] Economic Ticker animado funcionando
- [ ] GSAP animations activas
- [ ] API requests van a Railway (verificar en Network tab)
- [ ] Admin panel accesible
- [ ] Traducciones funcionan
- [ ] Artículos se visualizan correctamente

---

## 🐛 Troubleshooting

### Problema 1: CORS Error

**Error en consola:**
```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Solución:**
1. Verifica que Railway esté desplegado con los cambios recientes
2. En Railway Dashboard → Deployments → Verifica que sea el último commit
3. Si no, fuerza re-deploy: Settings → "Redeploy"

### Problema 2: 404 en API

**Error:**
```
GET https://politicaargentinaoficial.vercel.app/api/articles → 404
```

**Solución:**
1. Verifica variable de entorno en Vercel: `VITE_API_URL`
2. Verifica que `vercel.json` tenga la URL correcta de Railway
3. Re-deploy Vercel

### Problema 3: Build Error en Railway

**Solución:**
```bash
# Verificar build local
npm run build

# Si falla, arreglar errores y push
git add .
git commit -m "fix: build errors"
git push origin main
```

### Problema 4: Variables de Entorno no se Aplican

**Solución en Railway:**
1. Railway Dashboard → Variables
2. Verifica que todas las variables estén presentes
3. Click en "..." → "Restart"

**Solución en Vercel:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verifica `VITE_API_URL`
3. Deployments → Latest → "Redeploy"

---

## 📊 URLs Finales

Después de completar todos los pasos, tendrás:

### Producción
- **Frontend:** `https://politicaargentinaoficial.vercel.app`
- **Backend API:** `https://tu-railway-app.up.railway.app`
- **Admin Panel:** `https://politicaargentinaoficial.vercel.app/admin`

### Desarrollo Local
- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:5000`
- **Admin:** `http://localhost:5000/admin`

---

## 💰 Costos

- **Vercel:** Gratis (Hobby tier)
- **Railway:** ~$5-10/mes
- **Neon:** Gratis (hasta 0.5GB)
- **Total:** ~$5-10/mes

---

## 📞 Siguiente Paso

Si todo funciona:
1. Configura custom domain (opcional)
2. Agrega Analytics (Vercel Analytics)
3. Configura Error Tracking (Sentry)

Para más detalles, consulta `HYBRID-DEPLOYMENT-GUIDE.md`

---

## ✅ ¡Listo!

Tu portal profesional de noticias políticas está ahora en producción con:
- Frontend ultra-rápido en CDN global (Vercel)
- Backend completo con background jobs (Railway)
- CI/CD automático
- Arquitectura escalable

**¡Felicidades! 🎉**
