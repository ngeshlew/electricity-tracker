# Railway Backend Setup

## Environment Variables to Set in Railway

Go to your Railway project → Settings → Variables and add these:

### Required Variables:
1. **PORT** = `8080` (Railway will set this automatically, but good to have)
2. **CLIENT_URL** = `https://your-netlify-site.netlify.app` (your Netlify frontend URL)
3. **NODE_ENV** = `production`

### Database Variables:
4. **DATABASE_URL** = (Railway should provide this automatically for PostgreSQL)

## Steps to Fix:

1. **Go to Railway Dashboard**
2. **Click on your service** (electricity-tracker)
3. **Go to "Variables" tab**
4. **Add the environment variables above**
5. **Redeploy the service**

## Test the Backend:

After setting variables and redeploying, test:
- `https://electricity-tracker-production.up.railway.app/health`
- `https://electricity-tracker-production.up.railway.app/api/meter-readings`

## If Still Failing:

Check the Railway logs:
1. Go to your service
2. Click "Logs" tab
3. Look for error messages
4. Share the error logs with me
