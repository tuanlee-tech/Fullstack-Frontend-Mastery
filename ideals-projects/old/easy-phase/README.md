# 🎯 EASY PLAN: Progressive Learning Path (Dễ → Khó)

## 📊 Chiến Lược EASY PLAN


### 📋 5 PROJECTS - PROGRESSIVE DIFFICULTY

### Độ khó tăng dần:
1. **Event Helper** (2.5/10) ⭐⭐ - Foundation
2. **Expense Splitter** (3.5/10) ⭐⭐⭐ - Algorithms
3. **Crypto Tracker** (5/10) ⭐⭐⭐ - Real-time, GraphQL
4. **Task Manager** (7/10) ⭐⭐⭐⭐ - Redux Saga, Complex state
5. **E-commerce Platform** (9/10) ⭐⭐⭐⭐⭐ - Monorepo, Micro-frontends

---

## 🌱 PROJECT 1: Event Helper (1.5 tuần)
**Độ khó**: 2.5/10 ⭐⭐  
**Mục tiêu**: Warm up, review React basics, build confidence

### Tech Stack
```yaml
Frontend:
  - Vite + React 18 + TypeScript
  - React Router v6
  - Zustand (simple state)
  - React Hook Form + Zod
  - Shadcn/ui + TailwindCSS
  - React Testing Library + Vitest

Backend:
  - Node.js + Express
  - Prisma + PostgreSQL
  - JWT authentication

Testing:
  - Vitest (unit tests)
  - React Testing Library
  - MSW (Mock Service Worker)

Deploy:
  - Netlify (frontend)
  - Railway (backend)
```

### Core Features (Simple)

**Week 1:**
- [ ] Setup project (Vite, React, Express)
- [ ] Authentication (login/register)
- [ ] Event CRUD (create, read, update, delete)
- [ ] React Router navigation
- [ ] Basic forms with validation

**Week 2:**
- [ ] Guest list (add/remove guests)
- [ ] Simple RSVP (accept/decline)
- [ ] Email invites (Resend)
- [ ] Basic tests (components, hooks)
- [ ] Deploy both frontend & backend

### Key Learning Focus

**1. React Testing Library**
```typescript
// components/EventForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventForm } from './EventForm';

describe('EventForm', () => {
  it('should validate required fields', async () => {
    render(<EventForm />);
    
    const submitButton = screen.getByRole('button', { name: /create/i });
    await userEvent.click(submitButton);
    
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<EventForm onSubmit={onSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/title/i), 'Birthday Party');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Birthday Party',
        // ...
      });
    });
  });
});
```

**2. Mock Service Worker (MSW)**
```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/events', () => {
    return HttpResponse.json([
      { id: '1', title: 'Test Event', date: '2024-01-15' }
    ]);
  }),

  http.post('/api/events', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '2', ...body }, { status: 201 });
  }),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**3. Custom Hooks Testing**
```typescript
// hooks/useEvents.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useEvents } from './useEvents';

describe('useEvents', () => {
  it('should fetch events', async () => {
    const { result } = renderHook(() => useEvents());
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].title).toBe('Test Event');
  });
});
```

### Why Start Simple?

✅ **Build Confidence:**
- Quick wins
- See project working fast
- Not overwhelmed by complexity

✅ **Review Basics:**
- React fundamentals
- Hooks patterns
- Component composition
- State management

✅ **Learn Testing:**
- Testing mindset from day 1
- TDD approach
- Confidence in code quality

### Interview Talking Points
- "Started with TDD approach, writing tests before implementation"
- "Achieved 85% test coverage using React Testing Library and MSW"
- "Learned proper testing patterns: unit tests for logic, integration for user flows"

---

## 💰 PROJECT 2: Smart Expense Splitter (1.5 tuần)
**Độ khó**: 3.5/10 ⭐⭐⭐  
**Mục tiêu**: Algorithms, forms, state management

### Tech Stack
```yaml
Frontend:
  - Vite + React 18 + TypeScript
  - React Router v6
  - Zustand
  - React Hook Form + Zod
  - Shadcn/ui + TailwindCSS
  - Recharts (charts)
  - Framer Motion (animations)

Backend:
  - Node.js + Express
  - Prisma + PostgreSQL

Testing:
  - Vitest + RTL
  - MSW

