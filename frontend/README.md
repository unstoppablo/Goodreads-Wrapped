# Goodreads Wrapped Frontend

## 🌟 Features

- Story-driven reading statistics visualization
- Automatic page transitions with custom durations
- Interactive navigation controls
- Atmospheric video background
- Mobile and desktop responsive design
- Local data caching (5-minute duration)
- Smooth animations and transitions
- Book cover image integration
- Rating visualizations with star displays
- Reading progress timelines
- Monthly statistics breakdowns

---

## 🛠️ Technical Stack

- **Framework**: React
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Media**: Video background support
- **Data Storage**: Local Storage for caching

---

## 🏗️ Project Structure

```
src/components
├── Main.jsx              # Main application container
├── pages/                # Story pages
│   ├── InstructionPage   # File upload and validation
│   ├── IntroPage         # Welcome screens
│   ├── Overview          # Basic statistics
│   ├── BookTrends        # Rating trends and patterns
│   ├── BookListing       # Book showcase pages
│   ├── BookExtremes      # Longest/shortest books
│   ├── FunFacts          # Time comparisons
│   ├── CoolStats         # Engaging statistics
│   └── SummaryStats      # Final overview
├── animations/           # Animation components
└── media/                # Media assets
```

---

## 📱 Experience Flow

### 1. Setup Phase

- Clear instructions for Goodreads export
- CSV file upload and validation
- Loading state with progress indicator
- Connection to backend processing

### 2. Story Flow

The experience guides users through their reading year with engaging transitions and animations:

- Welcome sequence
- Basic reading statistics
- Reading achievement visualizations
- Time comparisons and fun facts
- Monthly trends and patterns
- Book highlights and reviews
- Final summary and overview

### 3. Interactive Elements

- Touch and click navigation
- Custom page transitions
- Responsive visualizations
- Dynamic content loading
- Progress tracking dots

---

## 🎯 Key Components

### Navigation System

- Touch areas on screen edges (mobile)
- Arrow buttons (desktop)
- Progress indicator dots

### Data Visualization

- Star rating displays
- Reading progress timelines
- Book cover galleries
- Achievement comparisons

### Animations & Transitions

- Page transitions with Framer Motion
- Text reveal animations
- Progress indicators
- Loading states

---

## 🚀 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

---

## 🔧 Configuration

### Environment Variables

```env
VITE_API_BASE_URL=your_backend_url
```

### Page Timing Configuration

Located in Main.jsx:

```javascript
const pageDurations = {
  intro: 9000,
  overview: 5000,
  percentiles: 6000,
  // ... other page timings
};
```

### Cache Settings

- Duration: 5 minutes
- Cache key: "analysisData"
- Automatic cleanup on experience completion

---

## 🎨 Styling

- Tailwind CSS for responsive design
- Dark theme with ambient background
- Custom animations and transitions
- Responsive typography system
- Component-specific styles

---

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 12+
- Android Chrome 76+

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📄 License

MIT License
