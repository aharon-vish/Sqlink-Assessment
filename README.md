# 🚀 Job Management Dashboard

A modern, real-time job management dashboard built with React, TypeScript, and Vite. This project demonstrates advanced frontend development skills including state management, real-time updates, internationalization, and comprehensive testing.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Running Modes](#️-running-modes)
- [🔄 Job Status Lifecycle](#-job-status-lifecycle)
- [🏪 State Management](#-state-management)
- [🌐 API Architecture](#-api-architecture)
- [🌍 Internationalization](#-internationalization)
- [🧪 Testing](#-testing)
- [🛠️ Development Tools](#️-development-tools)

## 🎯 Project Overview

This is a comprehensive job management dashboard that allows users to:
- View and manage jobs in real-time
- Monitor job progress and status changes
- Filter and sort jobs by various criteria
- Create new jobs with different priorities
- Delete completed/failed jobs
- Switch between English and Hebrew languages
- Experience smooth UI animations and transitions

## ✨ Features

### Core Functionality
- ✅ **Real-time Job Updates** - Live progress tracking via SignalR
- ✅ **Job Management** - Create, start, stop, restart, delete jobs
- ✅ **Status Filtering** - Filter jobs by status (Pending, InQueue, Running, etc.)
- ✅ **Search & Sort** - Search by name, sort by any column
- ✅ **Progress Tracking** - Visual progress bars with percentage
- ✅ **Bulk Operations** - Delete multiple jobs by status

### UI/UX Features
- ✅ **Responsive Design** - Mobile-first responsive layout
- ✅ **Dark/Light Themes** - Theme support ready
- ✅ **RTL Support** - Full Hebrew language support
- ✅ **Loading States** - Skeleton loaders and loading indicators
- ✅ **Error Handling** - Comprehensive error boundaries
- ✅ **Notifications** - Toast notifications for actions

### Technical Features
- ✅ **TypeScript** - Fully typed codebase
- ✅ **Mock Mode** - Complete offline development experience
- ✅ **Real-time Updates** - SignalR integration
- ✅ **State Management** - Zustand for global state
- ✅ **Testing** - Unit and integration tests
- ✅ **Internationalization** - i18next for translations

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── JobTable.tsx          # Main job table component
│   │   ├── JobTableHeader.tsx    # Sortable table headers
│   │   ├── JobTableRow.tsx       # Individual job row
│   │   ├── JobActions.tsx        # Action buttons (start/stop/delete)
│   │   ├── StatusCardsGrid.tsx   # Status overview cards
│   │   ├── StatusCard.tsx        # Individual status card
│   │   └── SearchFilterBar.tsx   # Search and filter controls
│   ├── forms/           # Form components
│   │   ├── CreateJobForm.tsx     # New job creation form
│   │   └── DeleteJobsForm.tsx    # Bulk delete form
│   ├── layout/          # Layout components
│   │   ├── DashboardLayout.tsx   # Main layout wrapper
│   │   ├── DashboardHeader.tsx   # Top navigation header
│   │   └── LanguageToggle.tsx    # Language switcher
│   ├── modals/          # Modal dialogs
│   │   ├── ModalManager.tsx      # Modal state management
│   │   ├── CreateJobModal.tsx    # Job creation modal
│   │   └── DeleteJobsModal.tsx   # Bulk delete modal
│   └── ui/              # Basic UI components
│       ├── Button.tsx            # Reusable button component
│       ├── Input.tsx             # Form input component
│       ├── Modal.tsx             # Base modal component
│       ├── Select.tsx            # Dropdown select component
│       ├── ProgressBar.tsx       # Progress visualization
│       ├── StatusBadge.tsx       # Status indicator
│       ├── ConnectionStatus.tsx  # SignalR connection indicator
│       └── UpdateIndicator.tsx   # Real-time update notifications
├── hooks/               # Custom React hooks
│   ├── useTranslation.ts        # Internationalization hook
│   ├── usePerformance.ts        # Performance monitoring
│   └── useDebounce.ts           # Debounced state hook
├── i18n/                # Internationalization
│   ├── config.ts                # i18next configuration
│   └── locales/                 # Translation files
│       ├── en.json              # English translations
│       └── he.json              # Hebrew translations
├── pages/               # Page components
│   └── Dashboard.tsx            # Main dashboard page
├── services/            # External service integrations
│   ├── index.ts                 # Service configuration
│   ├── serviceConfig.ts         # Environment-based config
│   ├── mockApiService.ts        # Mock API for development
│   ├── enhancedMockApiService.ts # Advanced mock with lifecycle
│   ├── mockSignalRService.ts    # Mock SignalR for development
│   └── realSignalRService.ts    # Production SignalR client
├── stores/              # Global state management
│   ├── jobStore.ts              # Job data and operations
│   └── uiStore.ts               # UI state (modals, loading)
├── types/               # TypeScript type definitions
│   ├── index.ts                 # Type exports
│   ├── job.ts                   # Job-related types
│   ├── enums.ts                 # Status and priority enums
│   ├── store.ts                 # Store interface types
│   └── components.ts            # Component prop types
├── tests/               # Test files
│   ├── components/              # Component tests
│   ├── hooks/                   # Hook tests
│   ├── integration/             # Integration tests
│   └── setup.ts                # Test configuration
├── stories/             # Storybook stories
└── App.tsx              # Root application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sqlink-Assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start development server (uses .env or defaults to mock)
npm run prod             # Start development server in production mode (for debugging)
npm run build            # Build optimized production bundle
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint code linting
npm run type-check       # Run TypeScript type checking

# Testing
npm run test             # Run unit tests with Vitest
npm run test:ui          # Run tests with interactive UI
npm run test:coverage    # Generate test coverage report

# Storybook (Component Development)
npm run storybook        # Start Storybook development server
npm run build-storybook  # Build static Storybook
```

### Quick Start Options

**Option 1: Demo Mode (No Setup Required)**
```bash
npm install
npm run dev
# Opens http://localhost:5173 in mock mode
```

**Option 2: With Real Backend**
```bash
npm install
echo "VITE_API_MODE=real" > .env
echo "VITE_API_BASE_URL=https://your-backend-api.com/api" >> .env
echo "VITE_SIGNALR_HUB_URL=https://your-backend-api.com/jobHub" >> .env
npm run dev              # Development mode
# OR
npm run prod             # Production mode with debugging
```

**Option 3: Production Build**
```bash
npm install
npm run build
npm run preview
# Or deploy dist/ folder to hosting service
```

## ⚙️ Running Modes

The application supports two distinct running modes:

### 🧪 Mock Mode (Default)
**Best for development and demonstration**

```bash
# Set environment variable
VITE_API_MODE=mock npm run dev

# Or create .env file
echo "VITE_API_MODE=mock" > .env
npm run dev
```

**Features:**
- ✅ Complete offline experience
- ✅ Simulated job lifecycle (Pending → InQueue → Running → Completed/Failed)
- ✅ Real-time progress updates every 1.5 seconds
- ✅ Mock SignalR events
- ✅ Realistic job processing delays
- ✅ Random success/failure rates (70% success)
- ✅ No backend required

**Perfect for:**
- Development and testing
- Demonstrations and presentations
- Frontend development without backend dependency

### 🏭 Production Mode
**For real backend integration**

**Development with Real API:**
```bash
# Edit .env.production file
echo "VITE_API_MODE=real" > .env
echo "VITE_API_BASE_URL=https://your-api.com/api" >> .env
echo "VITE_SIGNALR_HUB_URL=https://your-api.com/jobHub" >> .env

npm run dev              # Development mode
# OR
npm run prod             # Production mode with debugging (hot reload + production settings)
```

**Production Build:**
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ folder to your hosting service
```

**Features:**
- 🔗 Real API integration
- 🔗 Real SignalR Hub connection
- 🔗 Production-ready error handling
- 🔗 Automatic reconnection logic
- 🔗 Connection state monitoring

**Backend Requirements:**
- RESTful API endpoints for job operations
- SignalR Hub for real-time updates
- CORS configuration for frontend domain


```
Pending → InQueue → Running → Completed/Failed
   ↓         ↓        ↓           ↓
 2-5sec   3-5sec   Progress    Final
                   Updates
```

### Status Details

| Status | Description | Available Actions | Progress |
|--------|-------------|-------------------|----------|
| **Pending** | Job queued for processing | Delete | 0% |
| **InQueue** | Waiting for available worker | Stop, Delete | 0% |
| **Running** | Currently being processed | Stop | 1-99% |
| **Completed** | Successfully finished | Restart, Delete | 100% |
| **Failed** | Processing failed with error | Restart, Delete | Varies |
| **Stopped** | Manually stopped by user | Restart, Delete | Stopped at % |

### Automatic Transitions

**Mock Mode Simulation:**
1. **Pending → InQueue**: 2-5 seconds
2. **InQueue → Running**: 3-5 seconds  
3. **Running Progress**: Updates every 1.5 seconds (5-15% increments)
4. **Running → Final**: When progress reaches 100% (70% success rate)

**Production Mode:**
- Controlled by backend job processor
- Real-time updates via SignalR
- Actual job execution times

## 🏪 State Management

### Zustand Stores

#### JobStore (`src/stores/jobStore.ts`)
**Central hub for all job-related data and operations**

```typescript
interface JobStore {
  // State
  jobs: Job[]                    // All job data
  statusCards: StatusCard[]      // Status overview cards
  filters: JobFilters           // Search and filter state
  sorting: JobSorting           // Table sorting state
  isLoading: boolean            // Loading indicator
  error: string | null          // Error messages

  // Actions
  setJobs: (jobs: Job[]) => void
  addJob: (job: Job) => void
  updateJob: (jobId: string, updates: Partial<Job>) => void
  removeJob: (jobId: string) => void
  
  // Computed
  getFilteredJobs: () => Job[]   // Filtered and sorted jobs
  getJobCounts: () => Record<JobStatus, number>
}
```

**Key Features:**
- ✅ **Atomic Updates**: Status cards automatically sync with job changes
- ✅ **Computed Properties**: Efficient filtering and sorting
- ✅ **DevTools Integration**: Full Redux DevTools support
- ✅ **Type Safety**: Complete TypeScript coverage

#### UIStore (`src/stores/uiStore.ts`)
**Manages UI state like modals and loading states**

```typescript
interface UIStore {
  // Modal State
  isCreateJobModalOpen: boolean
  isDeleteJobsModalOpen: boolean
  
  // Loading States
  loadingStates: Record<string, boolean>
  
  // Actions
  openCreateJobModal: () => void
  setLoadingState: (key: string, loading: boolean) => void
}
```

### State Flow
```
User Action → API Call → Store Update → UI Re-render
     ↓             ↓          ↓           ↓
  Button Click   Service    Zustand    Components
                 Layer      Store      Update
```

## 🌐 API Architecture

### Service Layer Pattern

#### Mock API Service (`src/services/mockApiService.ts`)
**Complete job management simulation**

```typescript
class MockApiService implements JobAPI {
  // Job Operations
  getAllJobs(): Promise<Job[]>
  createJob(request: CreateJobRequest): Promise<Job>
  stopJob(jobId: string): Promise<ApiResponse>
  restartJob(jobId: string): Promise<ApiResponse>
  deleteJob(jobId: string): Promise<void>
  deleteJobsByStatus(status: JobStatus): Promise<void>

  // Lifecycle Simulation
  private simulateJobLifecycle(jobId: string): void
  private simulateProgress(jobId: string): void
}
```

**Realistic Features:**
- ✅ Network delay simulation (200-500ms)
- ✅ Random failure scenarios
- ✅ Job lifecycle progression
- ✅ SignalR event emission
- ✅ Error message generation

#### Real API Service
**Production backend integration**

```typescript
class RealApiService implements JobAPI {
  private baseUrl = process.env.VITE_API_BASE_URL

  // RESTful API calls
  async getAllJobs() {
    const response = await fetch(`${this.baseUrl}/Jobs`)
    return response.json()
  }
  
  async createJob(request: CreateJobRequest) {
    const response = await fetch(`${this.baseUrl}/Jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
    return response.json()
  }
  
  // ... other endpoints
}
```

### SignalR Integration

#### Mock SignalR (`src/services/mockSignalRService.ts`)
```typescript
class EnhancedMockSignalRService implements JobSignalRHub {
  // Event Simulation
  emitProgressUpdate(update: JobProgressUpdate): void
  
  // Connection Simulation
  async start(): Promise<void>
  async stop(): Promise<void>
  
  // Event Handlers
  onJobProgressUpdate(callback: ProgressCallback): void
  onConnectionStateChanged(callback: ConnectionCallback): void
}
```

#### Real SignalR (`src/services/realSignalRService.ts`)
```typescript
class RealSignalRService implements JobSignalRHub {
  private connection: HubConnection
  
  // Real Connection Management
  async start(): Promise<void>
  async stop(): Promise<void>
  async manualReconnect(): Promise<void>
  
  // Hub Methods
  async joinJobGroup(jobId: string): Promise<void>
  async leaveJobGroup(jobId: string): Promise<void>
}
```

### API Integration Flow
```
Component → JobTableContainer → API Service → Backend
    ↓              ↓               ↓            ↓
 User Click    Action Handler   HTTP/SignalR   Server
    ↓              ↓               ↓            ↓
UI Update ← Store Update ← Service Response ← API Response
```

## 🌍 Internationalization

### Supported Languages
- 🇺🇸 **English** (LTR)
- 🇮🇱 **Hebrew** (RTL)

#### English (`src/i18n/locales/en.json`)
```json
{
  "dashboard": {
    "title": "Job Management Dashboard"
  },
  "jobTable": {
    "columns": {
      "jobName": "Job Name",
      "status": "Status",
      "progress": "Progress"
    },
    "actions": {
      "delete": "Delete",
      "restart": "Restart",
      "stop": "Stop"
    },
    "confirmations": {
      "delete": {
        "title": "Delete Job",
        "message": "Are you sure you want to delete \"{{jobName}}\"?"
      }
    }
  }
}
```

#### Hebrew (`src/i18n/locales/he.json`)
```json
{
  "dashboard": {
    "title": "לוח בקרת משימות"
  },
  "jobTable": {
    "columns": {
      "jobName": "שם המשימה",
      "status": "סטטוס", 
      "progress": "התקדמות"
    },
    "actions": {
      "delete": "מחק",
      "restart": "הפעל מחדש",
      "stop": "עצור"
    },
    "confirmations": {
      "delete": {
        "title": "מחק משימה",
        "message": "האם אתה בטוח שברצונך למחוק את \"{{jobName}}\"?"
      }
    }
  }
}
```

### RTL Support
- ✅ Automatic text direction switching
- ✅ Mirrored layouts for Hebrew
- ✅ Icon and button position adjustments
- ✅ Date/time formatting per locale

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing

### Test Structure
```
src/tests/
├── components/          # Component unit tests
│   ├── dashboard/
│   ├── forms/
│   └── ui/
├── hooks/              # Custom hook tests
├── integration/        # Integration test suites
└── setup.ts           # Test configuration
```

### Key Test Files
- `Dashboard.test.tsx` - Main dashboard functionality
- `JobStore.test.ts` - State management logic
- `JobActions.test.tsx` - Job action workflows
- `SearchFilterBar.test.tsx` - Filtering and search

### Running Tests
```bash
npm run test              # Run all tests
npm run test:ui           # Interactive test runner
npm run test:coverage     # Generate coverage report
```

## 🛠️ Development Tools

### Code Quality
- **ESLint**: Code linting and style enforcement
- **TypeScript**: Static type checking
- **Prettier**: Code formatting (integrated with ESLint)

### Development Experience
- **Vite**: Fast development server and HMR
- **Storybook**: Component development and documentation
- **React DevTools**: Component debugging
- **Zustand DevTools**: State debugging

### Performance
- **Bundle Analysis**: Webpack bundle analyzer
- **Lighthouse**: Performance auditing
- **Performance Hooks**: Custom performance monitoring

---

## 🎯 Assessment Highlights

This project demonstrates proficiency in:

### **Frontend Architecture**
- ✅ Scalable component architecture
- ✅ Clean separation of concerns
- ✅ Reusable design patterns
- ✅ Type-safe development

### **State Management**
- ✅ Efficient global state with Zustand
- ✅ Computed properties and selectors
- ✅ Atomic state updates
- ✅ DevTools integration

### **Real-time Features**
- ✅ SignalR integration
- ✅ Live progress tracking
- ✅ Connection state management
- ✅ Offline fallback strategies

### **User Experience**
- ✅ Responsive design
- ✅ Loading states and error handling
- ✅ Internationalization (English/Hebrew)
- ✅ Accessibility considerations

### **Development Practices**
- ✅ Comprehensive testing strategy
- ✅ TypeScript throughout
- ✅ Git workflow and documentation
- ✅ Production-ready configuration

---

**Built with ❤️ for boardirector Assessment**