Deploy:
  - Netlify + Railway
```

### Core Features

**Week 1:**
- [ ] Group management
- [ ] Add expenses (equal split)
- [ ] View balances
- [ ] Debt simplification algorithm

**Week 2:**
- [ ] Unequal split (custom amounts, percentages)
- [ ] Item-based split
- [ ] Currency conversion
- [ ] Settlement suggestions
- [ ] Charts (expense breakdown)
- [ ] Animations on actions

### Key Learning Focus

**1. Algorithm Implementation**
```typescript
// lib/debtOptimizer.ts

/**
 * Optimizes debts using greedy algorithm
 * Time complexity: O(n log n)
 * Space complexity: O(n)
 */
export function optimizeDebts(balances: Balance[]): Transaction[] {
  // Separate creditors and debtors
  const creditors = balances
    .filter(b => b.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  
  const debtors = balances
    .filter(b => b.amount < 0)
    .sort((a, b) => a.amount - b.amount);
  
  const transactions: Transaction[] = [];
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

// Test
describe('optimizeDebts', () => {
  it('should minimize transactions', () => {
    const balances = [
      { userId: 'A', amount: 50 },  // A is owed $50
      { userId: 'B', amount: -30 }, // B owes $30
      { userId: 'C', amount: -20 }, // C owes $20
    ];
    
    const result = optimizeDebts(balances);
    
    expect(result).toHaveLength(2); // Optimal: 2 transactions
    expect(result).toEqual([
      { from: 'B', to: 'A', amount: 30 },
      { from: 'C', to: 'A', amount: 20 },
    ]);
  });
});
```

**2. Complex Forms with Field Arrays**
```typescript
// components/ItemSplitForm.tsx
import { useFieldArray, useForm } from 'react-hook-form';

type FormValues = {
  items: Array<{
    name: string;
    price: number;
    sharedBy: string[];
  }>;
};

export function ItemSplitForm() {
  const { control, register, watch } = useForm<FormValues>({
    defaultValues: {
      items: [{ name: '', price: 0, sharedBy: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const totalPerPerson = calculateSplits(items, members);

  return (
    <form>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Input {...register(`items.${index}.name`)} />
          <Input 
            type="number" 
            {...register(`items.${index}.price`, { valueAsNumber: true })} 
          />
          <MultiSelect
            value={items[index].sharedBy}
            onChange={(val) => setValue(`items.${index}.sharedBy`, val)}
            options={members}
          />
          <Button onClick={() => remove(index)}>Remove</Button>
        </div>
      ))}
      
      <Button onClick={() => append({ name: '', price: 0, sharedBy: [] })}>
        Add Item
      </Button>

      <SplitSummary splits={totalPerPerson} />
    </form>
  );
}
```

**3. Framer Motion Animations**
```typescript
// components/ExpenseCard.tsx
import { motion } from 'framer-motion';

export function ExpenseCard({ expense }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white rounded-lg shadow"
    >
      {/* content */}
    </motion.div>
  );
}

// List with stagger
export function ExpenseList({ expenses }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      initial="hidden"
      animate="show"
    >
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </motion.div>
  );
}
```

### Interview Talking Points
- "Implemented graph-based debt optimization algorithm reducing transactions by 60%"
- "Built complex nested forms handling dynamic field arrays with validation"
- "Added micro-animations improving user engagement by 40% (measured)"
- "Wrote comprehensive tests for algorithm edge cases (100% coverage)"

---

## 📊 PROJECT 3: Crypto Tracker with GraphQL (2 tuần)
**Độ khó**: 5/10 ⭐⭐⭐  
**Mục tiêu**: GraphQL, Apollo Client, Real-time, Performance

### Tech Stack
```yaml
Frontend:
  - Vite + React 18 + TypeScript
  - React Router v6
  - Apollo Client (GraphQL)
  - Zustand (local state)
  - TanStack Virtual (performance)
  - Recharts + Lightweight Charts
  - Shadcn/ui + TailwindCSS

Backend:
  - Node.js + Apollo Server
  - GraphQL (Schema-first)
  - Prisma + PostgreSQL
  - GraphQL Subscriptions (WebSocket)
  - DataLoader (N+1 problem)
  - Redis (caching)

Tools:
  - GraphQL Codegen (type generation)
  - GraphQL Yoga (alternative to Apollo Server)

Deploy:
  - Netlify + Railway
```

### GraphQL Schema
```graphql
# schema.graphql

type User {
  id: ID!
  email: String!
  portfolio: Portfolio
}

type Portfolio {
  id: ID!
  userId: ID!
  holdings: [Holding!]!
  totalValue: Float!
  totalChange24h: Float!
}

type Holding {
  id: ID!
  coin: Coin!
  amount: Float!
  averageBuyPrice: Float!
  currentValue: Float!
  profitLoss: Float!
  profitLossPercentage: Float!
}

type Coin {
  id: ID!
  symbol: String!
  name: String!
  currentPrice: Float!
  priceChange24h: Float!
  priceChangePercentage24h: Float!
  marketCap: Float!
  volume24h: Float!
  sparkline: [Float!]!
}

type Transaction {
  id: ID!
  type: TransactionType!
  coin: Coin!
  amount: Float!
  price: Float!
  total: Float!
  date: DateTime!
}

enum TransactionType {
  BUY
  SELL
}

# Queries
type Query {
  me: User!
  portfolio: Portfolio!
  holdings: [Holding!]!
  coin(id: ID!): Coin
  coins(limit: Int, offset: Int): [Coin!]!
  transactions(limit: Int, offset: Int): [Transaction!]!
  searchCoins(query: String!): [Coin!]!
}

# Mutations
type Mutation {
  addHolding(coinId: ID!, amount: Float!, buyPrice: Float!): Holding!
  updateHolding(id: ID!, amount: Float!): Holding!
  deleteHolding(id: ID!): Boolean!
  
  addTransaction(
    coinId: ID!
    type: TransactionType!
    amount: Float!
    price: Float!
  ): Transaction!
}

# Subscriptions
type Subscription {
  priceUpdated(symbols: [String!]!): PriceUpdate!
  portfolioUpdated: Portfolio!
}

type PriceUpdate {
  symbol: String!
  price: Float!
  change24h: Float!
  timestamp: DateTime!
}
```

### Backend Implementation

**1. Apollo Server Setup**
```typescript
// server.ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = app.listen(4000);

// WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

useServer({ schema }, wsServer);

// Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServer.close();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  '/graphql',
  express.json(),
  expressMiddleware(server, {
    context: createContext,
  })
);
```

**2. Resolvers with DataLoader**
```typescript
// resolvers/portfolio.ts
import DataLoader from 'dataloader';

export const portfolioResolvers = {
  Query: {
    portfolio: async (_, __, { prisma, userId }) => {
      return prisma.portfolio.findUnique({
        where: { userId },
      });
    },
  },

  Portfolio: {
    holdings: async (parent, _, { holdingsLoader }) => {
      // Use DataLoader to batch requests (solve N+1 problem)
      return holdingsLoader.load(parent.id);
    },
    
    totalValue: async (parent, _, { prisma, coinPricesCache }) => {
      const holdings = await prisma.holding.findMany({
        where: { portfolioId: parent.id },
      });
      
      let total = 0;
      for (const holding of holdings) {
        const price = await coinPricesCache.get(holding.coinId);
        total += holding.amount * price;
      }
      
      return total;
    },
  },

  Holding: {
    coin: async (parent, _, { coinsLoader }) => {
      return coinsLoader.load(parent.coinId);
    },
    
    currentValue: async (parent, _, { coinPricesCache }) => {
      const price = await coinPricesCache.get(parent.coinId);
      return parent.amount * price;
    },
    
    profitLoss: async (parent, _, { coinPricesCache }) => {
      const currentPrice = await coinPricesCache.get(parent.coinId);
      return (currentPrice - parent.averageBuyPrice) * parent.amount;
    },
  },

  Mutation: {
    addHolding: async (_, { coinId, amount, buyPrice }, { prisma, userId }) => {
      const portfolio = await prisma.portfolio.findUnique({
        where: { userId },
      });

      return prisma.holding.create({
        data: {
          portfolioId: portfolio.id,
          coinId,
          amount,
          averageBuyPrice: buyPrice,
        },
      });
    },
  },

  Subscription: {
    priceUpdated: {
      subscribe: (_, { symbols }, { pubsub }) => {
        // Subscribe to price updates for specific coins
        return pubsub.asyncIterator(symbols.map(s => `PRICE_${s}`));
      },
    },
  },
};

// DataLoader factory
export function createHoldingsLoader(prisma) {
  return new DataLoader(async (portfolioIds: string[]) => {
    const holdings = await prisma.holding.findMany({
      where: {
        portfolioId: { in: portfolioIds },
      },
    });
    
    // Group by portfolioId
    const grouped = portfolioIds.map(id =>
      holdings.filter(h => h.portfolioId === id)
    );
    
    return grouped;
  });
}
```

**3. Subscriptions**
```typescript
// services/priceUpdater.ts
import { WebSocket } from 'ws';
import { pubsub } from './pubsub';

class PriceUpdateService {
  private ws: WebSocket;

  connect() {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws');
    
    this.ws.on('open', () => {
      // Subscribe to all coins
      this.ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: ['btcusdt@ticker', 'ethusdt@ticker'],
        id: 1,
      }));
    });

    this.ws.on('message', (data) => {
      const update = JSON.parse(data.toString());
      
      // Publish to GraphQL subscription
      pubsub.publish(`PRICE_${update.s}`, {
        priceUpdated: {
          symbol: update.s,
          price: parseFloat(update.c),
          change24h: parseFloat(update.p),
          timestamp: new Date(),
        },
      });
    });
  }
}

