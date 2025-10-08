# Railway Deployment Guide for Invoice-Expense SaaS

This guide will help you deploy your Invoice-Expense SaaS application on Railway's free tier.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Railway CLI installed (optional but recommended)

## Project Structure

Your project has been configured with:
- **API**: .NET 6 Web API with SQL Server
- **UI**: React + Vite frontend
- **Database**: SQL Server (will be provided by Railway)

## Deployment Steps

### Step 1: Prepare Your Repository

1. **Commit all changes** to your Git repository:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

### Step 2: Deploy the API (Backend)

1. **Go to Railway Dashboard**:
   - Visit [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Select your repository** and choose the main branch

3. **Configure the API service**:
   - Railway will detect the `railway.json` in the root
   - The API will be built using `Dockerfile.api` in the root directory

4. **Add a Database**:
   - In your project dashboard, click "New"
   - Select "Database" → "Add PostgreSQL" (Railway's free tier database)
   - Note the connection string provided

5. **Set Environment Variables** for the API:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   JWT_ISSUER=https://your-api-app.railway.app/
   JWT_AUDIENCE=https://your-api-app.railway.app/
   JWT_KEY=YourStrongJwtSecretKey1234567890!
   JWT_TOKEN_VALIDITY_MIN=60
   ALLOWED_ORIGINS=https://your-ui-app.railway.app
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

6. **Update Connection String**:
   - Replace the SQL Server connection with PostgreSQL
   - Update `appsettings.Production.json`:
   ```json
   "ConnectionStrings": {
     "dbcs": "Host=${DATABASE_URL};Database=PersonalDB;Username=postgres;Password=your-password;"
   }
   ```

### Step 3: Deploy the UI (Frontend)

1. **Create a new service** for the UI:
   - In your Railway project, click "New"
   - Select "Deploy from GitHub repo"
   - Choose the same repository
   - Set the **Root Directory** to `ui/ui-main`

2. **Configure the UI service**:
   - Railway will use the `railway.json` in the `ui/` directory
   - The UI will be built using `Dockerfile.ui` in the root directory

3. **Set Environment Variables** for the UI:
   ```
   VITE_API_URL=https://your-api-app.railway.app
   ```

### Step 4: Update CORS Configuration

1. **Update the API's CORS settings**:
   - In your API service environment variables, set:
   ```
   ALLOWED_ORIGINS=https://your-ui-app.railway.app
   ```

2. **Update JWT settings**:
   - Set the JWT issuer and audience to your API URL:
   ```
   JWT_ISSUER=https://your-api-app.railway.app/
   JWT_AUDIENCE=https://your-api-app.railway.app/
   ```

### Step 5: Database Migration

1. **Run Entity Framework migrations**:
   - You may need to run migrations manually or add them to the startup process
   - The application will create the database schema on first run

### Step 6: Test Your Deployment

1. **Access your applications**:
   - API: `https://your-api-app.railway.app`
   - UI: `https://your-ui-app.railway.app`

2. **Test the endpoints**:
   - Visit `https://your-api-app.railway.app/swagger` for API documentation
   - Test user registration and login

## Important Notes

### Free Tier Limitations

- **512MB RAM** per service
- **1GB storage** for database
- **Sleep after 5 minutes** of inactivity (wakes up on request)
- **Custom domains** not available on free tier

### Database Considerations

- Railway provides **PostgreSQL** on the free tier
- You'll need to update your Entity Framework models to work with PostgreSQL
- Consider using **Npgsql** instead of SQL Server provider

### Environment Variables

Make sure to set these environment variables in Railway:

**API Service:**
- `ASPNETCORE_ENVIRONMENT=Production`
- `JWT_ISSUER=https://your-api-app.railway.app/`
- `JWT_AUDIENCE=https://your-api-app.railway.app/`
- `JWT_KEY=YourStrongJwtSecretKey1234567890!`
- `ALLOWED_ORIGINS=https://your-ui-app.railway.app`
- `DATABASE_URL=postgresql://user:password@host:port/database` (Railway will provide this automatically)

**UI Service:**
- `VITE_API_URL=https://your-api-app.railway.app`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `ALLOWED_ORIGINS` includes your UI URL
2. **Database Connection**: Verify the `DATABASE_URL` is correct
3. **Build Failures**: Check the build logs in Railway dashboard
4. **JWT Issues**: Ensure JWT issuer/audience match your API URL

### Logs

- View logs in the Railway dashboard for each service
- Check both build logs and runtime logs

## Next Steps

1. **Custom Domain**: Upgrade to paid plan for custom domains
2. **Monitoring**: Set up monitoring and alerts
3. **CI/CD**: Configure automatic deployments from Git
4. **Scaling**: Upgrade plan for more resources

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Support: [railway.app/support](https://railway.app/support)
