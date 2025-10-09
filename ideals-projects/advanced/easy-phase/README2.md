## 📋 4 PROJECTS CHIẾN LƯỢC (8 Tuần)

### Chiến lược mới:
1. **React SPA** (Vite) - Client-side rendering, routing
2. **Next.js** - SSR, API routes
3. **React SPA** (CRA/Vite) - Complex state với Redux
4. **Next.js** - Advanced features, AI

**Balance**: 2 React thuần + 2 Next.js

---

## 🥇 PROJECT 1: Crypto Investment Tracker (2.5 tuần)
**Platform**: React SPA (Vite)  
**Tại sao React thuần đầu tiên?**
- Học routing, client-side navigation
- Separate frontend/backend architecture
- Master React hooks, performance
- Build & deploy SPA

### Tech Stack
```yaml
Frontend: 
  - Vite + React 18 + TypeScript
  - React Router v6 (routing)
  - Zustand (state)
  - TanStack Query (data fetching)
  - shadcn/ui + TailwindCSS
  - Recharts + Lightweight Charts
  - WebSocket (ws library)

Backend (Separate):
  - Node.js + Express + TypeScript
  - Prisma + PostgreSQL
  - Redis (caching)
  - JWT authentication
  - CORS setup

Deploy:
  - Frontend: Netlify/Vercel
  - Backend: Railway/Render
  - Database: Supabase/Railway
```

### Architecture Khác Biệt với Next.js

```
┌─────────────────────────────────────────────┐
│  REACT SPA (Vite)                           │
│  ├── Client-side routing (React Router)     │
│  ├── CSR only (no SSR)                      │
│  ├── Separate build process                 │
│  └── Environment: VITE_* variables          │
└─────────────────────────────────────────────┘
                    ↓ HTTP/WebSocket
┌─────────────────────────────────────────────┐
│  EXPRESS BACKEND (Separate server)          │
│  ├── RESTful API                            │
│  ├── JWT authentication                     │
│  ├── CORS middleware                        │
│  └── WebSocket server                       │
└─────────────────────────────────────────────┘
```

### Project Structure
```
crypto-tracker/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Router setup
│   │   ├── pages/              # Route components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── CoinDetail.tsx
│   │   │   └── Login.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   │   ├── api.ts         # Axios instance
│   │   │   └── websocket.ts
│   │   ├── store/             # Zustand stores
│   │   └── lib/
│   ├── vite.config.ts
│   └── package.json
│
└── backend/                    # Express API
    ├── src/
    │   ├── server.ts          # Express app
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── portfolio.ts
    │   │   └── prices.ts
    │   ├── controllers/
    │   ├── middleware/
    │   │   ├── auth.ts        # JWT verify
    │   │   └── cors.ts
    │   ├── services/
    │   │   ├── coinApi.ts
    │   │   └── websocket.ts
    │   └── prisma/
    ├── tsconfig.json
    └── package.json
```

### Core Features (MVP)

**Week 1: Setup & Authentication**
- [ ] Vite + React setup
- [ ] React Router v6 (protected routes, lazy loading)
- [ ] Express backend setup
- [ ] JWT authentication (login/register)
- [ ] Axios interceptors (token refresh)
- [ ] Private route wrapper

**Week 2: Portfolio & Real-time**
- [ ] Add coins to portfolio
- [ ] Fetch live prices (CoinGecko REST)
- [ ] WebSocket real-time prices (separate WS server)
- [ ] TanStack Query caching
- [ ] Portfolio value calculation
- [ ] Charts (Recharts)

**Week 3: Advanced & Polish**
- [ ] Transaction history (buy/sell)
- [ ] Profit/Loss calculation
- [ ] Price alerts
- [ ] Performance optimization
- [ ] Redis caching (backend)
- [ ] Mobile responsive
- [ ] Deploy both frontend & backend

### Key Technical Highlights

