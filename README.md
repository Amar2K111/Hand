# Hand - AI Hand Modeling Agency App

A viral web app that provides brutally honest AI ratings and savage critiques for hand photos. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Brutal Hand Critiques**: Get honest AI ratings with scores out of 100
- **Savage Roasts**: Brutally honest feedback that's shareable
- **Credit System**: Pay once, get 50 critiques
- **Score Tracking**: Track your best scores and compete with yourself
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + localStorage
- **Icons**: Emoji-based icons for viral appeal

## 📱 Pages & Flow

1. **Homepage** - Viral landing page with examples
2. **Auth Pages** - Sign in/Sign up (placeholder)
3. **Dashboard** - Upload photos and view credits
4. **Offer Page** - Purchase credits ($20 for 50 critiques)
5. **Critique Page** - View detailed hand analysis

## 🎨 Design Philosophy

- **Rage-bait aesthetic**: Bold, neon colors (red for fails, green for good, gold for elite)
- **Viral appeal**: Funny, brutal, and addictive
- **Simple UI**: Dramatic but easy to use
- **Mobile-first**: Optimized for TikTok and social sharing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hand
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/app
  /auth
    /signin/page.tsx
    /signup/page.tsx
  /dashboard/page.tsx
  /offer/page.tsx
  /critique/page.tsx
  /page.tsx (homepage)
  /layout.tsx
  /globals.css

/components
  /ui
    Button.tsx
    Input.tsx
    Card.tsx
    Modal.tsx
    ScoreBar.tsx
    CritiqueCard.tsx
    CreditCounter.tsx
  /layout
    Header.tsx
    Footer.tsx
    Navbar.tsx
  /shared
    ExampleGallery.tsx
    FeatureList.tsx
    OfferBanner.tsx

/hooks
  useHandCritique.ts
  useUploads.ts
  useUserCritiques.ts

/lib
  dummyCritiques.ts
  constants.ts
  utils.ts

/styles
  globals.css
  theme.css
```

## 🎯 Key Components

- **ScoreBar**: Animated score display with color coding
- **CritiqueCard**: Complete critique display (score, roast, tips, verdict)
- **CreditCounter**: Visual credit management
- **OfferBanner**: Conversion-focused credit purchase prompt

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to modify the neon color scheme:
- `neon-red`: #ff0066
- `neon-green`: #00ff88  
- `neon-gold`: #ffd700
- `neon-blue`: #00d4ff

### Critiques
Modify `lib/dummyCritiques.ts` to add/edit critique examples.

### Pricing
Update `lib/constants.ts` to change credit package pricing.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
The app is optimized for Vercel deployment. Simply connect your repository and deploy.

## 📊 Business Model

- **One-time payment**: $20 for 50 critiques
- **Viral mechanics**: Shareable results drive organic growth
- **Addictive loop**: Users want to improve their scores
- **Social proof**: Examples showcase the brutal honesty

## 🎭 Viral Features

- **Brutal honesty**: No sugarcoating, just truth
- **Score competition**: Users compete with themselves
- **Shareable results**: Perfect for social media
- **Funny roasts**: Entertainment value drives engagement
- **Hand modeling angle**: Unique niche with broad appeal

## 🔮 Future Enhancements

- Real AI integration for critiques
- Social sharing features
- Leaderboards and competitions
- Premium subscription tiers
- Mobile app development

## 📄 License

This project is for demonstration purposes. Feel free to use as a starting point for your own viral web app.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ and brutal honesty for the hand modeling community.














