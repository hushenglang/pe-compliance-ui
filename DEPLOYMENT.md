# Production Deployment Configuration

## Backend URL Configuration

This application uses Vite environment variables to configure the backend API URL.

### Environment Variables

The application looks for the following environment variable:
- `VITE_API_BASE_URL`: The base URL for the backend API

### Configuration Options

#### Option 1: Environment Files (Recommended)

Create environment files for different environments:

**For Local Development:**
Create `.env.local` (this file is git-ignored):
```
VITE_API_BASE_URL=http://localhost:8000
```

**For Production:**
Create `.env.production`:
```
VITE_API_BASE_URL=https://your-production-api.com
```

#### Option 2: Environment Variables at Build Time

Set the environment variable when building for production:

```bash
# Linux/macOS
VITE_API_BASE_URL=https://your-production-api.com npm run build:prod

# Windows
set VITE_API_BASE_URL=https://your-production-api.com && npm run build:prod
```

#### Option 3: GitHub Actions Configuration

The GitHub Actions workflow is already configured to use the `VITE_API_BASE_URL` environment variable.

**Method 1: Repository Secrets (Recommended)**
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `VITE_API_BASE_URL`
5. Value: `https://your-production-api.com`
6. Click "Add secret"

**Method 2: Environment Variables in Workflow**
Edit `.github/workflows/deploy.yml` and add the environment variable directly:

```yaml
- name: Build
  env:
    VITE_API_BASE_URL: https://your-production-api.com
  run: npm run build
```

**Method 3: Repository Variables (Public)**
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click on the "Variables" tab
4. Click "New repository variable"
5. Name: `VITE_API_BASE_URL`
6. Value: `https://your-production-api.com`
7. Update the workflow to use `${{ vars.VITE_API_BASE_URL }}` instead of `${{ secrets.VITE_API_BASE_URL }}`

### Build Scripts

- `npm run dev`: Development server (uses `.env.local` or defaults to localhost:8000)
- `npm run build`: Regular build
- `npm run build:prod`: Production build (uses `.env.production`)

### Default Configuration

If no environment variable is set, the application defaults to `http://localhost:8000`.

### Verification

After building, you can verify the configuration by checking the built files in the `dist` folder or by running:
```bash
npm run preview
```

## Deployment Platforms

### GitHub Pages

The repository is configured for automatic GitHub Pages deployment via GitHub Actions.

**Setup Steps:**
1. **Set the Backend URL Secret:**
   - Go to your repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Add a new repository secret named `VITE_API_BASE_URL`
   - Set the value to your production backend URL

2. **Automatic Deployment:**
   - Push to `master` or `main` branch
   - GitHub Actions will automatically build and deploy
   - The site will be available at `https://yourusername.github.io/pe-compliance-ui/`

3. **Manual Deployment (Alternative):**
   ```bash
   # Set the production backend URL
   export VITE_API_BASE_URL=https://your-production-api.com
   
   # Build and deploy
   npm run build
   npm run deploy
   ```

**Current Configuration:**
- Base path: `/pe-compliance-ui/`
- Automatic deployment on push to master/main
- Environment variable support via GitHub Secrets

### Other Platforms
For other platforms, you may need to adjust the `base` configuration in `vite.config.ts` or remove it entirely for root-level deployments. 