**1. React Router v6 Setup**
```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const CoinDetail = lazy(() => import('./pages/CoinDetail'));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="coins/:id" element={<CoinDetail />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**2. Separate Backend - Express API**
```typescript
// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './routes/auth';
import { portfolioRouter } from './routes/portfolio';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/portfolio', authenticateToken, portfolioRouter);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**3. Axios Instance với Interceptors**
```typescript
// frontend/src/services/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (token refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        
        localStorage.setItem('token', data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        
        return api(originalRequest);
      } catch (error) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

**4. WebSocket Client**
```typescript
// frontend/src/services/websocket.ts
class CryptoWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private subscribers = new Map<string, Set<(data: any) => void>>();

  connect() {
    this.ws = new WebSocket(import.meta.env.VITE_WS_URL);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notify(data.symbol, data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.handleReconnect();
    };
  }

  subscribe(symbol: string, callback: (data: any) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      this.ws?.send(JSON.stringify({ action: 'subscribe', symbol }));
    }
    this.subscribers.get(symbol)!.add(callback);
  }

  unsubscribe(symbol: string, callback: (data: any) => void) {
    this.subscribers.get(symbol)?.delete(callback);
    if (this.subscribers.get(symbol)?.size === 0) {
      this.subscribers.delete(symbol);
      this.ws?.send(JSON.stringify({ action: 'unsubscribe', symbol }));
    }
  }

  private notify(symbol: string, data: any) {
    this.subscribers.get(symbol)?.forEach(callback => callback(data));
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
      setTimeout(() => this.connect(), delay);
    }
  }
}

export const cryptoWS = new CryptoWebSocket();
```

**5. Custom Hook cho WebSocket**
```typescript
// frontend/src/hooks/useCoinPrice.ts
import { useEffect, useState } from 'react';
import { cryptoWS } from '@/services/websocket';

export function useCoinPrice(symbol: string) {
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = (data: any) => {
      setPrice(data.price);
      setChange24h(data.change24h);
    };

    cryptoWS.subscribe(symbol, handleUpdate);

    return () => {
      cryptoWS.unsubscribe(symbol, handleUpdate);
    };
  }, [symbol]);

  return { price, change24h };
}
```

### Learning Outcomes - React Thuần

**So với Next.js, bạn học được:**

✅ **Routing:**
- React Router v6 (client-side routing)
- Lazy loading routes
- Protected routes pattern
- Navigation programmatically

✅ **Build Process:**
- Vite configuration
- Environment variables (VITE_*)
- Production build optimization
- Static asset handling

✅ **Backend Integration:**
- CORS setup
- Separate API server
- Token-based authentication
- Axios interceptors

✅ **Deployment:**
- Deploy frontend & backend separately
- Environment management
- CDN for static assets

✅ **Performance:**
- Code splitting (React.lazy)
- Route-based splitting
- Bundle analysis
- Service Worker (optional PWA)

### Interview Talking Points

- "Built SPA with Vite achieving < 1s load time and 95 Lighthouse score"
- "Implemented client-side routing with React Router v6, code splitting per route"
- "Designed RESTful API with Express, JWT authentication, and refresh token rotation"
- "Set up WebSocket server handling 1000+ concurrent connections with auto-reconnection"
- "Separated concerns: React for UI, Express for API, improved scalability"

---

## 🥈 PROJECT 2: AI Task Manager with Redux Saga (2.5 tuần)
**Platform**: React SPA (Vite)  
**Tại sao React thuần + Redux Saga?**
- Master Redux Saga (side effects)
- Complex async flows
- Middleware patterns
- Generator functions

### Tech Stack
```yaml
Frontend:
  - Vite + React 18 + TypeScript
  - React Router v6
  - Redux Toolkit + Redux Saga (side effects)
  - React Hook Form + Zod
  - @dnd-kit/core (drag-drop)
  - shadcn/ui + TailwindCSS

Backend:
  - Node.js + Express
  - Prisma + PostgreSQL
  - OpenAI API
  - Socket.io (real-time)

Deploy:
  - Frontend: Netlify
  - Backend: Railway
```

### Why Redux Saga?

**Redux Thunk vs Saga:**
```typescript
// ❌ Thunk - Simple but limited
export const fetchTasks = (projectId) => async (dispatch) => {
  dispatch(tasksLoading());
  try {
    const tasks = await api.get(`/tasks?projectId=${projectId}`);
    dispatch(tasksLoaded(tasks));
  } catch (error) {
    dispatch(tasksError(error));
  }
};

