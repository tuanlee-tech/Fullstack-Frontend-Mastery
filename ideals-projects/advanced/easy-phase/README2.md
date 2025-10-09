## 🎯 Tech Stack Tối Ưu (Những Gì Đã Biết)

```yaml
Frontend:
  - Next.js 14 (App Router) ✅
  - React 18 ✅
  - TypeScript ✅
  - TailwindCSS ✅
  - shadcn/ui ✅

State Management:
  - Zustand (lightweight) ✅
  - Redux Toolkit (enterprise) ✅
  - TanStack Query (data fetching) ✅

Forms:
  - React Hook Form ✅
  - Zod (validation) ✅

Backend:
  - Next.js API Routes ✅
  - Node.js + Express ✅
  - Prisma ORM ✅
  - PostgreSQL ✅

Deployment:
  - Vercel (Next.js) ✅
  - Railway/Supabase (Database) ✅
```

**Perfect! Đủ để build impressive portfolio.**

---

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
**Độ khó**: 6/10 ⭐⭐⭐  
**Tại sao chọn thứ 3?**
- Quick win (đơn giản hơn)
- Algorithm showcase (debt optimization)
- Practical use case (everyone needs this)
- Polish & perfect (có thời gian làm đẹp)

### Tech Stack
```yaml
Frontend: Next.js 14 + TypeScript + Zustand
State: Zustand + React Hook Form
UI: shadcn/ui + TailwindCSS + Framer Motion
Charts: Recharts
Backend: Next.js API Routes
Database: PostgreSQL + Prisma
Auth: NextAuth.js
Deploy: Vercel
```

### Core Features (MVP)

**Week 1: Basic Split**
- [ ] Authentication
- [ ] Create group/trip
- [ ] Add members
- [ ] Add expense (who paid, amount, split method)
- [ ] View balances (who owes whom)
- [ ] Simple equal split

**Week 2: Advanced Split + Algorithm**
- [ ] Unequal split (percentages, custom amounts)
- [ ] Item-based split (restaurant bill: who ordered what)
- [ ] Debt simplification algorithm
- [ ] Expense categories (food, transport, lodging)
- [ ] Expense history & filters

**Week 3: Polish & Extra**
- [ ] Currency conversion (multi-currency support)
- [ ] Settlement suggestions (optimal payment plan)
- [ ] Receipt upload (image to OCR to expense)
- [ ] Export report (PDF)
- [ ] Beautiful animations (expense added, debt cleared)
- [ ] Mobile responsive
- [ ] Demo + Docs

### Key Technical Highlights

**1. Debt Simplification Algorithm**
```typescript
// lib/debtOptimizer.ts
interface Balance {
  userId: string;
  amount: number; // Positive = owed, Negative = owes
}

export function optimizeDebts(balances: Balance[]) {
  const creditors = balances.filter(b => b.amount > 0).sort((a, b) => b.amount - a.amount);
  const debtors = balances.filter(b => b.amount < 0).sort((a, b) => a.amount - b.amount);
  
  const transactions: { from: string; to: string; amount: number }[] = [];
  
  let i = 0, j = 0;
  
  while (i < creditors.length && j < debtors.length) {
    const credit = creditors[i].amount;
    const debt = Math.abs(debtors[j].amount);
    
    const settled = Math.min(credit, debt);
    
    transactions.push({
      from: debtors[j].userId,
      to: creditors[i].userId,
      amount: settled,
    });
    
    creditors[i].amount -= settled;
    debtors[j].amount += settled;
    
    if (creditors[i].amount === 0) i++;
    if (debtors[j].amount === 0) j++;
  }
  
  return transactions;
}

// Example:
// A paid $100, B paid $50, C paid $0, Total = $150
// Each should pay $50
// Balances: A = +50, B = 0, C = -50
// Result: C pays A $50 (1 transaction instead of 2)
```

