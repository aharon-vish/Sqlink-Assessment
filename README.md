# Job Management Dashboard

## Prerequisites

- **Node.js 22+**
- **npm** or **yarn**

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd Sqlink-Assessment

# Install dependencies
npm install
# or
yarn install
```

## Running the Project

### Development Mode
```bash
npm run dev
# or
yarn dev
```
Opens at http://localhost:5173 (uses mock API by default)

### Production Mode
```bash
npm run prod
# or
yarn prod
```
Runs development server with production configuration for debugging

### Build for Production
```bash
npm run build
# or
yarn build
```
Creates optimized production bundle in `dist/` folder

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run prod` | Start dev server with production mode |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run storybook` | Start Storybook |

## Architecture Overview

```
src/
├── components/           
│   ├── dashboard/       # Dashboard components (JobTable, StatusCards, SearchBar)
│   ├── forms/           # Form components (CreateJobForm, DeleteJobsForm)
│   ├── layout/          # Layout wrappers (DashboardLayout, Header)
│   ├── modals/          # Modal dialogs (CreateJobModal, DeleteJobsModal)
│   └── ui/              # Reusable UI (Button, Input, Modal, ProgressBar)
├── hooks/               # Custom React hooks (useTranslation, useDebounce)
├── i18n/                # Internationalization config and translations
├── pages/               # Page components (Dashboard)
├── services/            # API and SignalR services
├── stores/              # Zustand state management
├── types/               # TypeScript definitions
└── App.tsx              # Root component
```

### Key Files

- **`App.tsx`** - Root application component, initializes providers
- **`pages/Dashboard.tsx`** - Main dashboard page container
- **`components/dashboard/JobTable.tsx`** - Job table with sorting/filtering
- **`components/dashboard/StatusCardsGrid.tsx`** - Status overview cards
- **`services/index.ts`** - Service configuration (mock/real API switch)
- **`services/mockApiService.ts`** - Mock API for offline development
- **`services/mockSignalRService.ts`** - Mock real-time updates
- **`services/realSignalRService.ts`** - Production SignalR client
- **`stores/jobStore.ts`** - Job data and operations state
- **`stores/uiStore.ts`** - UI state (modals, loading)

## State Management Architecture

### Zustand Store Pattern
- **JobStore**: Manages job data, filters, sorting, and computed properties
- **UIStore**: Controls modal states and loading indicators
- Atomic updates with automatic UI synchronization
- DevTools integration for debugging

### Data Flow
```
User Action → API Service → Store Update → Component Re-render
```

## API & SignalR Integration

### Mock Mode (Default)
- Complete offline experience
- Simulated job lifecycle (Pending → InQueue → Running → Completed/Failed)
- Progress updates every 1.5 seconds
- No backend required

### Production Mode
Configure environment variables:
```bash
VITE_API_MODE=real
VITE_API_BASE_URL=https://your-api.com/api
VITE_SIGNALR_HUB_URL=https://your-api.com/jobHub
```

### SignalR Real-time Updates
- Job progress tracking
- Status change notifications
- Connection state monitoring
- Automatic reconnection logic