// ✅ Saga - Powerful for complex flows
function* fetchTasksSaga(action) {
  try {
    yield put(tasksLoading());
    const tasks = yield call(api.get, `/tasks?projectId=${action.payload}`);
    yield put(tasksLoaded(tasks));
    
    // Complex: Fetch related data in parallel
    const [users, comments] = yield all([
      call(api.get, '/users'),
      call(api.get, `/tasks/${tasks[0].id}/comments`)
    ]);
    
    yield put(relatedDataLoaded({ users, comments }));
  } catch (error) {
    yield put(tasksError(error));
  }
}

function* watchFetchTasks() {
  // Debounce: Only take latest request if multiple fired
  yield debounce(500, FETCH_TASKS, fetchTasksSaga);
}
```

### Saga Patterns trong Project

**1. Optimistic Updates**
```typescript
function* updateTaskSaga(action) {
  const { taskId, updates } = action.payload;
  
  // Optimistic update
  yield put(taskUpdatedOptimistic({ taskId, updates }));
  
  try {
    const updatedTask = yield call(api.patch, `/tasks/${taskId}`, updates);
    yield put(taskUpdateSuccess(updatedTask));
  } catch (error) {
    // Rollback on error
    yield put(taskUpdateRollback({ taskId }));
    yield put(taskUpdateError(error));
  }
}
```

**2. Polling with Cancellation**
```typescript
function* pollTaskStatusSaga(action) {
  const { taskId } = action.payload;
  
  while (true) {
    try {
      const task = yield call(api.get, `/tasks/${taskId}`);
      yield put(taskStatusUpdated(task));
      
      if (task.status === 'completed') {
        break; // Stop polling when done
      }
      
      yield delay(2000); // Poll every 2 seconds
    } catch (error) {
      yield put(pollError(error));
      break;
    }
  }
}

function* watchPollTaskStatus() {
  while (true) {
    const action = yield take(START_POLLING);
    
    // Start polling in background
    const pollTask = yield fork(pollTaskStatusSaga, action);
    
    // Cancel if user navigates away or stops manually
    yield take([STOP_POLLING, LOCATION_CHANGE]);
    yield cancel(pollTask);
  }
}
```

**3. AI Task Generation (Complex Flow)**
```typescript
function* generateTasksSaga(action) {
  const { description } = action.payload;
  
  try {
    yield put(aiGenerating(true));
    
    // Step 1: Call AI API
    const aiResponse = yield call(openaiApi.generateTasks, description);
    
    // Step 2: Create tasks in parallel
    const taskCreationPromises = aiResponse.tasks.map(task =>
      call(api.post, '/tasks', task)
    );
    const createdTasks = yield all(taskCreationPromises);
    
    // Step 3: Fetch updated project
    const project = yield call(api.get, `/projects/${action.payload.projectId}`);
    
    // Step 4: Update state
    yield put(tasksGenerated(createdTasks));
    yield put(projectUpdated(project));
    yield put(aiGenerating(false));
    
    // Step 5: Show success notification
    yield put(showNotification({
      type: 'success',
      message: `${createdTasks.length} tasks generated!`
    }));
    
  } catch (error) {
    yield put(aiGenerating(false));
    yield put(aiError(error));
    yield put(showNotification({
      type: 'error',
      message: 'Failed to generate tasks'
    }));
  }
}
```

**4. WebSocket Integration**
```typescript
function* watchWebSocket() {
  const socket = yield call(createSocketConnection);
  
  const channel = yield call(createSocketChannel, socket);
  
  while (true) {
    const event = yield take(channel);
    
    switch (event.type) {
      case 'task.updated':
        yield put(taskUpdatedFromServer(event.data));
        break;
      case 'user.joined':
        yield put(userJoined(event.data));
        break;
    }
  }
}

function createSocketChannel(socket) {
  return eventChannel(emit => {
    socket.on('task.updated', (data) => {
      emit({ type: 'task.updated', data });
    });
    
    socket.on('user.joined', (data) => {
      emit({ type: 'user.joined', data });
    });
    
    return () => socket.disconnect();
  });
}
```

### Redux Saga Root Setup
```typescript
// store/sagas/index.ts
import { all, fork } from 'redux-saga/effects';
import { tasksSagas } from './tasksSagas';
import { projectsSagas } from './projectsSagas';
import { aiSagas } from './aiSagas';
import { websocketSagas } from './websocketSagas';