export const priceUpdater = new PriceUpdateService();
```

### Frontend Implementation

**1. Apollo Client Setup**
```typescript
// lib/apollo.ts
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: {
      authToken: localStorage.getItem('token'),
    },
  })
);

// Split based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          coins: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});
```

**2. GraphQL Codegen**
```yaml
# codegen.yml
schema: http://localhost:4000/graphql
documents: 'src/**/*.{tsx,ts}'
generates:
  src/generated/graphql.tsx:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withComponent: false
      withHOC: false
```

**3. Using Generated Hooks**
```typescript
// components/Portfolio.tsx
import { usePortfolioQuery, useAddHoldingMutation } from '@/generated/graphql';

export function Portfolio() {
  const { data, loading, error } = usePortfolioQuery();
  const [addHolding] = useAddHoldingMutation({
    refetchQueries: ['Portfolio'], // Auto refetch
  });

  if (loading) return <Skeleton />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <h1>Portfolio Value: ${data?.portfolio.totalValue}</h1>
      
      {data?.portfolio.holdings.map(holding => (
        <HoldingCard key={holding.id} holding={holding} />
      ))}

      <AddHoldingForm onSubmit={addHolding} />
    </div>
  );
}
```

**4. Subscriptions in Component**
```typescript
// components/PriceTicker.tsx
import { usePriceUpdatedSubscription } from '@/generated/graphql';

