# Environment Variables for Vercel Deployment

Copy these environment variables to your Vercel project settings:

## Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Google AI (Gemini) Configuration
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

## Stripe Configuration
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## App Configuration
```
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable above with the correct values
4. Make sure to set them for "Production", "Preview", and "Development" environments
5. Click "Save" after adding each variable

## Where to Get These Values

### Firebase
- Go to Firebase Console → Project Settings → General → Your apps
- Copy the config values from your web app

### Google AI (Gemini)
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key

### Stripe
- Go to Stripe Dashboard → Developers → API keys
- Use live keys for production, test keys for development

### Base URL
- This will be your Vercel deployment URL (e.g., `https://your-app-name.vercel.app`)