export function* rootSaga() {
  yield all([
    fork(tasksSagas),
    fork(projectsSagas),
    fork(aiSagas),
    fork(websocketSagas),
  ]);
}
```

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './reducers';
import { rootSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
```

### Learning Outcomes - Redux Saga

✅ **Generator Functions:**
- `yield` keyword
- `function*` syntax
- Iterator protocol

✅ **Saga Effects:**
- `call` - Call async functions
- `put` - Dispatch actions
- `take` - Wait for actions
- `fork` - Non-blocking calls
- `cancel` - Cancel tasks
- `all` - Parallel execution
- `race` - First to finish wins
- `delay` - Wait
- `debounce` - Rate limiting
- `throttle` - Throttling

✅ **Patterns:**
- Optimistic updates with rollback
- Polling with cancellation
- WebSocket integration
- Complex async workflows
- Error handling & retry logic

✅ **Testing:**
- Saga testing (easy to test generators)
- Mock API calls
- Test complex flows

### Interview Talking Points

- "Implemented Redux Saga for complex side effects including AI task generation with error handling and rollback"
- "Built polling system with automatic cancellation using Saga's `fork` and `cancel` effects"
- "Integrated WebSocket with Redux using `eventChannel` for real-time collaboration"
- "Used `debounce` and `throttle` effects for optimizing API calls by 60%"
- "Saga's generator-based approach made testing async flows 10x easier compared to Thunks"

---

## 🥉 PROJECT 3: Smart Expense Splitter (2 tuần)
**Platform**: Next.js 14  
**Giữ nguyên như plan cũ**

(Giữ nguyên content từ plan trước)

---

## 🏆 PROJECT 4: Full-Stack E-commerce Dashboard (1.5 tuần)
**Platform**: Next.js 14 (Advanced)  
**Tại sao project này?**
- Showcase Next.js advanced features
- Server Components + Client Components mix
- Real-world complex app
- Admin dashboard (common interview task)

### Tech Stack
```yaml
Frontend:
  - Next.js 14 (App Router, Server Components)
  - TypeScript
  - Zustand (client state)
  - TanStack Table v8 (complex tables)
  - TanStack Query (data fetching)
  - React Hook Form + Zod
  - Recharts (analytics)
  - shadcn/ui + TailwindCSS

Backend:
  - Next.js API Routes
  - Prisma + PostgreSQL
  - tRPC (type-safe APIs)
  - NextAuth.js (RBAC)
  - Stripe (payments)

Features:
  - Product management (CRUD)
  - Order management
  - Customer management
  - Analytics dashboard
  - Role-based access (Admin, Manager, Staff)

Deploy:
  - Vercel
```

### Advanced Next.js Features

**1. Server Components + Client Components Mix**
```typescript
// app/dashboard/page.tsx (Server Component)
async function DashboardPage() {
  // Fetch data on server
  const stats = await prisma.order.aggregate({
    _sum: { total: true },
    _count: true,
  });
  
  return (
    <div>
      <StatsCards stats={stats} /> {/* Server Component */}
      <RevenueChart /> {/* Client Component (interactive) */}
    </div>
  );
}

// components/RevenueChart.tsx
'use client';
import { LineChart } from 'recharts';

export function RevenueChart() {
  const { data } = useQuery({
    queryKey: ['revenue'],
    queryFn: fetchRevenue,
  });
  
  return <LineChart data={data} />;
}
```

**2. Server Actions**
```typescript
// app/products/actions.ts
'use server';

export async function createProduct(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  
  const data = {
    name: formData.get('name') as string,
    price: parseFloat(formData.get('price') as string),
  };
  
  const product = await prisma.product.create({ data });
  revalidatePath('/products');
  
  return { success: true, product };
}

// app/products/new/page.tsx
'use client';
export function NewProductForm() {
  return (
    <form action={createProduct}>
      <input name="name" />
      <input name="price" type="number" />
      <button type="submit">Create</button>
    </form>
  );
}
```