export function PriceTicker({ symbols }: { symbols: string[] }) {
  const { data } = usePriceUpdatedSubscription({
    variables: { symbols },
  });

  useEffect(() => {
    if (data?.priceUpdated) {
      // Update local cache
      const { symbol, price } = data.priceUpdated;
      updatePriceCache(symbol, price);
    }
  }, [data]);

  return (
    <div className="flex gap-4">
      {symbols.map(symbol => (
        <LivePrice key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}
```

**5. Optimistic Updates**
```typescript
// hooks/useAddHolding.ts
import { useAddHoldingMutation } from '@/generated/graphql';

export function useAddHolding() {
  const [mutate] = useAddHoldingMutation({
    optimisticResponse: ({ coinId, amount, buyPrice }) => ({
      __typename: 'Mutation',
      addHolding: {
        __typename: 'Holding',
        id: 'temp-id',
        coinId,
        amount,
        averageBuyPrice: buyPrice,
        currentValue: amount * buyPrice,
        profitLoss: 0,
        coin: {
          __typename: 'Coin',
          id: coinId,
          symbol: 'LOADING',
          name: 'Loading...',
          currentPrice: buyPrice,
        },
      },
    }),
    
    update: (cache, { data }) => {
      cache.modify({
        fields: {
          holdings(existing = []) {
            const newHolding = cache.writeFragment({
              data: data?.addHolding,
              fragment: gql`
                fragment NewHolding on Holding {
                  id
                  amount
                  averageBuyPrice
                }
              `,
            });
            return [...existing, newHolding];
          },
        },
      });
    },
  });

  return mutate;
}
```

### Key Learning Focus

✅ **GraphQL Fundamentals:**
- Schema design
- Resolvers
- Type system
- Queries vs Mutations vs Subscriptions

✅ **Apollo Client:**
- Cache management
- Optimistic updates
- Subscriptions
- Error handling
- Pagination

✅ **Performance:**
- DataLoader (N+1 problem)
- Query batching
- Cache normalization
- Field-level caching

✅ **Code Generation:**
- GraphQL Codegen
- Type safety end-to-end
- Auto-generated hooks

### Interview Talking Points
- "Designed GraphQL schema solving N+1 queries using DataLoader, reducing API calls by 90%"
- "Implemented real-time price updates via GraphQL subscriptions with automatic reconnection"
- "Used Apollo Client cache to achieve instant UI updates with optimistic responses"
- "Set up GraphQL Codegen for end-to-end type safety, eliminating runtime type errors"

---

## 🤖 PROJECT 4: AI Task Manager (2 tuần)
**Độ khó**: 7/10 ⭐⭐⭐⭐  
**Mục tiêu**: Redux Saga, Complex state, Storybook, Advanced testing

### Tech Stack
```yaml
Frontend:
  - Vite + React 18 + TypeScript
  - React Router v6
  - Redux Toolkit + Redux Saga
  - React Hook Form + Zod
  - @dnd-kit/core
  - Shadcn/ui + TailwindCSS
  - Storybook (component documentation)

Backend:
  - Node.js + Express
  - Prisma + PostgreSQL
  - OpenAI API
  - Socket.io (real-time)

Testing:
  - Vitest + RTL
  - MSW (API mocking)
  - Playwright (E2E)
  - Storybook Test Runner

Deploy:
  - Netlify + Railway
```

### New Addition: Storybook

**1. Storybook Setup**
```typescript
// .storybook/main.ts
export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
};
```

**2. Component Stories**
```typescript
// components/TaskCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from './TaskCard';

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['TODO', 'IN_PROGRESS', 'DONE'],
    },
    priority: {
      control: 'select',
      options: ['LOW', 'MEDIUM', 'HIGH'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
  args: {
    task: {
      id: '1',
      title: 'Design homepage',
      description: 'Create mockup for new homepage',
      status: 'TODO',
      priority: 'HIGH',
    },
  },
};

export const InProgress: Story = {
  args: {
    task: {
      ...Default.args.task,
      status: 'IN_PROGRESS',
    },
  },
};

export const Completed: Story = {
  args: {
    task: {
      ...Default.args.task,
      status: 'DONE',
    },
  },
};

// Interaction test
export const WithInteraction: Story = {
  args: Default.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test click
    await userEvent.click(canvas.getByRole('button', { name: /edit/i }));
    
    // Verify
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();
  },
};
```

**3. Complex Component Stories**
```typescript
// components/KanbanBoard.stories.tsx
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { KanbanBoard } from './KanbanBoard';
import { tasksReducer } from '@/store/slices/tasksSlice';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Features/KanbanBoard',
  component: KanbanBoard,
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: { tasks: tasksReducer },
        preloadedState: {
          tasks: {
            items: [
              { id: '1', title: 'Task 1', status: 'TODO' },
              { id: '2', title: 'Task 2', status: 'IN_PROGRESS' },
            ],
          },
        },
      });
      
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

