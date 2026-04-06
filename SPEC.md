# Crypto Pulse - Cryptocurrency News Website

## Concept & Vision

Crypto Pulse is a sleek, real-time cryptocurrency news aggregator that feels like a Bloomberg terminal meets cyberpunk aesthetics. The site exudes urgency and sophistication—dark backgrounds punctuated by electric cyan and amber accents, live price tickers that pulse with market activity, and news cards that slide in with purpose. It's the go-to dashboard for crypto enthusiasts who want instant market pulse without the noise.

## Design Language

### Aesthetic Direction
Dark mode terminal aesthetic with neon accents. Think Bloomberg meets Blade Runner—data-dense but visually striking.

### Color Palette
- **Primary Background**: `#0a0e17` (deep space black)
- **Secondary Background**: `#111827` (card surfaces)
- **Tertiary Background**: `#1f2937` (elevated elements)
- **Primary Accent**: `#00d4aa` (electric cyan - positive/gains)
- **Secondary Accent**: `#f59e0b` (amber - warnings/highlights)
- **Negative Accent**: `#ef4444` (red - losses)
- **Text Primary**: `#f3f4f6`
- **Text Secondary**: `#9ca3af`
- **Text Muted**: `#6b7280`
- **Border**: `#374151`

### Typography
- **Headings**: `Space Grotesk` - geometric, techy, modern
- **Body**: `IBM Plex Sans` - clean, readable, professional
- **Monospace (prices)**: `JetBrains Mono` - crisp numbers

### Spatial System
- Base unit: 4px
- Content max-width: 1400px
- Card padding: 24px
- Grid gap: 24px
- Section spacing: 64px

### Motion Philosophy
- Entrance: Cards fade-slide up (300ms ease-out, staggered 50ms)
- Hover: Scale 1.02 with glow effect (200ms)
- Price changes: Flash animation (green/red pulse 500ms)
- Ticker: Smooth horizontal scroll
- Loading: Skeleton pulse animation

### Visual Assets
- Icons: Lucide Icons (consistent stroke weight)
- Crypto logos: CoinGecko CDN or fallback to first letter avatar
- Decorative: Subtle grid pattern overlay, gradient orbs

## Layout & Structure

### Header (Fixed)
- Logo "CRYPTO PULSE" with subtle glow
- Navigation: Home, Trending, New Coins, Watchlist
- Live clock with market status indicator
- Search bar with autocomplete

### Price Ticker (Below Header)
- Horizontally scrolling marquee of top 20 coins
- Symbol, price, 24h change % with color coding
- Continuous smooth scroll animation
- Pause on hover

### Hero Section
- Featured article with large image
- Gradient overlay with title and excerpt
- "LIVE" badge with pulse animation

### News Grid
- 3-column masonry-style layout
- Cards vary in size (featured larger)
- Infinite scroll or "Load More" button
- Filter chips: All, DeFi, NFT, Layer 1, Meme, Stablecoin

### Sidebar (Desktop)
- Trending coins list
- Market cap chart mini-widget
- Recent price alerts

### Footer
- Quick links, disclaimer, social icons
- Last updated timestamp
- API attribution

## Features & Interactions

### Core Features

**1. Live Price Ticker**
- Fetches top 20 cryptocurrencies via CoinGecko API
- Updates every 60 seconds
- Displays: symbol, price (USD), 24h change %
- Color-coded: green for positive, red for negative
- Click coin to see more details

**2. News Aggregation**
- Fetches crypto news from multiple free sources
- Displays: headline, source, time ago, thumbnail
- Category tagging (DeFi, NFT, etc.)
- Share button (copy link)

**3. New Cryptocurrencies Section**
- Shows recently added coins (last 7 days)
- Displays: name, symbol, age, initial price, current price, % change
- "New" badge for coins < 30 days old

**4. Price Updates**
- Live price cards for watched coins
- Sparkline mini-charts (7-day trend)
- Click to expand detailed view

**5. Search & Filter**
- Real-time search across coins and news
- Category filter chips
- Sort by: Latest, Trending, Most Volatile

### Interactions

- **Card Hover**: Lift with shadow, border glow
- **Price Update**: Number morphs with color flash
- **Filter Click**: Active state with smooth transition
- **Load More**: Button transforms to spinner, then shows count
- **Error State**: Toast notification with retry option
- **Empty State**: Illustrated message with suggestions

### Error Handling
- API failure: Show cached data with "offline" badge
- Network error: Retry button with exponential backoff
- Rate limit: Queue requests, show loading skeleton

## Component Inventory

### PriceCard
- States: default, loading (skeleton), error, updating (pulse)
- Shows: logo, name, symbol, price, 24h change, sparkline
- Hover: expanded stats panel

### NewsCard
- States: default, loading, featured (larger)
- Shows: thumbnail, category tag, headline, source, time
- Hover: image zoom, title underline

### TickerItem
- States: positive (green), negative (red), neutral (gray)
- Shows: coin logo, symbol, price, change %
- Animation: flash on price update

### FilterChip
- States: default, active, hover
- Icon + label layout
- Active: filled background with accent color

### SearchBar
- States: default, focused, loading, has-results
- Dropdown with suggestions
- Keyboard navigation support

### SkeletonLoader
- Pulse animation
- Matches component dimensions

## Technical Approach

### Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **APIs**: CoinGecko (free tier, no key required)
- **Fonts**: Google Fonts (Space Grotesk, IBM Plex Sans, JetBrains Mono)
- **Icons**: Lucide via CDN

### Architecture
```
index.html          - Main page structure
css/
  styles.css        - All styles with CSS variables
js/
  app.js            - Main application logic
  api.js            - API integration layer
  components.js     - UI component rendering
  utils.js          - Helper functions
```

### API Integration

**CoinGecko Endpoints (Free Tier)**
- `GET /coins/markets` - Price data with sparklines
- `GET /coins/list` - All coins list
- `GET /search` - Search functionality
- `GET /coins/{id}/market_chart` - Historical data

**Rate Limiting**
- Max 10-30 calls/minute on free tier
- Cache responses for 60 seconds
- Queue non-critical updates

### Data Flow
1. Initial load: Fetch prices, news, new coins in parallel
2. Cache all responses in memory
3. Update prices every 60s (background)
4. Update news every 5 minutes
5. User interactions trigger targeted API calls

### Responsive Breakpoints
- Mobile: < 640px (1 column, stacked)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns + sidebar)
