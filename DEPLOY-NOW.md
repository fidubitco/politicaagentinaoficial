# 🚀 DEPLOY A VERCEL AHORA

## Ejecuta estos comandos en orden:

### 1. Deploy a Vercel (Preview primero)

```bash
cd "/Users/usuario/POLITICA ARGENTINA/PoliticaArgentina"
vercel
```

**Responde a las preguntas:**
- Set up and deploy? → `Y`
- Which scope? → Selecciona `theweb3brothers-2290`
- Link to existing project? → `N` (o `Y` si existe politicaargentinaoficial)
- Project name? → `politicaargentinaoficial` (o presiona Enter)
- In which directory is your code located? → `./` (presiona Enter)
- Want to modify settings? → `Y`
  - Build Command? → `npm run build`
  - Output Directory? → `client/dist`
  - Development Command? → `npm run dev` (presiona Enter)

---

### 2. Deploy a Producción

Una vez que el preview funcione:

```bash
vercel --prod
```

---

## URLs Resultantes

- **Preview:** https://politicaargentinaoficial-[hash].vercel.app
- **Producción:** https://politicaargentinaoficial.vercel.app

---

## ⚠️ IMPORTANTE: Después del Deploy

Las API calls fallarán porque no tienes Railway configurado aún. Verás errores como:

```
Failed to fetch https://YOUR_RAILWAY_APP_URL/api/articles
```

**Esto es normal!** El frontend funcionará perfectamente (diseño, animaciones, etc.), pero necesitarás configurar Railway para que las APIs funcionen.

---

## 📋 Próximo Paso: Railway

Sigue `QUICK-START.md` Paso 1 para configurar Railway.
