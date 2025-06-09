# J. ChatBot

A modern, responsive AI-powered chatbot built with React and Vite, featuring Google's Gemini AI integration.

## ✨ Features

### 🗣️ Chat Functionality
- **AI-Powered Conversations**: Integrated with Google Gemini 1.5 Flash for intelligent responses
- **Conversation Memory**: AI remembers the entire conversation context for personalized responses
- **Persistent Chat History**: Chat sessions persist until page reload (stored in browser session)
- **Real-time Messaging**: Instant responses with loading indicators
- **Auto-scroll**: Automatically scrolls to the latest message

### 🎨 Modern UI/UX
- **Dark/Light Mode Toggle**: Beautiful theme switching with system preference detection
- **Responsive Design**: Optimized for all device sizes (desktop, tablet, mobile)
- **Modern Chat Interface**: WhatsApp-style message bubbles with avatars
- **Smooth Animations**: Elegant transitions and micro-interactions
- **Custom Scrollbar**: Styled scrollbars that match the theme

### 🎯 User Experience
- **Keyboard Shortcuts**: Press Enter to send messages
- **Empty State**: Friendly welcome message when no conversations exist
- **Disabled States**: Smart button states based on input and loading status
- **Accessibility**: Focus indicators and ARIA labels for screen readers

### 📱 Responsive Features
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interface
- **Adaptive Layouts**: Intelligent layout changes for different screen sizes
- **Multiple Breakpoints**: Support for screens from 360px to 1400px+ wide
- **Device-Specific Optimizations**: 
  - iOS Safari support with proper font sizing
  - Android touch optimization
  - Landscape orientation handling
- **Overflow Protection**: Prevents horizontal scrolling on any device
- **Word Breaking**: Smart text wrapping for long URLs and code
- **Flexible Tables**: Responsive tables that stack on mobile devices
- **Touch Gestures**: Smooth scrolling and touch interactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key:
```
VITE_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables
- `VITE_API_KEY`: Your Google Gemini API key (required)

### Theme Persistence
- Dark/Light mode preference is stored in localStorage
- Chat history is stored in sessionStorage (persists until tab close)
- Conversation context is maintained throughout the session for personalized responses
- Very long conversations may hit API token limits and require clearing chat history

## 🛠️ Built With

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API requests
- **Google Gemini AI** - AI conversation engine
- **CSS Custom Properties** - Theming and responsive design

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design Features

- **CSS Variables**: Centralized theming system
- **Modern Gradients**: Beautiful color transitions
- **Box Shadows**: Subtle depth and elevation
- **Smooth Transitions**: 300ms animations throughout
- **Custom Scrollbars**: Themed scrollbars for better UX

## 📱 Responsive Testing

The chatbot has been tested and optimized for:

### Screen Sizes
- **Ultra-wide**: 1400px+ (desktop monitors)
- **Desktop**: 1200px - 1400px
- **Laptop**: 992px - 1199px
- **Tablet**: 768px - 991px
- **Mobile**: 480px - 767px
- **Small Mobile**: 360px - 479px
- **Very Small**: <360px

### Device Types
- iPhone (all sizes from SE to Pro Max)
- Android phones (various manufacturers)
- iPad and Android tablets
- Desktop computers and laptops
- Ultra-wide monitors

### Orientations
- Portrait mode optimization
- Landscape mode adjustments
- Automatic height adjustments

### Testing Tips
To test responsiveness:
1. Use browser developer tools
2. Try different zoom levels (50% - 200%)
3. Test on actual devices when possible
4. Check both portrait and landscape orientations

## 🔒 Privacy & Security

- No backend storage - all data stays in your browser
- Chat history clears on page refresh
- API key stored securely in environment variables
- No tracking or analytics

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
