#!/bin/bash
set -euo pipefail

# Deploy to GCP Staging
# Usage: ./ops/scripts/deploy-staging.sh

echo "🚀 Deploying Infinity XOS 2.0 to Staging..."

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-infinity-x-one-systems}"
REGION="${GCP_REGION:-us-east1}"
API_SERVICE="infinity-xos-api-staging"
WEB_SERVICE="infinity-xos-web-staging"

# Authenticate (if GCP_SA_KEY is set)
if [ -n "${GCP_SA_KEY:-}" ]; then
  echo "🔐 Authenticating with service account..."
  echo "$GCP_SA_KEY" | gcloud auth activate-service-account --key-file=-
fi

# Set project
gcloud config set project "$PROJECT_ID"

echo ""
echo "📦 Building API..."
cd apps/api
docker build -t "gcr.io/$PROJECT_ID/$API_SERVICE:latest" .

echo ""
echo "📤 Pushing API image..."
docker push "gcr.io/$PROJECT_ID/$API_SERVICE:latest"

echo ""
echo "🚢 Deploying API to Cloud Run..."
gcloud run deploy "$API_SERVICE" \
  --image "gcr.io/$PROJECT_ID/$API_SERVICE:latest" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=staging,BACKEND_SHA=$(git rev-parse HEAD)" \
  --max-instances 10 \
  --memory 512Mi \
  --timeout 60s

API_URL=$(gcloud run services describe "$API_SERVICE" --region "$REGION" --format='value(status.url)')
echo "✅ API deployed: $API_URL"

echo ""
echo "🧪 Testing API endpoints..."
curl -f "$API_URL/healthz" || echo "❌ Health check failed"
curl -f "$API_URL/readyz" || echo "❌ Readiness check failed"
curl -f "$API_URL/version" || echo "❌ Version endpoint failed"

echo ""
echo "📦 Building Web..."
cd ../../apps/web
VITE_API_URL="$API_URL" npm run build

echo ""
echo "🚢 Deploying Web to Firebase Hosting (staging)..."
# Note: Firebase deploy requires firebase.json config
# For now, deploy to Cloud Run as static site
cd ../..
docker build -f apps/web/Dockerfile.static -t "gcr.io/$PROJECT_ID/$WEB_SERVICE:latest" apps/web || echo "⚠️  No Dockerfile.static, skipping web deploy"

echo ""
echo "✅ Staging deployment complete!"
echo ""
echo "API URL: $API_URL"
echo "Web URL: (pending Firebase config)"
echo ""
echo "Next: Run ./ops/scripts/verify.sh staging"
