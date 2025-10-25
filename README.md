# Stock Forum Frontend

React-based frontend for the Stock Forum application with modern UI and real-time data visualization.

## 🚀 Features

- **React 19** with modern hooks
- **React Router** for navigation
- **Axios** for API integration
- **Chart.js** for stock data visualization
- **JWT Authentication** with Google OAuth
- **Responsive Design** for mobile and desktop
- **Real-time Updates** with hot reload
- **Netlify Deployment** ready

## 📁 Project Structure

```
client/
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   ├── context/           # React context (Auth, etc.)
│   ├── styles/            # CSS files
│   └── App.js             # Main app component
├── public/                # Static assets
├── docs/                  # Documentation
└── package.json          # Dependencies
```

## 🛠️ Local Development

**See the comprehensive guide**: [LOCAL_DEVELOPMENT.md](../LOCAL_DEVELOPMENT.md) in the project root.

Quick start:

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:3000

# Start development server
npm start
```

Opens automatically at `http://localhost:3001`

## 📦 Deployment

**See**: [docs/deployment.md](./docs/deployment.md) for Netlify deployment guide.

Quick start:

1. Connect GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable: `REACT_APP_API_URL=https://your-vercel-api.vercel.app`
5. Deploy

## 🔑 Environment Variables

See [docs/environment.md](./docs/environment.md) for detailed configuration.

Required variable:

```bash
REACT_APP_API_URL=http://localhost:3000  # Local
# or
REACT_APP_API_URL=https://your-api.vercel.app  # Production
```

## 🧪 Available Scripts

### `npm start`

Runs development server at `http://localhost:3001`

### `npm run build`

Creates optimized production build in `build/` folder

### `npm test`

Launches test runner

## 📚 Documentation

- **[Local Development](../LOCAL_DEVELOPMENT.md)** - Full development setup
- **[Environment Setup](./docs/environment.md)** - Configure environment variables
- **[Deployment Guide](./docs/deployment.md)** - Deploy to Netlify

## 🔗 API Integration

The frontend connects to the backend API via `src/services/api.js`:

```javascript
// Configured via environment variable
baseURL: process.env.REACT_APP_API_URL;
```

All API calls go through service files in `src/services/`:

- `stockService.js` - Stock operations
- `commentService.js` - Comments
- `conversationService.js` - Conversations
- `portfolioService.js` - Portfolio posts

## 🎨 Key Components

### Pages

- `Home.js` - Landing page with stock list
- `StockDetail.js` - Individual stock view
- `Articles.js` - Articles list
- `RateMyPortfolio.js` - Portfolio rating feature
- `Profile.js` - User profile

### Components

- `StockCard.js` - Stock display card
- `StockChart.js` - Price chart visualization
- `Navbar.js` - Navigation bar
- `AuthModal.js` - Login/register modal
- `Comment.js` - Comment display

## 🔐 Authentication

Authentication state managed via `src/context/AuthContext.js`:

- JWT token stored in localStorage
- Token automatically added to API requests
- Auto-logout on token expiration

## 🎯 Development Workflow

1. **Make changes** to components
2. **Browser auto-refreshes** - see changes instantly
3. **Check browser console** for errors
4. **Test API calls** in Network tab
5. **Build** before deploying: `npm run build`

## 📊 Visualization Libraries

- **Chart.js** - Stock price charts
- **D3.js** - Advanced data visualization
- **Observable Plot** - Statistical plots

## 🐛 Troubleshooting

### Can't reach API

- Check `REACT_APP_API_URL` in `.env`
- Verify backend is running
- Check CORS configuration in backend

### Build errors

- Run `npm run build` locally first
- Check all imports are correct
- Verify all dependencies are installed

### Page not found on refresh

- Ensure `netlify.toml` has SPA redirect rules
- Check router configuration

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

---

**Note**: This frontend connects to the serverless API deployed on Vercel. See the backend README for API documentation.
