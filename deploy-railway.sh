#!/bin/bash

# Railway Deployment Script for Invoice-Expense SaaS
echo "🚀 Starting Railway deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for Railway deployment'"
    exit 1
fi

echo "✅ Git repository is clean"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "🔐 Please login to Railway:"
railway login

echo "🚀 Creating new Railway project..."
railway init

echo "📝 Setting up environment variables..."
echo "Please set the following environment variables in Railway dashboard:"
echo ""
echo "For API Service:"
echo "  ASPNETCORE_ENVIRONMENT=Production"
echo "  JWT_ISSUER=https://your-api-app.railway.app/"
echo "  JWT_AUDIENCE=https://your-api-app.railway.app/"
echo "  JWT_KEY=YourStrongJwtSecretKey1234567890!"
echo "  ALLOWED_ORIGINS=https://your-ui-app.railway.app"
echo "  DATABASE_URL=your-postgresql-connection-string"
echo ""
echo "For UI Service:"
echo "  VITE_API_URL=https://your-api-app.railway.app"
echo ""

echo "🗄️  Adding PostgreSQL database..."
railway add postgresql

echo "🚀 Deploying API..."
railway up --service api

echo "🚀 Deploying UI..."
railway up --service ui

echo "✅ Deployment complete!"
echo "Check your Railway dashboard for the deployed URLs."