export default meta;

export const EmptyBoard: Story = {};

export const WithTasks: Story = {};

export const LoadingState: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/tasks', (req, res, ctx) => {
          return res(ctx.delay('infinite'));
        }),
      ],
    },
  },
};
```

### Redux Saga Implementation

**(Keep Redux Saga content from previous plan)**

### E2E Testing with Playwright

```typescript
// e2e/kanban.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard');
  });

  test('should create a new task', async ({ page }) => {
    // Click "Add Task" button
    await page.click('button:has-text("Add Task")');
    
    // Fill form
    await page.fill('[name="title"]', 'New Test Task');
    await page.fill('[name="description"]', 'This is a test task');
    await page.selectOption('[name="priority"]', 'HIGH');
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Verify task appears
    await expect(page.locator('text=New Test Task')).toBeVisible();
  });

  test('should drag task between columns', async ({ page }) => {
    const taskCard = page.locator('[data-task-id="1"]');
    const targetColumn = page.locator('[data-column="IN_PROGRESS"]');
    
    // Drag and drop
    await taskCard.dragTo(targetColumn);
    
    // Verify task moved
    await expect(targetColumn.locator('text=Task 1')).toBeVisible();
  });

  test('should generate AI subtasks', async ({ page }) => {
    // Open task detail
    await page.click('[data-task-id="1"]');
    
    // Click AI generate button
    await page.click('button:has-text("Generate Subtasks")');
    
    // Wait for AI response
    await page.waitForResponse(resp => 
      resp.url().includes('/api/ai/generate-subtasks') && resp.status() === 200
    );
    
    // Verify subtasks appeared
    const subtasks = page.locator('[data-testid="subtask"]');
    await expect(subtasks).toHaveCount(3);
  });

  test('should handle real-time updates', async ({ page, context }) => {
    // Open second tab (simulate another user)
    const page2 = await context.newPage();
    await page2.goto('http://localhost:3000/dashboard');
    
    // User 1 creates task
    await page.click('button:has-text("Add Task")');
    await page.fill('[name="title"]', 'Collaborative Task');
    await page.click('button:has-text("Create")');
    
    // User 2 should see the new task
    await expect(page2.locator('text=Collaborative Task')).toBeVisible({ timeout: 5000 });
  });
});
```

### Performance Testing

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test('should load dashboard within performance budget', async ({ page }) => {
  // Start performance measurement
  await page.goto('http://localhost:3000/dashboard');
  
  // Measure performance metrics
  const performanceMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    };
  });
  
  // Assert performance budgets
  expect(performanceMetrics.domContentLoaded).toBeLessThan(1000); // < 1s
  expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500); // < 1.5s
});

test('should handle 100 tasks without lag', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  
  // Measure FPS during scroll
  const fps = await page.evaluate(() => {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      
      function countFrame() {
        frames++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed < 1000) {
          requestAnimationFrame(countFrame);
        } else {
          resolve(frames);
        }
      }
      
      requestAnimationFrame(countFrame);
      
      // Trigger scroll
      window.scrollTo(0, document.body.scrollHeight);
    });
  });
  
  expect(fps).toBeGreaterThan(55); // > 55 FPS (close to 60)
});
```

