# Frontend Deployment Guide

Deploy the Stock Forum React frontend to Netlify.

## Prerequisites

- Netlify account (sign up at https://netlify.com)
- GitHub repository with your code
- Backend API deployed on Vercel

## Deployment Steps

### 1. Connect Repository to Netlify

1. **Log in to Netlify Dashboard**
2. **Click "Add new site"** → "Import an existing project"
3. **Connect to Git provider** (GitHub, GitLab, or Bitbucket)
4. **Select your repository**: `sstockforum`
5. **Configure build settings**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
6. **Click "Deploy site"**

### 2. Configure Environment Variables

After the first deployment:

1. **Go to Site settings** → **Environment variables**
2. **Add variable**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-vercel-project.vercel.app`
   - **Scopes**: Production, Deploy Previews, Branch deploys
3. **Click "Save"**

### 3. Redeploy

1. **Go to Deploys** tab
2. **Click "Trigger deploy"** → "Deploy site"
3. **Wait for build to complete**

## Custom Domain (Optional)

### Add Domain

1. **Go to Site settings** → **Domain management**
2. **Click "Add custom domain"**
3. **Enter your domain**: `stockforum.io`
4. **Follow DNS configuration instructions**

### Update Backend CORS

After adding a custom domain, update your backend:

1. **Edit** `server/api/*/[...path].js` files
2. **Add your domain** to the CORS origins array:
   ```javascript
   origin: [
     "https://stock-forum.netlify.app",
     "https://stockforum.io", // Add your domain
     "http://localhost:3000",
   ];
   ```
3. **Commit and push** - Vercel auto-deploys

## Continuous Deployment

Netlify automatically deploys when you push to GitHub:

1. **Push changes** to your main branch
2. **Netlify detects** the push
3. **Builds and deploys** automatically
4. **Check deploy logs** in Netlify dashboard

### Deploy Previews

Pull requests get preview deployments:

1. **Create a pull request** on GitHub
2. **Netlify builds** a preview
3. **Preview URL** appears in PR comments
4. **Test before merging**

## Build Configuration

Your `client/package.json` already has the correct build script:

```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

This creates an optimized production build in `client/build/`.

## Redirects for SPA

The `client/netlify.toml` file handles React Router:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures all routes work correctly (e.g., `/stocks/AAPL`).

## Monitoring Deployment

### Check Build Logs

1. **Go to Deploys** tab
2. **Click on a deploy**
3. **View "Deploy log"** for build output
4. **Check for errors** if deployment fails

### Common Build Errors

**Error**: `Module not found`

- Fix: Check all imports in your code
- Run `npm run build` locally first

**Error**: Environment variable undefined

- Fix: Add `REACT_APP_API_URL` in Netlify settings
- Redeploy after adding

**Error**: Build exceeds time limit

- Fix: Usually resolves on retry
- Check for infinite loops in build process

## Testing Deployment

After deployment:

1. **Visit your Netlify URL**
2. **Open browser DevTools** (F12)
3. **Check Network tab** for API calls to Vercel
4. **Test key features**:
   - Registration/login
   - Viewing stocks
   - Creating posts
   - Image uploads

## Performance Optimization

Netlify automatically provides:

✅ Global CDN
✅ Automatic HTTPS
✅ Asset compression
✅ Image optimization
✅ HTTP/2 support

## Rollback

If a deployment breaks something:

1. **Go to Deploys** tab
2. **Find last working deployment**
3. **Click "Publish deploy"**
4. **Instantly reverts** to that version

## Environment Management

### Production

Set in Netlify Dashboard → Environment variables

### Preview Deployments

Use same environment variables or set different ones for testing

### Local Development

Use `client/.env` file (see [environment.md](./environment.md))

## Troubleshooting

### Site shows blank page

**Check**:

1. Build completed successfully
2. `REACT_APP_API_URL` is set
3. Browser console for errors
4. Publish directory is set to `client/build`

### API calls failing

**Check**:

1. `REACT_APP_API_URL` points to correct Vercel URL
2. Backend CORS includes your Netlify domain
3. Backend is actually running on Vercel
4. Network tab in browser shows request details

### Builds timing out

**Solutions**:

1. Retry the deployment
2. Check for large dependencies
3. Contact Netlify support if persists

## Cost

Netlify free tier includes:

- 100GB bandwidth/month
- Unlimited personal sites
- Deploy previews
- HTTPS
- CDN

This is sufficient for most applications.

## Production Checklist

Before going live:

- [ ] `REACT_APP_API_URL` points to production API
- [ ] All features tested on staging URL
- [ ] Custom domain configured (if desired)
- [ ] Backend CORS includes frontend domain
- [ ] Analytics/monitoring set up (optional)
- [ ] Error tracking configured (optional)

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Deploy frontend to Netlify
3. ✅ Configure environment variables
4. ⬜ Set up custom domain
5. ⬜ Configure monitoring
6. ⬜ Set up error tracking (e.g., Sentry)

## Support

- Netlify Docs: https://docs.netlify.com/
- Netlify Support: https://www.netlify.com/support/
- Build Issues: Check deploy logs in dashboard
