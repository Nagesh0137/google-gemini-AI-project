# Deployment Guide - Gemini AI Clone

This guide covers different deployment options for your Gemini AI Clone application.

## 🚀 Quick Start

### Local Development

```bash
# Option 1: Python HTTP Server
python server.py

# Option 2: Node.js HTTP Server
npm install
npm run dev

# Option 3: Simple Python Server
python -m http.server 8000
```

Visit `http://localhost:8000` in your browser.

## 🌐 Deployment Options

### 1. Netlify (Recommended)

**Step 1:** Prepare your files

```bash
# Ensure all files are in the root directory
ls -la
# Should show: index.html, styles.css, script.js, config.js
```

**Step 2:** Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your site will be live instantly!

**Custom Domain (Optional):**

1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings

### 2. Vercel

**Step 1:** Install Vercel CLI

```bash
npm install -g vercel
```

**Step 2:** Deploy

```bash
vercel --prod
```

**Step 3:** Follow the prompts

- Framework: Other
- Build Command: (leave empty)
- Output Directory: (leave empty)

### 3. GitHub Pages

**Step 1:** Create GitHub repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/gemini-ai-clone.git
git push -u origin main
```

**Step 2:** Enable GitHub Pages

1. Go to repository Settings
2. Scroll to Pages section
3. Select "Deploy from a branch"
4. Choose "main" branch
5. Save

Your site will be available at: `https://username.github.io/gemini-ai-clone`

### 4. Firebase Hosting

**Step 1:** Install Firebase CLI

```bash
npm install -g firebase-tools
```

**Step 2:** Initialize Firebase

```bash
firebase init hosting
```

**Step 3:** Configure firebase.json

```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Step 4:** Deploy

```bash
firebase deploy
```

### 5. Amazon S3 + CloudFront

**Step 1:** Create S3 bucket

```bash
aws s3 mb s3://your-gemini-clone-bucket
```

**Step 2:** Upload files

```bash
aws s3 sync . s3://your-gemini-clone-bucket --exclude "*.py" --exclude "node_modules/*"
```

**Step 3:** Configure bucket for static hosting

```bash
aws s3 website s3://your-gemini-clone-bucket --index-document index.html
```

**Step 4:** Set up CloudFront for HTTPS and global distribution

### 6. Digital Ocean App Platform

**Step 1:** Create app.yaml

```yaml
name: gemini-ai-clone
static_sites:
  - name: web
    source_dir: /
    index_document: index.html
    error_document: index.html
```

**Step 2:** Deploy via DO control panel or CLI

## 🔒 Environment Configuration

### Production Settings

**1. API Key Security**

```javascript
// In config.js - Update for production
const CONFIG = {
  // Enable additional security checks
  SECURITY: {
    VALIDATE_ORIGIN: true,
    ALLOWED_ORIGINS: ["https://yourdomain.com"],
    RATE_LIMITING: true,
  },
};
```

**2. Content Security Policy**
Add to your HTML `<head>`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com;"
/>
```

### Environment Variables

For sensitive configuration, consider using environment variables:

**Netlify:**

```bash
# In Netlify dashboard: Site settings > Environment variables
GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta
RATE_LIMIT=60
```

**Vercel:**

```bash
# In Vercel dashboard: Settings > Environment Variables
GEMINI_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta
```

## 🌍 Custom Domain Setup

### 1. DNS Configuration

```
Type: CNAME
Name: www
Value: your-deployment-url.com

Type: A (for root domain)
Name: @
Value: [your-hosting-ip]
```

### 2. SSL Certificate

Most modern hosting platforms (Netlify, Vercel, Firebase) provide automatic SSL certificates.

For custom setups:

```bash
# Using Certbot for Let's Encrypt
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📊 Performance Optimization

### 1. Enable Compression

Most hosting platforms enable gzip automatically. For custom servers:

**Nginx:**

```nginx
gzip on;
gzip_types text/css application/javascript application/json;
```

**Apache:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css application/javascript
</IfModule>
```

### 2. CDN Configuration

```javascript
// Use CDN for static assets
const CDN_BASE = "https://cdn.yourdomain.com";
```

### 3. Caching Headers

```javascript
// In your server configuration
Cache-Control: public, max-age=31536000  // For static assets
Cache-Control: no-cache  // For HTML files
```

## 🔍 Monitoring and Analytics

### 1. Google Analytics

Add to your HTML:

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

### 2. Error Tracking

```javascript
// Add to script.js
window.addEventListener("error", (e) => {
  // Log errors to your preferred service
  console.error("Application error:", e);
});
```

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**

- Ensure your hosting platform supports HTTPS
- Check API endpoint URLs
- Verify allowed origins in API console

**2. API Key Issues**

- Test API key with curl before deployment
- Check API quotas and limits
- Ensure key has proper permissions

**3. Mobile Responsiveness**

- Test on various device sizes
- Check touch interactions
- Verify viewport meta tag

**4. Performance Issues**

- Optimize images and assets
- Enable compression
- Use CDN for static files
- Monitor network requests

### Testing Deployment

```bash
# Test your deployed site
curl -I https://your-deployed-site.com
curl -s https://your-deployed-site.com | grep -i "gemini"
```

## 📱 Progressive Web App (PWA)

To make your app installable, add a manifest.json:

```json
{
  "name": "Gemini AI Clone",
  "short_name": "Gemini Clone",
  "description": "AI-powered chat application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a73e8",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Link it in your HTML:

```html
<link rel="manifest" href="manifest.json" />
```

---

## 🎯 Deployment Checklist

- [ ] Test all functionality locally
- [ ] Configure environment variables
- [ ] Set up custom domain (if needed)
- [ ] Enable HTTPS
- [ ] Add security headers
- [ ] Test on multiple devices
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Document API usage
- [ ] Set up CI/CD (optional)

Choose the deployment method that best fits your needs and technical expertise. Netlify and Vercel are great for beginners, while AWS and Digital Ocean offer more advanced customization options.