**3. Parallel Routes (Dashboard Layout)**
```
app/
└── dashboard/
    ├── @analytics/
    │   └── page.tsx
    ├── @orders/
    │   └── page.tsx
    └── layout.tsx
```

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  analytics,
  orders,
}: {
  analytics: React.ReactNode;
  orders: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>{analytics}</div>
      <div>{orders}</div>
    </div>
  );
}
```

**4. Streaming with Suspense**
```typescript
import { Suspense } from 'react';

export default function OrdersPage() {
  return (
    <div>
      <h1>Orders</h1>
      
      <Suspense fallback={<TableSkeleton />}>
        <OrdersTable />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <OrdersChart />
      </Suspense>
    </div>
  );
}

async function OrdersTable() {
  const orders = await fetchOrders(); // Async Server Component
  return <Table data={orders} />;
}
```

### Learning Outcomes - Next.js Advanced

✅ **Server Components:**
- Async components
- Streaming
- Suspense boundaries
- Loading states

✅ **Data Fetching:**
- Server-side fetching
- Client-side with TanStack Query
- Revalidation strategies
- Cache management

✅ **Advanced Routing:**
- Parallel routes
- Intercepting routes
- Route handlers (API)

✅ **Performance:**
- Partial pre-rendering
- Incremental Static Regeneration
- Edge runtime
- Image optimization

---

## 📊 REVISED PORTFOLIO SUMMARY

### 4 Projects:

1. **Crypto Tracker** (React SPA + Express)
   - Master: Client-side routing, WebSocket, separate backend

2. **AI Task Manager** (React SPA + Redux Saga)
   - Master: Redux Saga, complex async flows, generators

3. **Expense Splitter** (Next.js)
   - Master: Algorithms, forms, full-stack with Next.js

4. **E-commerce Dashboard** (Next.js Advanced)
   - Master: Server Components, advanced Next.js patterns

### Tech Coverage:

**React Fundamentals:**
- ✅ React 18 (Suspense, Transitions, Concurrent)
- ✅ Hooks (all built-in + custom)
- ✅ Performance optimization
- ✅ Component patterns

**React Ecosystem:**
- ✅ React Router v6 (Projects 1, 2)
- ✅ Next.js basics (Project 3)
- ✅ Next.js advanced (Project 4)

**State Management:**
- ✅ Zustand (Projects 1, 3, 4)
- ✅ Redux Toolkit (Project 2)
- ✅ Redux Saga (Project 2)
- ✅ TanStack Query (all projects)

**Forms:**
- ✅ React Hook Form (all projects)
- ✅ Zod validation (all projects)

**Build Tools:**
- ✅ Vite (Projects 1, 2)
- ✅ Next.js (Projects 3, 4)

**Backend:**
- ✅ Express (Projects 1, 2)
- ✅ Next.js API Routes (Projects 3, 4)
- ✅ tRPC (Project 4)

---

## 🗓️ REVISED 8-Week Timeline

### **Weeks 1-2.5: Crypto Tracker (React SPA)**
- Master React Router, Vite, Express backend
- WebSocket, caching, performance

### **Weeks 3-5.5: AI Task Manager (React SPA + Redux Saga)**
- Master Redux Saga, complex side effects
- OpenAI integration, real-time

### **Weeks 6-7: Expense Splitter (Next.js)**
- Master Next.js basics, algorithms
- Quick polish project

### **Weeks 7.5-8: E-commerce Dashboard (Next.js Advanced)**
- Master Server Components, advanced patterns
- Capstone project

### **Week 8+: Polish & Apply**
- Videos, blogs, documentation
- Start applying to jobs

---

## 🎯 Bây Giờ Thỏa Mãn Chưa?

✅ **React thuần**: 2 projects (Vite + React Router)
✅ **Next.js**: 2 projects (basics + advanced)
✅ **Redux Saga**: 1 project (master side effects)
✅ **TanStack**: All projects (Query, Table, Virtual)
✅ **Separate backend**: 2 projects (Express APIs)
✅ **Full-stack**: 2 projects (Next.js monolith)

**Portfolio này showcase:**
- React fundamentals deep
- Both SPA & SSR architectures
- Complex state management (Saga)
- Modern tooling (Vite, Next.js 14)
- Real-world patterns