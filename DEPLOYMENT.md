# Vercel Deployment Guide for Next.js 15.3.3

This guide covers the complete setup for deploying your Next.js 15.3.3 application to Vercel with automated testing, custom domains, and CI/CD pipeline.

## 📋 Prerequisites

- Node.js 20+ installed locally
- GitHub repository with your Next.js app
- Vercel account (free tier available)
- Domain name (for custom domain setup)

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
npm install
npm install -D wait-on
```

### 2. Vercel CLI Setup

```bash
# Install Vercel CLI globally
npm install -g vercel@latest

# Login to Vercel
vercel login

# Link your project to Vercel (run in project directory)
vercel link
```

## 🔧 Vercel Project Configuration

### 1. Create Vercel Project

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Node.js Version**: 20.x
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install`

### 2. Environment Variables

Add these environment variables in Vercel Dashboard → Project → Settings → Environment Variables:

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 3. Get Project Identifiers

After creating the project, get your project details:

```bash
# This will show your project info
vercel project ls

# Or get from Vercel dashboard → Project → Settings → General
```

## 🔐 GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Required Secrets

```env
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here
```

### How to Get Values

1. **VERCEL_TOKEN**: 
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token with appropriate scopes

2. **VERCEL_ORG_ID**: 
   - Run `vercel project ls` or check Vercel dashboard URL

3. **VERCEL_PROJECT_ID**: 
   - Found in Vercel Dashboard → Project → Settings → General

## 🔄 Automatic Deployment Setup

### Branch Configuration

The deployment is configured for:
- **Production**: `main` branch → Production deployment
- **Preview**: All other branches → Preview deployments
- **Pull Requests**: Automatic preview deployments with comments

### Deployment Triggers

Deployments are triggered by:
- Push to `main` branch (production)
- Push to any other branch (preview)
- Pull request creation/updates (preview)

## 🧪 Testing Pipeline

### Pre-deployment Tests
- TypeScript type checking
- ESLint linting
- Build verification
- Playwright tests (API + E2E)

### Post-deployment Tests
- Smoke tests on deployed URL
- Mobile compatibility tests
- Lighthouse performance audit (production only)

### Test Commands Available

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:api
npm run test:chrome
npm run test:mobile:chrome
npm run test:mobile:safari
```

## 🌐 Custom Domain Configuration

### 1. Add Domain to Vercel

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain name (e.g., `yourdomain.com`)

### 2. Configure DNS Records

Add these DNS records to your domain provider:

#### For Root Domain (yourdomain.com):
```
Type: A
Name: @
Value: 76.76.19.61
```

#### For Subdomain (www.yourdomain.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Alternative (CNAME for root):
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

SSL certificates are automatically provisioned by Vercel (usually takes 1-24 hours).

### 4. Redirect Configuration

To redirect www to non-www (or vice versa):
1. Add both domains to Vercel
2. Set one as primary domain
3. The redirect will be handled automatically

## 🔍 Deployment Verification

### Automated Checks

The CI/CD pipeline includes:
- ✅ Pre-deployment tests pass
- ✅ Build succeeds
- ✅ Deployment completes
- ✅ Post-deployment tests pass
- ✅ Lighthouse performance audit (production)

### Manual Verification Steps

1. **Check Deployment Status**:
   ```bash
   vercel ls
   ```

2. **Test API Endpoints**:
   ```bash
   curl https://yourdomain.com/api/health
   curl https://yourdomain.com/api/tasks
   ```

3. **Performance Check**:
   - Visit https://yourdomain.com
   - Check Core Web Vitals in browser DevTools
   - Review Lighthouse report in GitHub Actions artifacts

4. **Mobile Testing**:
   - Test on various devices/browsers
   - Check responsive design
   - Verify touch interactions

## 📊 Monitoring and Analytics

### Built-in Vercel Analytics

Enable in Vercel Dashboard → Project → Settings → Analytics:
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Page view analytics

### Performance Monitoring

- **Lighthouse CI**: Automated performance audits
- **Bundle Analysis**: Check bundle sizes with `ANALYZE=true npm run build`
- **Runtime Logs**: View in Vercel Dashboard → Functions tab

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check build locally
   npm run build
   
   # Check TypeScript
   npm run type-check
   
   # Check linting
   npm run lint
   ```

2. **Test Failures**:
   ```bash
   # Run tests locally
   npm run test
   
   # Debug specific tests
   npm run test:debug
   ```

3. **Domain Issues**:
   - Verify DNS propagation: `dig yourdomain.com`
   - Check SSL certificate status in Vercel dashboard
   - Wait 24-48 hours for DNS propagation

4. **Environment Variables**:
   - Verify all required secrets are set in GitHub
   - Check environment variables in Vercel dashboard
   - Ensure no sensitive data in public repositories

### Debug Commands

```bash
# Check Vercel project info
vercel project ls

# View deployment logs
vercel logs

# Test local build
vercel build

# Test local deployment
vercel dev
```

## 🔄 Next.js 15 Specific Optimizations

### Enabled Features

- **React Compiler**: Automatic optimization of React components
- **Partial Prerendering (PPR)**: Incremental static regeneration
- **CSS Chunking**: Optimized CSS delivery
- **Turbo Mode**: Faster builds and HMR
- **Optimized Package Imports**: Reduced bundle size

### Performance Features

- **Image Optimization**: AVIF/WebP formats with responsive sizing
- **Bundle Splitting**: Optimized chunk strategy
- **Compression**: Gzip/Brotli compression enabled
- **Caching**: Aggressive caching for static assets

### Security Headers

- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options
- Referrer Policy configuration

## 📝 Best Practices

### Code Quality
- All code must pass TypeScript checks
- ESLint rules enforced
- Prettier formatting required
- Test coverage maintained

### Performance
- Core Web Vitals monitoring
- Bundle size tracking
- Image optimization
- Lazy loading implementation

### Security
- Environment variables for sensitive data
- Security headers configuration
- Regular dependency updates
- HTTPS enforcement

### Deployment
- Feature branch workflow
- Preview deployments for testing
- Automated rollback capability
- Blue-green deployment strategy

## 🆘 Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js 15 Guide**: https://nextjs.org/docs
- **GitHub Actions Help**: https://docs.github.com/en/actions
- **Playwright Documentation**: https://playwright.dev

---

## 🎯 Quick Start Checklist

- [ ] Install dependencies
- [ ] Configure Vercel project
- [ ] Set up GitHub secrets
- [ ] Push to main branch
- [ ] Verify deployment
- [ ] Configure custom domain
- [ ] Test all functionality
- [ ] Monitor performance 