**2. Item-based Split (Complex Form)**
```typescript
// components/ItemSplitForm.tsx
import { useFieldArray } from 'react-hook-form';

function ItemSplitForm() {
  const { control, register } = useForm({
    defaultValues: {
      items: [{ name: '', price: 0, sharedBy: [] }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.name`)} placeholder="Item name" />
          <input {...register(`items.${index}.price`)} type="number" />
          <MultiSelect
            options={members}
            value={watch(`items.${index}.sharedBy`)}
            onChange={(selected) => setValue(`items.${index}.sharedBy`, selected)}
          />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => append({ name: '', price: 0, sharedBy: [] })}>
        Add Item
      </button>
    </div>
  );
}
```

**3. Currency Conversion**
```typescript
// lib/currency.ts
const CACHE_KEY = 'exchange_rates';
const CACHE_DURATION = 3600; // 1 hour

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  if (from === to) return amount;

  // Check cache
  const cached = await redis.get(CACHE_KEY);
  let rates = cached ? JSON.parse(cached) : null;

  if (!rates) {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    rates = await response.json();
    await redis.setex(CACHE_KEY, CACHE_DURATION, JSON.stringify(rates));
  }

  const rate = rates.rates[to] / rates.rates[from];
  return amount * rate;
}
```

### Interview Talking Points
- "Implemented graph-based debt optimization reducing transactions by 60%"
- "Built complex nested forms with React Hook Form field arrays"
- "Integrated currency conversion API with Redis caching"
- "Used Zustand for simple, performant state management"
- "Implemented receipt OCR using Google Vision API"


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

## 📊 Portfolio Summary

### After 8 Weeks, Bạn Có:

**3 Live Projects:**
1. 🪙 **Crypto Tracker** - Real-time, WebSocket, Performance
2. 🤖 **AI Task Manager** - Redux, AI, Real-time collaboration
3. 💰 **Expense Splitter** - Algorithms, Complex forms

**Tech Stack Demonstrated:**
- ✅ Next.js 14 (App Router, Server Components)
- ✅ TypeScript (advanced)
- ✅ React 18 (Suspense, Transitions)
- ✅ Zustand (lightweight state)
- ✅ Redux Toolkit + RTK Query (enterprise)
- ✅ TanStack Query (data fetching)
- ✅ React Hook Form + Zod (forms)
- ✅ shadcn/ui + TailwindCSS (modern UI)
- ✅ Prisma + PostgreSQL (database)
- ✅ WebSocket + SSE (real-time)
- ✅ OpenAI API (AI integration)
- ✅ Redis (caching)
- ✅ NextAuth (authentication)

**Skills Shown:**
- ✅ Real-time systems
- ✅ Performance optimization
- ✅ Complex state management
- ✅ AI integration
- ✅ Algorithm implementation
- ✅ API design
- ✅ Database modeling
- ✅ Deployment & DevOps

---

## 📝 Deliverables Per Project

### For Each Project:

**1. GitHub Repo**
- Clean, organized code
- Proper commit history (conventional commits)
- Branches: `main`, `develop`, feature branches

**2. README.md**
```markdown
# Project Name

[Logo/Banner]

## 🎯 Overview
[1-2 sentences about the project]

## ✨ Features
- Feature 1
- Feature 2
- ...

## 🛠️ Tech Stack
- Frontend: Next.js 14, TypeScript, Redux Toolkit
- Backend: Next.js API Routes, Prisma, PostgreSQL
- ...

## 🚀 Demo
- **Live Demo**: https://...
- **Video Demo**: https://... (Loom recording)
- **Screenshots**: [Add 3-4 key screenshots]

## 📊 Technical Highlights
- Implemented X algorithm reducing Y by Z%
- Built real-time feature using WebSocket
- ...

## 🏃‍♂️ Local Setup
```bash
# Steps to run locally
```

## 📖 Architecture
[Diagram or explanation of architecture]

## 🧪 Testing
- Unit tests: XX% coverage
- E2E tests: Key user flows

## 📝 Lessons Learned
- Challenge 1 and how I solved it
- Challenge 2 and how I solved it
```

**3. Demo Video (Loom)**
- 2-3 minutes per project
- Show key features
- Explain technical decisions
- Upload to YouTube/Loom

**4. Blog Post**
- Write on dev.to or Medium
- "Building a Real-time Crypto Tracker with Next.js and WebSocket"
- Technical deep-dive on 1-2 interesting problems
- 1000-1500 words with code examples

**5. Live Demo**
- Custom domain (optional but impressive)
- Fast loading (Lighthouse 90+)
- Mobile responsive
- No bugs in happy path

---

## 🎯 Week-by-Week Plan

### **Week 1-3: Crypto Tracker**
- Days 1-2: Setup, Auth, Basic UI
- Days 3-5: API integration, Portfolio logic
- Days 6-10: Charts, WebSocket, Real-time
- Days 11-14: Performance optimization, Redis caching
- Days 15-16: Polish, Demo video, Blog post
- Day 17-21: Deploy, Test, Documentation

### **Week 4-6: AI Task Manager**
- Days 1-2: Setup, Auth, Redux setup
- Days 3-5: Task CRUD, Kanban board
- Days 6-8: AI integration (OpenAI)
- Days 9-11: Real-time updates (SSE)
- Days 12-13: Polish, Advanced features
- Days 14-17: Demo video, Blog post, Deploy

### **Week 7-8: Expense Splitter**
- Days 1-2: Setup, Auth, Group management
- Days 3-4: Basic expense split
- Days 5-6: Advanced split options
- Days 7-8: Debt optimization algorithm
- Days 9-10: Currency conversion, Categories
- Days 11-12: Polish, Animations
- Days 13-14: Demo video, Blog post, Deploy

### **Week 8 (Final Week): Portfolio Polish**
- Update personal website/portfolio
- Add all 3 projects with links
- Write summary blog post
- Update LinkedIn
- Prepare STAR stories for interviews
- Practice demo presentations

---

## 🎤 Interview Preparation

### STAR Stories (Chuẩn bị sẵn)

**1. "Tell me about a challenging technical problem"**
> **Situation**: Building the Crypto Tracker, needed to display live prices for 100+ coins without performance issues.
> 
> **Task**: Implement real-time updates via WebSocket while keeping UI responsive.
> 
> **Action**: 
> - Researched WebSocket best practices
> - Implemented connection pooling and automatic reconnection with exponential backoff
> - Used TanStack Virtual to render only visible rows
> - Added Redis caching for price data with 30-second TTL
> 
> **Result**: Reduced re-renders by 80%, achieved 60 FPS, and Lighthouse score of 92.

**2. "How do you handle complex state management?"**
> In my AI Task Manager, I used Redux Toolkit because the app had:
> - Complex state (tasks, projects, users, real-time updates)
> - Multiple data sources (API, WebSocket, optimistic updates)
> - Need for time-travel debugging
> 
> I structured state with normalized data using Entity Adapter, which made updates efficient. For API calls, I used RTK Query which handled caching and invalidation automatically, reducing boilerplate by 60%.

**3. "Describe a feature you're proud of"**
> The debt optimization algorithm in Expense Splitter. Instead of naive approach (A→B $50, A→C $30), I implemented a graph-based algorithm that minimizes transactions.
> 
> For a group of 5 people with complex expenses, it reduced from 12 transactions to 4. I used a greedy algorithm: sort creditors and debtors, match highest credit with highest debt, repeat until balanced.
> 
> Added visualization showing before/after, which users loved.

---

## 💼 Job Application Strategy

### Week 9+: Start Applying

**Resume Updates:**
```
PROJECTS