### Key Learning Focus

✅ **Storybook:**
- Component documentation
- Visual testing
- Interaction testing
- Accessibility testing (a11y addon)
- Design system documentation

✅ **E2E Testing:**
- Playwright fundamentals
- User flow testing
- Real-time feature testing
- Performance testing
- Cross-browser testing

✅ **Redux Saga:**
- Complex side effects
- Generator functions
- Saga patterns (take, call, put, fork, cancel)
- Testing sagas

### Interview Talking Points
- "Built comprehensive component library with Storybook, improving developer velocity by 40%"
- "Implemented E2E tests with Playwright covering critical user journeys"
- "Used Redux Saga for complex async workflows like AI task generation with error handling"
- "Achieved 90% test coverage across unit, integration, and E2E tests"
- "Set up Storybook interaction tests catching UI bugs before production"

---

## 🏢 PROJECT 5: E-commerce Monorepo Platform (2.5 tuần)
**Độ khó**: 9/10 ⭐⭐⭐⭐⭐  
**Mục tiêu**: Monorepo, Micro-frontends, Advanced architecture

### Tech Stack
```yaml
Monorepo:
  - Turborepo (build system)
  - pnpm workspaces

Apps:
  apps/
    admin/         # Next.js 14 (Admin dashboard)
    storefront/    # Next.js 14 (Customer facing)
    mobile/        # React Native (Mobile app)

Packages:
  packages/
    ui/            # Shared React components
    config/        # Shared configs (ESLint, TS, Tailwind)
    utils/         # Shared utilities
    api-client/    # Shared API SDK
    types/         # Shared TypeScript types

Backend:
  - Node.js + Express (BFF pattern)
  - GraphQL Gateway (Apollo Federation)
  - Microservices:
    - products-service
    - orders-service
    - users-service
  - Prisma + PostgreSQL
  - Redis (cache)
  - RabbitMQ (message queue)

Deploy:
  - Vercel (Next.js apps)
  - Railway (microservices)
  - Docker + Docker Compose
```

### Monorepo Structure

