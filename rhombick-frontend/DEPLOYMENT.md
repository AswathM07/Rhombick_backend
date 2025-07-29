# Deployment Guide - Rhombick Frontend

This guide provides step-by-step instructions for deploying the Rhombick Frontend application to Render.

## 📋 Prerequisites

- GitHub account with the repository
- Render account (free tier available)
- Node.js 18+ locally for testing

## 🚀 Render Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Verify build works locally**:
   ```bash
   npm install
   npm run build
   npm run preview
   ```

### Step 2: Create Render Service

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** and select **"Static Site"**
3. **Connect your GitHub repository**:
   - Select your GitHub account
   - Choose the `rhombick-frontend` repository
   - Select the `main` branch

### Step 3: Configure Build Settings

Use these exact settings in Render:

| Setting | Value |
|---------|-------|
| **Name** | `rhombick-frontend` |
| **Branch** | `main` |
| **Root Directory** | (leave empty) |
| **Build Command** | `npm ci && npm run build` |
| **Publish Directory** | `dist` |

### Step 4: Environment Variables (Optional)

If you need to configure different API endpoints:

1. Go to **Environment** tab in your Render service
2. Add variables if needed:
   - `NODE_ENV`: `production`

### Step 5: Deploy

1. **Click "Create Static Site"**
2. **Wait for deployment** (usually 2-5 minutes)
3. **Your app will be available** at: `https://rhombick-frontend.onrender.com`

## 🔧 Configuration Files

The following files are already configured for Render deployment:

### `render.yaml`
```yaml
services:
  - type: web
    name: rhombick-frontend
    env: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### `public/_redirects`
```
/*    /index.html   200
```

### `package.json` Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --host 0.0.0.0 --port $PORT"
  }
}
```

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. **Go to Settings** in your Render service
2. **Add Custom Domain** section
3. **Enter your domain** (e.g., `app.yourdomain.com`)
4. **Configure DNS** with your domain provider:
   - Add CNAME record pointing to your Render URL

## 🔄 Automatic Deployments

Render automatically deploys when you push to the main branch:

1. **Make changes** to your code
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. **Render automatically rebuilds** and deploys

## 🐛 Troubleshooting

### Build Fails

**Check build logs** in Render dashboard:

1. Go to your service
2. Click on **"Logs"** tab
3. Look for error messages

**Common issues**:
- **Node version**: Ensure `engines` in `package.json` specifies Node 18+
- **Dependencies**: Run `npm ci` locally to test
- **Build command**: Verify `npm run build` works locally

### App Shows Blank Page

**Check these items**:
1. **Build directory**: Ensure `dist` folder is created
2. **Routing**: SPA routing should work with `_redirects` file
3. **API calls**: Check if API endpoints are accessible

### API Connection Issues

**Update API base URL** in `src/services/api.js`:
```javascript
const API_BASE_URL = 'https://rhombick-bend.onrender.com/api';
```

## 📊 Performance Optimization

### Build Optimization

The app is configured with:
- **Code splitting** for vendor libraries
- **Asset optimization** with Vite
- **Gzip compression** by Render

### Monitoring

Monitor your app:
1. **Render Dashboard**: View deployment status and logs
2. **Browser DevTools**: Check for console errors
3. **Network Tab**: Monitor API response times

## 🔒 Security Considerations

### Environment Variables

For sensitive data:
1. **Never commit** API keys or secrets
2. **Use Render environment variables** for configuration
3. **API calls** should use HTTPS endpoints

### CORS Configuration

Ensure your backend API allows requests from your frontend domain:
```javascript
// Backend CORS configuration
app.use(cors({
  origin: ['https://rhombick-frontend.onrender.com']
}));
```

## 🎯 Production Checklist

Before deploying to production:

- [ ] **Test all features** locally
- [ ] **Verify API connections** work
- [ ] **Check responsive design** on different devices
- [ ] **Test form validations** and error handling
- [ ] **Verify navigation** and routing
- [ ] **Check print functionality** for invoices
- [ ] **Test search and filtering** features
- [ ] **Validate data visualization** charts

## 📈 Scaling Considerations

### CDN and Performance

Render provides:
- **Global CDN** for static assets
- **Automatic HTTPS** with SSL certificates
- **HTTP/2** support

### Database Considerations

For production use:
- **API rate limiting** on backend
- **Data backup** strategies
- **Error monitoring** and logging

## 🆘 Support

### Render Support
- **Documentation**: https://render.com/docs
- **Community**: Render Community Forum
- **Support**: Contact Render support for paid plans

### Application Support
- **GitHub Issues**: Create issues in the repository
- **Logs**: Check Render deployment logs
- **Local Testing**: Always test locally first

## 📚 Additional Resources

- [Render Static Sites Documentation](https://render.com/docs/static-sites)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deploying)

---

**Happy Deploying! 🚀**