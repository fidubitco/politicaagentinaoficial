# 🚀 POLÍTICA ARGENTINA - Docker Deployment Guide

## World-Class News Portal - Complete Production Setup

### Features

✅ **100% LOCAL Article Generation** - No external AI APIs required
✅ **600+ Professional Articles** - Multi-category news coverage
✅ **50-Language Translation System** - Global reach with RTL support
✅ **Contextual Image Integration** - Pexels API with intelligent fallbacks
✅ **Multi-Source Scraping** - Clarín, La Nación, Infobae integration
✅ **Advanced SEO Optimization** - Schema.org, Open Graph, sitemaps
✅ **High-Performance Caching** - Redis + Nginx optimizations
✅ **Professional Admin Panel** - Full content management
✅ **Real-Time Analytics** - View tracking and trending topics

---

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available
- Port 80 and 443 available

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/politica-argentina.git
cd politica-argentina
```

### 2. Configure Environment Variables

Create `.env` file:

```bash
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_secure_db_password_here
DATABASE_URL=postgresql://postgres:your_secure_db_password_here@postgres:5432/politica_argentina

# Redis Configuration
REDIS_PASSWORD=your_secure_redis_password_here
REDIS_URL=redis://:your_secure_redis_password_here@redis:6379

# Application Configuration
NODE_ENV=production
PORT=5000
SITE_URL=https://politica-argentina.com

# Optional: External APIs (not required for core functionality)
PEXELS_API_KEY=your_pexels_api_key  # For contextual images
ELEVENLABS_API_KEY=your_elevenlabs_key  # For audio narration (optional)
```

### 3. Build and Start Services

```bash
# Build all containers
docker-compose build

# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Initialize Database

```bash
# Run database migrations
docker-compose exec app npm run db:push

# Populate with 600+ articles (LOCAL generator - no API required!)
curl -X POST http://localhost:5000/api/admin/populate-database

# Or access via browser
# http://localhost:5000/admin
```

### 5. Access the Application

- **Main Site:** http://localhost (http://localhost:80)
- **Admin Panel:** http://localhost/admin
- **API Docs:** http://localhost/api
- **Health Check:** http://localhost:5000/api/articles

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Nginx (80)    │  ← Reverse Proxy + Static Files + SSL
└────────┬────────┘
         │
┌────────┴────────┐
│  App (5000)     │  ← Node.js + Express + React
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───┴───┐ ┌──┴───┐
│Postgres│ │Redis │  ← Data Layer
└────────┘ └──────┘
```

---

## 🔥 LOCAL Article Generation (No APIs Required!)

This system uses an **advanced local template-based generator** that creates professional news articles without requiring external AI APIs:

### How It Works

1. **180+ Dynamic Templates** across 12 categories
2. **Smart Pattern Matching** for professional tone
3. **Contextual Content Generation** with political actors, institutions, indicators
4. **Multi-paragraph Structure** (intro, development, analysis, conclusion)
5. **Professional Metadata** (authors, credibility scores, view counts)

### Generate Articles

```bash
# Generate 600+ articles automatically
curl -X POST http://localhost:5000/api/admin/populate-database

# Generate for specific category
curl -X POST http://localhost:5000/api/admin/populate-category \
  -H "Content-Type: application/json" \
  -d '{"categorySlug": "economia", "count": 50}'
```

---

## 🌍 Multi-Language Support

### 50 Supported Languages

- **Americas:** Spanish, English, Portuguese
- **Europe:** French, German, Italian, Russian, Polish, Dutch, Swedish, etc.
- **Asia:** Chinese, Japanese, Korean, Hindi, Thai, Vietnamese, etc.
- **Middle East:** Arabic, Persian, Hebrew, Turkish (RTL support)
- **Africa:** Swahili, Zulu, Xhosa

### Translate Content

```bash
# Translate an article
curl -X POST http://localhost:5000/api/translate/article \
  -H "Content-Type: application/json" \
  -d '{"articleId": "article-id-here", "targetLocale": "en"}'
```

---

## 📊 Admin Panel

Access the full-featured admin panel at `http://localhost/admin`:

- **Content Management:** Create, edit, delete articles
- **Category Management:** Organize content
- **Analytics Dashboard:** Real-time statistics
- **SEO Tools:** Meta tags, sitemaps, schema.org
- **Image Enrichment:** Automatic image assignment
- **Bulk Operations:** Generate, translate, enrich
- **User Management:** Roles and permissions

---

## 🔧 Docker Commands

### Service Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart app

# View logs
docker-compose logs -f app

# Access container shell
docker-compose exec app sh
```

### Database Management

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres politica_argentina > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U postgres politica_argentina

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres politica_argentina
```

### Performance Monitoring

```bash
# View resource usage
docker stats

# Inspect container
docker inspect politica-argentina-app
```

---

## 🌐 Production Deployment

### SSL/TLS Configuration

1. **Obtain SSL Certificate** (Let's Encrypt recommended):

```bash
# Install Certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d politica-argentina.com -d www.politica-argentina.com

# Copy certificates
sudo cp /etc/letsencrypt/live/politica-argentina.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/politica-argentina.com/privkey.pem ./ssl/
```

2. **Update Environment:**

```bash
SITE_URL=https://politica-argentina.com
```

3. **Restart Services:**

```bash
docker-compose restart nginx
```

### Auto-Renewal

Add to crontab:

```bash
0 0 * * * certbot renew --quiet && docker-compose restart nginx
```

---

## 📈 Performance Optimization

### Redis Caching

The system automatically caches:
- Article listings
- Category data
- Translation results
- API responses

### Nginx Optimizations

- **Gzip Compression:** All text assets
- **Browser Caching:** 1 year for static files
- **HTTP/2:** Enabled by default
- **Rate Limiting:** API protection
- **Connection Pooling:** Upstream optimization

### Database Indexing

```sql
-- Already applied in schema
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_published ON articles(published_at);
CREATE INDEX idx_articles_status ON articles(status);
```

---

## 🛡️ Security Best Practices

1. **Change Default Passwords** in `.env`
2. **Enable Firewall** (UFW recommended)
3. **Regular Updates:**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```
4. **Backup Schedule:** Daily database backups
5. **Monitor Logs:** Check for suspicious activity

---

## 🔍 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs app

# Verify environment variables
docker-compose config

# Restart from scratch
docker-compose down -v
docker-compose up -d
```

### Database Connection Issues

```bash
# Check postgres health
docker-compose ps postgres

# Test connection
docker-compose exec app node -e "console.log(process.env.DATABASE_URL)"
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Increase limits in docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 4G
```

---

## 📚 API Documentation

### Endpoints

- `GET /api/articles` - List all articles
- `GET /api/articles/:slug` - Get article by slug
- `POST /api/articles` - Create article (admin)
- `GET /api/categories` - List categories
- `POST /api/translate/article` - Translate article
- `GET /api/sitemap.xml` - SEO sitemap
- `POST /api/admin/populate-database` - Generate 600+ articles

### Example Requests

```bash
# Get latest articles
curl http://localhost:5000/api/articles

# Get specific article
curl http://localhost:5000/api/articles/presidente-anuncia-reforma

# Get categories
curl http://localhost:5000/api/categories
```

---

## 🎯 Roadmap

- [x] Local article generation (no APIs)
- [x] 50-language translation
- [x] Docker containerization
- [x] Multi-source scraping
- [x] Contextual image integration
- [x] Advanced SEO optimization
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] GraphQL API
- [ ] Kubernetes deployment
- [ ] AI-powered recommendations

---

## 👥 Contributors

Built with ❤️ by the POLÍTICA ARGENTINA team

---

## 📄 License

Proprietary - All rights reserved © 2025 POLÍTICA ARGENTINA

---

## 🆘 Support

- **Email:** support@politica-argentina.com
- **Docs:** https://docs.politica-argentina.com
- **Issues:** https://github.com/politica-argentina/issues

---

## 🎉 Success!

Your world-class news portal is now running!

Visit: **http://localhost**

Admin: **http://localhost/admin**

**Built with:**
- Node.js 20
- React 18
- PostgreSQL 16
- Redis 7
- Nginx
- Docker 🐳
