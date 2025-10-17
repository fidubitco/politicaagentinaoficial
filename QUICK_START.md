# POLÍTICA ARGENTINA - Quick Start Guide

## Get Started in 5 Minutes

### 1. Setup Database (2 minutes)

**Option A: Free Cloud Database (Recommended)**
1. Go to https://neon.tech
2. Sign up (free)
3. Create project
4. Copy connection string

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL, then:
createdb politica_argentina
# Connection string: postgresql://localhost:5432/politica_argentina
```

### 2. Configure Environment (1 minute)

```bash
cd "/Users/usuario/POLITICA ARGENTINA/PoliticaArgentina"

# Create environment file
cp .env.example .env

# Edit .env and add your DATABASE_URL
nano .env
```

In `.env`:
```env
DATABASE_URL=postgresql://YOUR_CONNECTION_STRING_HERE
```

### 3. Initialize Database (1 minute)

```bash
npm run db:push
```

This creates all 13 tables automatically.

### 4. Start the Application (1 minute)

```bash
npm run dev
```

### 5. Access the Portal

- **Homepage**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin
- **API Docs**: See SETUP_GUIDE.md

---

## First Steps After Launch

### 1. Create Categories

Visit http://localhost:5000/admin/categories and add:
- Política Nacional
- Economía
- Internacional
- Justicia
- Sociedad

### 2. Add Your First Article

Visit http://localhost:5000/admin/articles/new

### 3. Test Features

- ✅ View article on homepage
- ✅ Add a comment
- ✅ Subscribe to newsletter
- ✅ Share on social media
- ✅ Check trending sidebar
- ✅ Try search functionality

---

## Key URLs

| Feature | URL |
|---------|-----|
| Homepage | http://localhost:5000 |
| Admin Dashboard | http://localhost:5000/admin |
| Articles List | http://localhost:5000/admin/articles |
| Categories | http://localhost:5000/admin/categories |
| Sources | http://localhost:5000/admin/sources |
| Analytics | http://localhost:5000/admin (dashboard) |
| Sitemap | http://localhost:5000/sitemap.xml |
| News Sitemap | http://localhost:5000/news-sitemap.xml |

---

## Troubleshooting

### Can't connect to database?
```bash
# Test connection
psql YOUR_DATABASE_URL -c "SELECT 1;"
```

### Port 5000 in use?
```bash
# Kill process
lsof -ti:5000 | xargs kill -9
```

### Need help?
Read `SETUP_GUIDE.md` for comprehensive documentation.

---

## What's Included

✅ Full news portal with admin panel
✅ Comments system
✅ Trending articles
✅ Newsletter subscriptions
✅ Social sharing
✅ Advanced search
✅ SEO optimization
✅ Analytics dashboard
✅ Responsive design

**No API keys required for basic functionality!**

---

## Next Steps

1. Customize design in `/client/src/index.css`
2. Add your logo
3. Configure production database for deployment
4. Deploy to Vercel (free)

**Your world-class news portal is ready! 🚀**
