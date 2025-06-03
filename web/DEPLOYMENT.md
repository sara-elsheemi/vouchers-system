# Deployment Guide

This guide explains how to deploy the 4Sale Web Design System to npm and other platforms.

## Prerequisites

- Node.js 18+
- npm account with access to @4saletech organization
- GitHub repository access

## Publishing to npm

### 1. Build the Library

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests to ensure everything works
npm test
```

### 2. Version Management

```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features)
npm version minor

# For major releases (breaking changes)
npm version major
```

### 3. Publish to npm

```bash
# Login to npm (if not already logged in)
npm login

# Publish to npm
npm publish --access public
```

### 4. Create GitHub Release

After publishing to npm:

1. Go to [GitHub Releases](https://github.com/4SaleTech/web-design-system/releases)
2. Click "Create a new release"
3. Choose the tag version (e.g., v1.0.0)
4. Add release notes describing changes
5. Attach any relevant files
6. Publish the release

## Storybook Deployment

### Deploy to GitHub Pages

```bash
# Build Storybook
npm run build-storybook

# Deploy to GitHub Pages (if configured)
npm run deploy-storybook
```

### Deploy to Netlify/Vercel

1. Connect your GitHub repository to Netlify/Vercel
2. Set build command: `npm run build-storybook`
3. Set publish directory: `storybook-static`
4. Deploy

## Environment Variables

For production deployments, ensure these environment variables are set:

```bash
# For Chromatic (visual testing)
CHROMATIC_PROJECT_TOKEN=your-chromatic-token

# For npm publishing
NPM_TOKEN=your-npm-token
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build library
        run: npm run build
      
      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Build Storybook
        run: npm run build-storybook
      
      - name: Deploy Storybook
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
```

## Release Checklist

Before each release:

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md` with new features and fixes
- [ ] Run all tests: `npm test`
- [ ] Build library: `npm run build`
- [ ] Test Storybook: `npm run storybook`
- [ ] Update documentation if needed
- [ ] Create git tag: `git tag -a v1.x.x -m "Release message"`
- [ ] Push tag: `git push --tags`
- [ ] Publish to npm: `npm publish`
- [ ] Create GitHub release with release notes

## Troubleshooting

### Build Failures

If the build fails due to TypeScript errors:

```bash
# Check TypeScript errors
npm run type-check

# Fix linting issues
npm run lint:fix
```

### npm Publish Issues

```bash
# Check if package name is available
npm view @4saletech/web-design-system

# Check npm login status
npm whoami

# Check package.json configuration
npm pack --dry-run
```

### Storybook Deployment Issues

```bash
# Clear Storybook cache
npx storybook@latest upgrade

# Rebuild Storybook
rm -rf storybook-static
npm run build-storybook
```

## Post-Release

After successful release:

1. Update internal documentation
2. Notify team members
3. Update dependent projects
4. Monitor for issues and feedback
5. Plan next release cycle

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/4SaleTech/web-design-system/issues)
- Contact the development team
- Review [npm documentation](https://docs.npmjs.com/) 