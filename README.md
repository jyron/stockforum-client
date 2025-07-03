# Stock Forum Client

A modern React application built with TypeScript, Vite, and pnpm for the Stock Forum platform.

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **pnpm**
- **React Router**
- **Chart.js**
- **D3.js**
- **Axios**

## Prerequisites

- **Node.js** (version 18 or higher)
- **pnpm** (version 10 or higher)

### Installing pnpm

If you don't have pnpm installed, you can install it globally:

```bash
npm install -g pnpm
```

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stockforum-client
```

2. Install dependencies:
```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will open at [http://localhost:3000](http://localhost:3000) in your browser.

The page will automatically reload when you make changes to the code.

### Building for Production

Build the application for production:

```bash
pnpm build
```

This creates an optimized production build in the `build` folder.

### Preview Production Build

To preview the production build locally:

```bash
pnpm preview
```

### Linting

Run the linter to check for code quality issues:

```bash
pnpm lint
```

## Project Structure

```
src/
├── components/          # Reusable React components
├── context/            # React context providers
├── pages/              # Page components and routing
├── services/           # API services and utilities
├── styles/             # CSS styles and themes
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```


## Deployment

The application is configured for deployment on Netlify with the `netlify.toml` configuration file.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Learn More

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [pnpm Documentation](https://pnpm.io/)