Crypto Investment Tracker | Next.js, TypeScript, Redux, WebSocket
• Built real-time cryptocurrency portfolio tracker handling 10k+ concurrent users
• Implemented WebSocket with automatic reconnection, reducing connection drops by 95%
• Optimized rendering with virtualization, achieving 60 FPS with 1000+ items
• Integrated Redis caching, reducing API calls by 85%
🔗 Live Demo | 📹 Video | 💻 GitHub

AI-Powered Task Manager | Next.js, Redux Toolkit, OpenAI API
• Developed project management tool with AI-powered task breakdown
• Implemented Redux Toolkit with RTK Query for normalized state management
• Built real-time collaboration using Server-Sent Events
• Integrated GPT-4 for intelligent task suggestions and descriptions
🔗 Live Demo | 📹 Video | 💻 GitHub

Smart Expense Splitter | Next.js, TypeScript, Algorithms
• Created expense splitting app with debt optimization algorithm
• Reduced transaction complexity from O(n²) to O(n log n) using graph theory
• Built complex forms with React Hook Form supporting nested field arrays
• Implemented multi-currency support with caching
🔗 Live Demo | 📹 Video | 💻 GitHub
```

**LinkedIn Post Template:**
```
🚀 Excited to share my latest project: [Project Name]

After 3 weeks of development, I built a [description] using:
• Next.js 14 (App Router, Server Components)
• TypeScript + Redux Toolkit
• WebSocket for real-time updates
• PostgreSQL + Prisma

Key achievements:
✅ Feature 1
✅ Feature 2
✅ Feature 3

Technical highlights:
💡 [Interesting technical challenge you solved]

Check it out:
🔗 Live demo: [link]
💻 Source code: [link]
📝 Blog post: [link]

#webdevelopment #nextjs #react #typescript
```

---

## 🎯 Success Metrics

### After 2 Months:

**Portfolio Checklist:**
- ✅ 4 live, working projects
- ✅ All projects mobile responsive
- ✅ Lighthouse scores 90+
- ✅ Comprehensive README for each
- ✅ 4 demo videos
- ✅ 4 technical blog posts
- ✅ Updated LinkedIn with projects
- ✅ Updated resume

**Applications:**
- Apply to 10-15 companies/week
- Target: Senior Frontend, Full-stack roles
- Salary expectation: 60-120M VND/month (VN), $100k-$150k (remote US)

**Interview Prep:**
- 10-15 STAR stories prepared
- Can demo all 3 projects fluently
- Can explain all technical decisions
- Practice system design (1-2 per week)
- LeetCode: 2-3 problems/week (Easy/Medium)

---

## 📚 Additional Resources

### Study alongside building:

**System Design (1-2 hours/week):**
- YouTube: ByteByteGo, System Design Interview
- Book: Designing Data-Intensive Applications (skim relevant chapters)

**Algorithms (3-4 hours/week):**
- LeetCode: 2-3 problems/week
- Focus: Arrays, Hash Tables, Two Pointers, Sliding Window
- Relate to your projects (e.g., debt optimization = graph problem)

**Interview Prep (2 hours/week):**
- Pramp.com (mock interviews)
- Record yourself explaining projects
- Practice explaining technical decisions

---

## ✅ Final Checklist

**Before First Application:**
- [ ] All 3 projects deployed and working
- [ ] All demo videos recorded
- [ ] All READMEs complete
- [ ] At least 2 blog posts published
- [ ] LinkedIn updated with projects
- [ ] Resume updated
- [ ] Personal portfolio website (optional but nice)
- [ ] 5-10 STAR stories prepared
- [ ] Can demo each project in 3 minutes
- [ ] Practice coding challenges (30-50 LeetCode problems)

---