```
ecommerce-platform/
├── apps/
│   ├── admin/                    # Admin dashboard
│   │   ├── app/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── storefront/               # Customer app
│   │   ├── app/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   └── mobile/                   # React Native
│       ├── src/
│       ├── app.json
│       └── package.json
│
├── packages/
│   ├── ui/                       # Shared components
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Form.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/                   # Shared configs
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── tailwind/
│   │
│   ├── utils/                    # Shared utilities
│   │   ├── src/
│   │   │   ├── formatCurrency.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── api-client/               # Shared API SDK
│   │   ├── src/
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── types/                    # Shared types
│       ├── src/
│       │   ├── Product.ts
│       │   ├── Order.ts
│       │   └── index.ts
│       └── package.json
│
├── services/                     # Backend microservices
│   ├── gateway/                  # GraphQL Gateway
│   ├── products/
│   ├── orders/
│   └── users/
│
├── turbo.json                    # Turborepo config
├── pnpm-workspace.yaml
└── package.json
```

### Turborepo Configuration

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "type-check": {
      "dependsOn": ["^type-check"],
      "outputs": []
    }
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

### Shared UI Package

```typescript
// packages/ui/src/Button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

```json
// packages/ui/package.json
{
  "name": "@acme/ui",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@acme/config": "workspace:*",
    "@types/react": "^18.2.0",
    "react": "^18.2.0",
    "tsup": "^7.2.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

### Using Shared Package

```typescript
// apps/admin/app/products/page.tsx
import { Button, Card } from '@acme/ui';
import { formatCurrency } from '@acme/utils';
import { Product } from '@acme/types';
import { productsApi } from '@acme/api-client';

export default async function ProductsPage() {
  const products = await productsApi.getAll();

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product: Product) => (
        <Card key={product.id}>
          <h3>{product.name}</h3>
          <p>{formatCurrency(product.price)}</p>
          <Button variant="primary">Edit</Button>
        </Card>
      ))}
    </div>
  );
}
```

### Micro-frontends with Module Federation

```javascript
// apps/admin/next.config.js
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'admin',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './ProductTable': './components/ProductTable',
            './OrderTable': './components/OrderTable',
          },
          shared: {
            react: { singleton: true, eager: true },
            'react-dom': { singleton: true, eager: true },
          },
        })
      );
    }
    return config;
  },
};
```

```javascript
// apps/storefront/next.config.js
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'storefront',
          remotes: {
            admin: 'admin@http://localhost:3001/static/chunks/remoteEntry.js',
          },
          shared: {
            react: { singleton: true, eager: true },
            'react-dom': { singleton: true, eager: true },
          },
        })
      );
    }
    return config;
  },
};
```

### GraphQL Federation (Microservices)

```typescript
// services/gateway/src/index.ts
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'products', url: 'http://localhost:4001/graphql' },
      { name: 'orders', url: 'http://localhost:4002/graphql' },
      { name: 'users', url: 'http://localhost:4003/graphql' },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
});

await server.start();
```

```typescript
// services/products/src/schema.ts
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
    description: String
    category: Category!
    inStock: Boolean!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Query {
    product(id: ID!): Product
    products(limit: Int, offset: Int): [Product!]!
    searchProducts(query: String!): [Product!]!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;

const resolvers = {
  Product: {
    __resolveReference(ref, { dataSources }) {
      return dataSources.productsAPI.getProduct(ref.id);
    },
  },
  Query: {
    product: (_, { id }, { dataSources }) => {
      return dataSources.productsAPI.getProduct(id);
    },
    products: (_, { limit, offset }, { dataSources }) => {
      return dataSources.productsAPI.getProducts(limit, offset);
    },
  },
};

export const schema = buildSubgraphSchema({ typeDefs, resolvers });
```

### Docker Setup

```dockerfile
# apps/admin/Dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm turbo build --filter=admin

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /app/apps/admin/public ./apps/admin/public

EXPOSE 3000
CMD ["node", "apps/admin/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"

  gateway:
    build:
      context: .
      dockerfile: services/gateway/Dockerfile
    ports:
      - "4000:4000"
    depends_on:
      - products-service
      - orders-service

  products-service:
    build:
      context: .
      dockerfile: services/products/Dockerfile
    ports:
      - "4001:4001"
    depends_on:
      - postgres
      - redis

  orders-service:
    build:
      context: .
      dockerfile: services/orders/Dockerfile
    ports:
      - "4002:4002"
    depends_on:
      - postgres
      - rabbitmq

  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://gateway:4000

  storefront:
    build:
      context: .
      dockerfile: apps/storefront/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://gateway:4000
```

### Key Learning Focus

✅ **Monorepo:**
- Turborepo build system
- pnpm workspaces
- Shared packages
- Dependency management
- Build caching

✅ **Micro-frontends:**
- Module Federation
- Independent deployments
- Shared components
- Version management

✅ **Microservices:**
- GraphQL Federation
- Service communication
- Message queues (RabbitMQ)
- API Gateway pattern

✅ **DevOps:**
- Docker containers
- Docker Compose
- Multi-stage builds
- CI/CD pipelines

### Commands

```bash
# Install dependencies
pnpm install

# Dev - run all apps
pnpm turbo dev

# Dev - specific app
pnpm turbo dev --filter=admin

# Build all
pnpm turbo build

# Build specific app
pnpm turbo build --filter=storefront

# Test all
pnpm turbo test

# Lint all
pnpm turbo lint

# Type check all
pnpm turbo type-check

# Add dependency to specific package
pnpm add react-query --filter=@acme/api-client

# Docker
docker-compose up -d
```

### Interview Talking Points
- "Architected monorepo with Turborepo managing 3 apps and 5 shared packages"
- "Implemented micro-frontends using Module Federation for independent team deployments"
- "Built microservices architecture with GraphQL Federation connecting 3 services"
- "Set up Docker multi-stage builds reducing image size by 70%"
- "Optimized build times with Turborepo caching, reducing CI time from 15min to 3min"
- "Shared UI component library across web and mobile apps using @acme/ui package"

---

## 🎯 EASY PLAN SUMMARY

### 8-Week Timeline

**Week 1-1.5: Project 1 (Event Helper)** ⭐⭐
- Foundation, Testing, Build confidence

**Week 2-3: Project 2 (Expense Splitter)** ⭐⭐⭐
- Algorithms, Forms, Animations

**Week 3.5-5.5: Project 3 (Crypto + GraphQL)** ⭐⭐⭐
- GraphQL, Apollo, Real-time, Performance

**Week 6-8: Project 4 (Task Manager)** ⭐⭐⭐⭐
- Redux Saga, Storybook, E2E Testing

**Week 8.5-11: Project 5 (E-commerce Monorepo)** ⭐⭐⭐⭐⭐
- Monorepo, Micro-frontends, Microservices

---

## 📊 Tech Coverage - EASY PLAN

### Frameworks
- ✅ React 18 (5 projects)
- ✅ Next.js 14 (2 projects)
- ✅ React Native (1 project)
- ✅ Vite (4 projects)

### State Management
- ✅ Zustand (3 projects)
- ✅ Redux Toolkit + Saga (1 project)
- ✅ Apollo Client (1 project)

### Backend
- ✅ Express (4 projects)
- ✅ GraphQL + Apollo Server (1 project)
- ✅ Microservices (1 project)

### Advanced
- ✅ GraphQL (queries, mutations, subscriptions)
- ✅ Apollo Client (cache, optimistic updates)
- ✅ Redux Saga (side effects)
- ✅ Storybook (component docs)
- ✅ Playwright (E2E testing)
- ✅ Turborepo (monorepo)
- ✅ Module Federation (micro-frontends)
- ✅ Docker (containerization)

### Testing
- ✅ Vitest + RTL (all projects)
- ✅ MSW (API mocking)
- ✅ Storybook Testing
- ✅ Playwright E2E
- ✅ Performance testing

---

## 💼 After EASY PLAN, Bạn Có

**Portfolio:**
- 5 projects (simple → complex)
- All deployed with demos
- Comprehensive documentation
- Test coverage 80%+

**Skills:**
- ✅ React mastery (hooks, performance, patterns)
- ✅ GraphQL full-stack
- ✅ Redux Saga (complex async)
- ✅ Monorepo architecture
- ✅ Micro-frontends
- ✅ Microservices basics
- ✅ Testing (unit, integration, E2E)
- ✅ Storybook documentation
- ✅ Docker & DevOps

**Interview Ready:**
- Senior Frontend Engineer
- Senior Full-stack Engineer
- Tech Lead
- Solutions Architect

---