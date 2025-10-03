# 📘 NGÀY 3: Express.js & REST API Fundamentals

## 🎯 **MỤC TIÊU HỌC**

Sau buổi học này, bạn sẽ có thể:

1. **Master Express.js fundamentals:** Routing, middleware, request/response cycle
2. **Build production-ready REST APIs:** CRUD operations, validation, error handling
3. **Implement middleware architecture:** Authentication, logging, error handling, CORS
4. **Design RESTful endpoints:** Resource naming, HTTP methods, status codes
5. **Handle request/response:** Query params, body parsing, file uploads, streaming

---

<details>
<summary><strong>TÓM TẮT</strong></summary>

## 📚 **NỘI DUNG CHÍNH**

### **1. Express.js Fundamentals**
- Application setup & configuration
- Routing basics (GET, POST, PUT, DELETE, PATCH)
- Request & Response objects
- Middleware execution flow
- Error handling middleware

### **2. REST API Design Principles**
- RESTful resource naming conventions
- HTTP methods semantics (idempotency, safety)
- HTTP status codes (2xx, 4xx, 5xx)
- Versioning strategies (URL, header, content negotiation)
- HATEOAS principles

### **3. Middleware Architecture**
- Built-in middleware (express.json, express.static)
- Third-party middleware (cors, helmet, morgan)
- Custom middleware patterns
- Middleware order & execution
- Error handling middleware

### **4. Request Handling**
- Query parameters & route parameters
- Request body parsing (JSON, URL-encoded, multipart)
- File uploads (multer)
- Request validation (joi, express-validator)
- Content negotiation

### **5. Response Handling**
- Response formats (JSON, XML, HTML)
- Streaming responses
- File downloads
- Compression (gzip)
- Caching headers (ETag, Cache-Control)

### **6. Security Best Practices**
- CORS configuration
- Helmet security headers
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection

---

## 🔥 **CASE THỰC TẾ / SIMULATION**

### **Case Study: Shopify API Rate Limiting Incident (2020)**

**Tình huống:**  
Shopify phát hiện một số merchants bị "rate limit exceeded" errors mặc dù không vượt quá documented limits. Investigation cho thấy vấn đề nằm ở middleware order và error handling.

**Root Cause:**
```javascript
// ❌ PROBLEMATIC CODE (Shopify's simplified version)
app.use(rateLimiter);  // Rate limiter first
app.use(authenticate); // Auth second
app.use(errorHandler); // Error handler last

// Problem: Rate limiter throws error before auth
// → Anonymous requests count toward rate limit
// → Legitimate authenticated requests get blocked
```

**Vấn đề:**
1. Middleware order không tối ưu
2. Rate limiter không distinguish giữa authenticated vs anonymous
3. Error responses không consistent
4. Logging middleware đặt sai vị trí → miss critical errors

**Impact:**
- 5% merchants bị affected
- API calls fail với 429 errors
- E-commerce transactions blocked
- Support tickets tăng 300%

**Data Input:**
- Rate limit: 40 requests/second per API key
- Anonymous limit: 2 requests/second per IP
- Peak traffic: 10,000 requests/second
- Error rate spike: 5% → 15%

**Expected Behavior:**
- Authenticated requests: Higher limits, tracked by API key
- Anonymous requests: Lower limits, tracked by IP
- Clear error messages với retry-after headers
- Proper logging của all rate limit hits

---

## ✅ **GIẢI PHÁP TỐI ƯU (Step-by-Step)**

### **Solution 1: Fix Middleware Order**

```javascript
// ✅ CORRECT ORDER
app.use(helmet());           // 1. Security headers first
app.use(morgan('combined')); // 2. Logging (all requests)
app.use(cors());             // 3. CORS
app.use(express.json());     // 4. Body parsing
app.use(authenticate);       // 5. Authentication (identify user)
app.use(rateLimiter);        // 6. Rate limiting (after auth)
app.use('/api', routes);     // 7. Routes
app.use(errorHandler);       // 8. Error handler (last)
```

---

### **Solution 2: Smart Rate Limiting**

```javascript
// ✅ GOOD: Different limits for auth vs anonymous
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    if (req.user) {
      return 1000; // Authenticated: 1000 req/min
    }
    return 60; // Anonymous: 60 req/min
  },
  keyGenerator: (req) => {
    if (req.user) {
      return `user:${req.user.id}`;
    }
    return `ip:${req.ip}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: res.getHeader('Retry-After')
    });
  }
});
```

---

### **Solution 3: Consistent Error Handling**

```javascript
// ✅ GOOD: Centralized error handler
app.use((err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Send consistent error response
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: statusCode < 500 ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

---

## ⚠️ **ANTI-PATTERNS & LESSON LEARNED**

### **Anti-Pattern 1: Middleware Order Matters**

```javascript
// ❌ BAD: Error handler before routes
app.use(errorHandler);
app.use('/api', routes); // Errors in routes won't be caught!

// ✅ GOOD: Error handler last
app.use('/api', routes);
app.use(errorHandler);
```

---

### **Anti-Pattern 2: Not Calling next()**

```javascript
// ❌ BAD: Middleware doesn't call next()
app.use((req, res, next) => {
  console.log('Request received');
  // Forgot next()! Request hangs!
});

// ✅ GOOD: Always call next()
app.use((req, res, next) => {
  console.log('Request received');
  next(); // Continue to next middleware
});
```

---

### **Anti-Pattern 3: Synchronous Operations in Middleware**

```javascript
// ❌ BAD: Blocking file read
app.use((req, res, next) => {
  const config = fs.readFileSync('config.json'); // BLOCKS!
  req.config = JSON.parse(config);
  next();
});

// ✅ GOOD: Async operations
app.use(async (req, res, next) => {
  try {
    const config = await fs.promises.readFile('config.json');
    req.config = JSON.parse(config);
    next();
  } catch (error) {
    next(error);
  }
});
```

---

### **Anti-Pattern 4: Not Validating Input**

```javascript
// ❌ BAD: Trust user input
app.post('/users', (req, res) => {
  const user = await db.createUser(req.body); // SQL injection risk!
  res.json(user);
});

// ✅ GOOD: Validate input
const { body, validationResult } = require('express-validator');

app.post('/users',
  body('email').isEmail(),
  body('age').isInt({ min: 18 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Safe to use req.body
    next();
  }
);
```

---

### **Anti-Pattern 5: Exposing Stack Traces in Production**

```javascript
// ❌ BAD: Expose internal details
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack // ⚠️ Exposes server internals!
  });
});

// ✅ GOOD: Environment-aware error responses
app.use((err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.statusCode || 500).json({
    error: isDevelopment ? err.message : 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack })
  });
});
```

---

## 📝 **BÀI TẬP**

### **Level 1: Basic Express API**

**Yêu cầu:**  
Build một REST API cho blog system với các endpoints:
- `GET /posts` - List all posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

**Deliverable:**
- Express server với 5 endpoints
- In-memory data storage (array)
- Input validation
- Error handling
- README với API documentation

**Tiêu chí pass:**
- ✅ All CRUD operations work
- ✅ Returns proper HTTP status codes
- ✅ Input validation implemented
- ✅ Error responses consistent

---

### **Level 2: Middleware Pipeline**

**Yêu cầu:**  
Implement middleware pipeline cho e-commerce API:
1. Request logger (log all requests)
2. Authentication middleware (JWT)
3. Authorization middleware (role-based)
4. Request validator (Joi schemas)
5. Rate limiter (different limits per role)
6. Error handler (centralized)

**Deliverable:**
- Complete middleware stack
- JWT authentication
- Role-based authorization (admin, user, guest)
- Rate limiting (admin: 1000/min, user: 100/min, guest: 20/min)
- Comprehensive error handling

**Tiêu chí pass:**
- ✅ Middleware executes in correct order
- ✅ Authentication works with JWT
- ✅ Authorization blocks unauthorized access
- ✅ Rate limiter enforces limits
- ✅ Errors handled gracefully

---

### **Level 3: Production REST API**

**Scenario:**  
Build production-ready API cho task management system (Trello clone) với:

**Features:**
1. User management (register, login, profile)
2. Board management (CRUD)
3. List management (CRUD within boards)
4. Card management (CRUD within lists)
5. File attachments (image upload)
6. Real-time updates (webhooks)

**Requirements:**
- PostgreSQL database (Sequelize ORM)
- JWT authentication với refresh tokens
- Role-based permissions (board owner, member, viewer)
- Input validation (Joi)
- File upload (multer) với size limits
- Rate limiting (Redis-based)
- API versioning (v1)
- Swagger documentation
- Docker setup
- Unit tests (Jest)
- Integration tests (Supertest)

**Deliverable:**
1. Complete API implementation
2. Database migrations
3. Swagger/OpenAPI spec
4. Docker Compose setup
5. Test suite (80%+ coverage)
6. README với setup instructions
7. Postman collection

**Tiêu chí pass:**
- ✅ All endpoints functional
- ✅ Authentication & authorization working
- ✅ File upload with validation
- ✅ Database properly normalized
- ✅ Rate limiting functional
- ✅ 80%+ test coverage
- ✅ API documentation complete
- ✅ Docker setup works

**Bonus:**
- Implement webhooks for real-time updates
- Add full-text search (PostgreSQL FTS)
- Implement soft deletes
- Add audit trail
- Implement API analytics

---

## 📦 **DELIVERABLE TỔNG HỢP**

Repository structure:
```
day3-express-rest-api/
├── level1/
│   ├── server.js
│   ├── routes/
│   │   └── posts.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── README.md
├── level2/
│   ├── server.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── rateLimiter.js
│   │   ├── validator.js
│   │   └── logger.js
│   ├── routes/
│   └── README.md
├── level3/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── migrations/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── swagger.yaml
│   └── README.md
└── package.json
```

---

## ✅ **CHECKLIST ĐÁNH GIÁ**

### **Knowledge Check:**
- [ ] Giải thích được middleware execution flow
- [ ] Phân biệt GET, POST, PUT, PATCH, DELETE
- [ ] Hiểu HTTP status codes (2xx, 4xx, 5xx)
- [ ] Biết khi nào dùng query params vs body vs route params

### **Coding Standards:**
- [ ] Middleware order correct
- [ ] Always call next() or send response
- [ ] Centralized error handling
- [ ] Input validation on all endpoints
- [ ] Proper HTTP status codes

### **Security:**
- [ ] Helmet security headers
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input sanitization
- [ ] No sensitive data in logs

### **Best Practices:**
- [ ] RESTful naming conventions
- [ ] Consistent error responses
- [ ] API versioning
- [ ] Request/response logging
- [ ] Graceful shutdown

---

## 🎓 **TÀI NGUYÊN BỔ SUNG**

### **Định nghĩa thuật ngữ:**

1. **Middleware:**  
   - **Định nghĩa:** Functions có access đến request object (req), response object (res), và next middleware function
   - **Khi nào dùng:** Logging, authentication, validation, error handling
   - **Ví dụ:**
     ```javascript
     app.use((req, res, next) => {
       console.log(`${req.method} ${req.url}`);
       next(); // Pass control to next middleware
     });
     ```

2. **REST (Representational State Transfer):**  
   - **Định nghĩa:** Architectural style cho distributed systems, sử dụng HTTP methods để operate trên resources
   - **Principles:** Stateless, client-server, cacheable, uniform interface
   - **Resource naming:** `/users`, `/users/:id`, `/users/:id/posts`

3. **HTTP Status Codes:**  
   - **2xx (Success):** 200 OK, 201 Created, 204 No Content
   - **4xx (Client Error):** 400 Bad Request, 401 Unauthorized, 404 Not Found, 429 Too Many Requests
   - **5xx (Server Error):** 500 Internal Server Error, 503 Service Unavailable

4. **CORS (Cross-Origin Resource Sharing):**  
   - **Định nghĩa:** Mechanism cho phép web pages request resources từ different domain
   - **Khi nào dùng:** API được access từ browser trên different domain
   - **Config:**
     ```javascript
     app.use(cors({
       origin: 'https://frontend.com',
       credentials: true
     }));
     ```

5. **Idempotency:**  
   - **Định nghĩa:** Operation có thể thực hiện nhiều lần với cùng kết quả
   - **Idempotent methods:** GET, PUT, DELETE
   - **Non-idempotent:** POST

---

### **Reading Materials:**
- 📖 [Express.js Official Guide](https://expressjs.com/en/guide/routing.html)
- 📖 [REST API Best Practices](https://restfulapi.net/)
- 📖 [HTTP Status Codes Reference](https://httpstatuses.com/)
- 📹 [RESTful API Design - Best Practices](https://www.youtube.com/watch?v=qVTAB8Z2VmA)

---

</details>
# 📖 BÀI GIẢNG NGÀY 3: Express.js & REST API Fundamentals

---

## 🎬 **GIỚI THIỆU**

Chào mừng bạn đến với Ngày 3! Hôm qua chúng ta đã master async programming. Hôm nay chúng ta sẽ học cách xây dựng **production-ready REST APIs** với Express.js - framework phổ biến nhất cho Node.js backend development.

**Tại sao Express.js quan trọng?**
- 🌐 **Industry Standard:** 60%+ Node.js backends sử dụng Express
- 🚀 **Performance:** Lightweight, fast, minimal overhead
- 🔧 **Flexibility:** Unopinionated, customize theo ý muốn
- 📦 **Ecosystem:** Hàng nghìn middleware packages

**Real-world context:**  
Netflix, Uber, PayPal, IBM - tất cả đều sử dụng Express.js cho APIs của họ. Sau bài học này, bạn sẽ biết cách build APIs tương tự.

---

## 📚 **PHẦN 1: EXPRESS.JS FUNDAMENTALS**

### **1.1. What is Express.js?**

**Định nghĩa:**  
Express.js là một minimal và flexible Node.js web application framework cung cấp robust features cho web và mobile applications.

**Core concepts:**
```
┌──────────────────────────────────────────┐
│         HTTP Request                     │
└──────────────┬───────────────────────────┘
               │
        ┌──────▼──────┐
        │   Express   │
        │ Application │
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼────┐ ┌──▼────┐ ┌──▼─────┐
│Routing │ │Middleware│ │Response│
└────────┘ └─────────┘ └────────┘
```

---

### **1.2. Hello World Example**

**Simplest Express app:**

```javascript
const express = require('express');
const app = express();

// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Breaking it down:**

1. **`const app = express();`**  
   Creates an Express application instance

2. **`app.get('/', callback)`**  
   Defines a route handler for GET requests to `/`

3. **`(req, res) => {}`**  
   - `req`: Request object (contains request data)
   - `res`: Response object (methods to send response)

4. **`app.listen(PORT, callback)`**  
   Starts HTTP server on specified port

---

### **1.3. Request & Response Objects**

#### **Request Object (req)**

```javascript
app.get('/users/:id', (req, res) => {
  console.log('Request Method:', req.method);      // GET
  console.log('Request URL:', req.url);            // /users/123?sort=asc
  console.log('Request Path:', req.path);          // /users/123
  console.log('Route Params:', req.params);        // { id: '123' }
  console.log('Query Params:', req.query);         // { sort: 'asc' }
  console.log('Headers:', req.headers);            // { 'user-agent': '...' }
  console.log('IP Address:', req.ip);              // 127.0.0.1
  console.log('Body:', req.body);                  // Requires middleware!
});
```

**Common req properties:**
- `req.params` - Route parameters (`:id`, `:name`)
- `req.query` - Query string parameters (`?page=1&limit=10`)
- `req.body` - Request body (POST/PUT data)
- `req.headers` - HTTP headers
- `req.method` - HTTP method (GET, POST, etc.)
- `req.url` - Full URL path
- `req.ip` - Client IP address

---

#### **Response Object (res)**

```javascript
app.get('/api/data', (req, res) => {
  // Send JSON
  res.json({ message: 'Success', data: [1, 2, 3] });
  
  // Send plain text
  res.send('Hello World');
  
  // Send HTML
  res.send('<h1>Hello World</h1>');
  
  // Set status code
  res.status(404).json({ error: 'Not Found' });
  
  // Redirect
  res.redirect('/new-url');
  
  // Send file
  res.sendFile('/path/to/file.pdf');
  
  // Set headers
  res.set('X-Custom-Header', 'value');
  
  // Chain methods
  res
    .status(201)
    .set('Location', '/users/123')
    .json({ id: 123, name: 'John' });
});
```

**Common res methods:**
- `res.json(obj)` - Send JSON response
- `res.send(data)` - Send response (auto-detects type)
- `res.status(code)` - Set HTTP status code
- `res.redirect(url)` - Redirect to URL
- `res.sendFile(path)` - Send file
- `res.download(path)` - Prompt file download
- `res.set(header, value)` - Set header
- `res.cookie(name, value)` - Set cookie

---

### **1.4. Routing Basics**

#### **HTTP Methods**

```javascript
const express = require('express');
const app = express();

// GET - Retrieve data
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// POST - Create new resource
app.post('/users', (req, res) => {
  res.status(201).json({ id: 1, name: 'John' });
});

// PUT - Update entire resource
app.put('/users/:id', (req, res) => {
  res.json({ id: req.params.id, updated: true });
});

// PATCH - Partial update
app.patch('/users/:id', (req, res) => {
  res.json({ id: req.params.id, patched: true });
});

// DELETE - Remove resource
app.delete('/users/:id', (req, res) => {
  res.status(204).send(); // No content
});
```

---

#### **Route Parameters**

```javascript
// Single parameter
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ userId });
});

// Multiple parameters
app.get('/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  res.json({ postId, commentId });
});

// Optional parameter
app.get('/users/:id?', (req, res) => {
  if (req.params.id) {
    res.json({ user: { id: req.params.id } });
  } else {
    res.json({ users: [] }); // List all
  }
});

// Parameter with regex pattern
app.get('/users/:id(\\d+)', (req, res) => {
  // Only matches numeric IDs
  res.json({ userId: req.params.id });
});
```

---

#### **Query Parameters**

```javascript
// URL: /search?q=nodejs&limit=10&page=2
app.get('/search', (req, res) => {
  const query = req.query.q;        // 'nodejs'
  const limit = req.query.limit;    // '10'
  const page = req.query.page;      // '2'
  
  // With defaults
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  
  res.json({
    query,
    limit,
    page,
    results: []
  });
});
```

---

#### **Router Modules**

**Best practice: Organize routes in separate files**

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id });
});

router.post('/', (req, res) => {
  res.status(201).json({ created: true });
});

module.exports = router;
```

```javascript
// server.js
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

// Mount router at /api/users
app.use('/api/users', usersRouter);

// Now routes become:
// GET  /api/users
// GET  /api/users/:id
// POST /api/users
```

---

## 📚 **PHẦN 2: MIDDLEWARE ARCHITECTURE**

### **2.1. What is Middleware?**

**Định nghĩa:**  
Middleware là functions có access đến request object (req), response object (res), và next middleware function trong request-response cycle.

**Middleware Flow:**

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
             ↓               ↓               ↓
          next()         next()          res.json()
```

**Basic middleware structure:**

```javascript
function myMiddleware(req, res, next) {
  // Do something with req/res
  console.log('Middleware executed');
  
  // MUST call next() to continue or send response
  next(); // Pass control to next middleware
}

app.use(myMiddleware);
```

---

### **2.2. Types of Middleware**

#### **Application-level Middleware**

```javascript
// Executed for ALL routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Executed for specific path
app.use('/api', (req, res, next) => {
  console.log('API route accessed');
  next();
});
```

---

#### **Router-level Middleware**

```javascript
const router = express.Router();

// Middleware for this router only
router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

router.get('/users', (req, res) => {
  res.json({ users: [] });
});

app.use('/api', router);
```

---

#### **Built-in Middleware**

```javascript
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Example usage:
app.post('/users', (req, res) => {
  console.log(req.body); // Now available thanks to express.json()
  res.json(req.body);
});
```

---

#### **Third-party Middleware**

```javascript
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// HTTP request logger
app.use(morgan('combined'));

// Enable CORS
app.use(cors());

// Security headers
app.use(helmet());
```

---

#### **Error-handling Middleware**

**⚠️ MUST have 4 parameters: (err, req, res, next)**

```javascript
// Error handler MUST be defined last
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Usage: Pass errors to error handler
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error); // Forward to error handler
  }
});
```

---

### **2.3. Middleware Execution Order**

**⚠️ CRITICAL: Order matters!**

```javascript
const express = require('express');
const app = express();

// ✅ CORRECT ORDER
// 1. Security (first)
app.use(helmet());

// 2. Logging (log all requests)
app.use(morgan('combined'));

// 3. CORS (before routes)
app.use(cors());

// 4. Body parsing (before routes that need req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Custom middleware
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

// 6. Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

// 7. 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 8. Error handler (LAST)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

### **2.4. Custom Middleware Examples**

#### **Logger Middleware**

```javascript
function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}

app.use(requestLogger);
```

---

#### **Authentication Middleware**

```javascript
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  // Get token from header
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Usage: Protect routes
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

---

#### **Authorization Middleware**

```javascript
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// Usage: Restrict by role
app.delete('/api/users/:id', 
  authenticate, 
  authorize('admin'), 
  (req, res) => {
    res.json({ deleted: true });
  }
);
```

---

#### **Request Validator Middleware**

```javascript
const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('age').optional().isInt({ min: 18, max: 120 }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

app.post('/api/users', validateUser, (req, res) => {
  // req.body is validated
  res.json({ created: true });
});
```

---

#### **Rate Limiter Middleware**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all routes
app.use('/api/', limiter);

// Or specific routes
const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5
});

app.post('/api/login', strictLimiter, (req, res) => {
  // Login logic
});
```

---

## 📚 **PHẦN 3: REST API DESIGN PRINCIPLES**

### **3.1. RESTful Resource Naming**

**✅ GOOD naming conventions:**

```javascript
// Resources are NOUNS (plural)
GET    /api/users              // List users
GET    /api/users/:id          // Get single user
POST   /api/users              // Create user
PUT    /api/users/:id          // Update user (full)
PATCH  /api/users/:id          // Update user (partial)
DELETE /api/users/:id          // Delete user

// Nested resources
GET    /api/users/:id/posts    // User's posts
GET    /api/posts/:id/comments // Post's comments

// Filtering/Sorting/Pagination (query params)
GET    /api/users?role=admin&sort=name&page=2&limit=20
```

**❌ BAD naming (avoid verbs in URLs):**

```javascript
❌ GET  /api/getUsers
❌ POST /api/createUser
❌ POST /api/deleteUser
❌ GET  /api/user/get/123
```

---

### **3.2. HTTP Methods Semantics**

| Method | Purpose | Idempotent? | Safe? | Request Body? | Response Body? |
|--------|---------|-------------|-------|---------------|----------------|
| **GET** | Retrieve | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **POST** | Create | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **PUT** | Replace | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **PATCH** | Partial Update | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **DELETE** | Remove | ✅ Yes | ❌ No | ❌ No | ❌ Optional |

**Idempotent:** Multiple identical requests have same effect as single request  
**Safe:** Does not modify data

---

**Example: CRUD operations**

```javascript
const express = require('express');
const router = express.Router();

// In-memory storage (simplified)
let users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];
let nextId = 3;

// GET /users - List all users
router.get('/', (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: users.length,
      totalPages: Math.ceil(users.length / limit)
    }
  });
});

// GET /users/:id - Get single user
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// POST /users - Create user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email
  };
  
  users.push(newUser);
  
  // 201 Created with Location header
  res
    .status(201)
    .set('Location', `/api/users/${newUser.id}`)
    .json(newUser);
});

// PUT /users/:id - Replace entire user
router.put('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  // Replace entire resource
  users[index] = {
    id: parseInt(req.params.id),
    name,
    email
  };
  
  res.json(users[index]);
});

// PATCH /users/:id - Partial update
router.patch('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Update only provided fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  
  res.json(user);
});

// DELETE /users/:id - Delete user
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(index, 1);
  
  // 204 No Content (no body)
  res.status(204).send();
});

module.exports = router;
```

---

### **3.3. HTTP Status Codes**

**2xx Success:**

```javascript
// 200 OK - General success
res.status(200).json({ data: user });

// 201 Created - Resource created
res.status(201)
   .set('Location', '/api/users/123')
   .json({ id: 123, name: 'John' });

// 202 Accepted - Async operation accepted
res.status(202).json({ jobId: 'abc123', status: 'processing' });

// 204 No Content - Success with no response body
res.status(204).send();
```

---

**4xx Client Errors:**

```javascript
// 400 Bad Request - Invalid input
res.status(400).json({ 
  error: 'Validation failed',
  details: ['Email is invalid', 'Password too short']
});

// 401 Unauthorized - Authentication required
res.status(401).json({ error: 'Authentication required' });

// 403 Forbidden - Authenticated but not authorized
res.status(403).json({ error: 'Insufficient permissions' });

// 404 Not Found - Resource doesn't exist
res.status(404).json({ error: 'User not found' });

// 409 Conflict - Resource conflict (e.g., duplicate email)
res.status(409).json({ error: 'Email already exists' });

// 422 Unprocessable Entity - Validation failed
res.status(422).json({ 
  error: 'Validation failed',
  fields: {
    email: 'Invalid email format',
    age: 'Must be at least 18'
  }
});

// 429 Too Many Requests - Rate limit exceeded
res.status(429).json({ 
  error: 'Rate limit exceeded',
  retryAfter: 60
});
```

---

**5xx Server Errors:**

```javascript
// 500 Internal Server Error - Generic error
res.status(500).json({ error: 'Internal server error' });

// 503 Service Unavailable - Temporary outage
res.status(503).json({ 
  error: 'Service temporarily unavailable',
  retryAfter: 300
});

// 504 Gateway Timeout - Upstream service timeout
res.status(504).json({ error: 'Gateway timeout' });
```

---

### **3.4. API Versioning**

#### **URL Versioning (Most Common)**

```javascript
// v1 routes
app.use('/api/v1/users', usersV1Router);

// v2 routes (breaking changes)
app.use('/api/v2/users', usersV2Router);

// Usage:
// GET /api/v1/users
// GET /api/v2/users
```

---

#### **Header Versioning**

```javascript
app.use('/api/users', (req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  
  if (version === 'v1') {
    return usersV1Router(req, res, next);
  } else if (version === 'v2') {
    return usersV2Router(req, res, next);
  } else {
    res.status(400).json({ error: 'Invalid API version' });
  }
});

// Usage:
// GET /api/users
// Header: api-version: v2
```

---

#### **Content Negotiation (Accept Header)**

```javascript
app.get('/api/users', (req, res) => {
  const acceptHeader = req.headers.accept;
  
  if (acceptHeader.includes('application/vnd.api.v2+json')) {
    // Return v2 format
    res.json({ version: 'v2', users: [] });
  } else {
    // Return v1 format (default)
    res.json({ users: [] });
  }
});

// Usage:
// GET /api/users
// Header: Accept: application/vnd.api.v2+json
```

---

## 📚 **PHẦN 4: SECURITY BEST PRACTICES**

### **4.1. Helmet - Security Headers**

```javascript
const helmet = require('helmet');

// Use all default security headers
app.use(helmet());

// Or configure individually
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));

// Headers set by helmet:
// X-DNS-Prefetch-Control
// X-Frame-Options
// Strict-Transport-Security
// X-Download-Options
// X-Content-Type-Options
// X-XSS-Protection
```

---

### **4.2. CORS Configuration**

```javascript
const cors = require('cors');

// Allow all origins (development only!)
app.use(cors());

// Production: Whitelist specific origins
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Dynamic origin check
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

---

### **4.3. Input Sanitization**

```javascript
const { body, sanitize } = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Validation + Sanitization
app.post('/users',
  body('email')
    .isEmail()
    .normalizeEmail()
    .trim(),
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }),
  body('bio')
    .optional()
    .trim()
    .escape(),
  (req, res) => {
    // req.body is now sanitized
  }
);
```

---

### **4.4. Rate Limiting**

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// In-memory rate limiter (single server)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Redis-based rate limiter (multiple servers)
const redisClient = redis.createClient();

const distributedLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient
  }),
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', distributedLimiter);

// Different limits per endpoint
const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5
});

app.post('/api/login', strictLimiter, (req, res) => {
  // Login logic
});
```

---

### **4.5. SQL Injection Prevention**

```javascript
// ❌ NEVER DO THIS - SQL Injection vulnerability
app.get('/users', (req, res) => {
  const query = `SELECT * FROM users WHERE name = '${req.query.name}'`;
  // Attacker: ?name=' OR '1'='1
  db.query(query, (err, results) => {
    res.json(results);
  });
});

// ✅ USE PARAMETERIZED QUERIES
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users WHERE name = ?';
  db.query(query, [req.query.name], (err, results) => {
    res.json(results);
  });
});

// ✅ OR USE ORM (Sequelize, TypeORM)
app.get('/users', async (req, res) => {
  const users = await User.findAll({
    where: { name: req.query.name }
  });
  res.json(users);
});
```

---

## 📚 **PHẦN 5: ERROR HANDLING PATTERNS**

### **5.1. Custom Error Classes**

```javascript
// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    ```javascript
    super(message, 400);
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 404);
    this.resource = resource;
    this.id = id;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError
};
```

---

### **5.2. Centralized Error Handler**

```javascript
// middleware/errorHandler.js
const { AppError } = require('../errors/AppError');

function errorHandler(err, req, res, next) {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });
  
  // Operational errors (known errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }
  
  // Programming errors (unknown errors)
  // Don't expose details to client
  const statusCode = err.statusCode || 500;
  const message = statusCode < 500 
    ? err.message 
    : 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.message
    })
  });
}

module.exports = errorHandler;
```

---

### **5.3. Async Error Wrapper**

```javascript
// utils/asyncHandler.js
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage: Wrap async route handlers
const { NotFoundError } = require('../errors/AppError');

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User', req.params.id);
  }
  
  res.json(user);
}));

// Errors automatically caught and forwarded to error handler!
```

---

### **5.4. Validation Error Handling**

```javascript
const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../errors/AppError');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));
    
    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
};

// Usage
app.post('/users',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('age').optional().isInt({ min: 18 }).withMessage('Must be at least 18 years old')
  ],
  validate,
  asyncHandler(async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
  })
);

// Error response:
// {
//   "error": "Validation failed",
//   "errors": [
//     { "field": "email", "message": "Invalid email format", "value": "invalid-email" },
//     { "field": "password", "message": "Password must be at least 8 characters" }
//   ]
// }
```

---

## 📚 **PHẦN 6: ADVANCED FEATURES**

### **6.1. File Upload with Multer**

```javascript
const multer = require('multer');
const path = require('path');
const { AppError } = require('../errors/AppError');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400), false);
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Single file upload
app.post('/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size
  });
});

// Multiple files upload
app.post('/upload-multiple', upload.array('photos', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }
  
  res.json({
    message: `${req.files.length} files uploaded successfully`,
    files: req.files.map(f => ({
      filename: f.filename,
      path: f.path,
      size: f.size
    }))
  });
});

// Error handling for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
  }
  next(err);
});
```

---

### **6.2. Response Compression**

```javascript
const compression = require('compression');

// Enable gzip compression
app.use(compression({
  // Only compress responses larger than 1kb
  threshold: 1024,
  
  // Compression level (0-9, higher = more compression but slower)
  level: 6,
  
  // Filter: decide which responses to compress
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Example: Large JSON response gets automatically compressed
app.get('/api/large-data', (req, res) => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: 'Lorem ipsum dolor sit amet...'
  }));
  
  res.json(largeArray);
  // Response automatically compressed with gzip
  // Size: ~500KB uncompressed → ~50KB compressed
});
```

---

### **6.3. Response Caching with ETags**

```javascript
// Enable ETag generation
app.set('etag', 'strong'); // or 'weak'

app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new NotFoundError('Product', req.params.id);
  }
  
  // Set cache headers
  res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
  
  // ETag automatically generated by Express
  res.json(product);
}));

// Manual ETag implementation
const crypto = require('crypto');

app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  
  // Generate ETag based on data
  const etag = crypto
    .createHash('md5')
    .update(JSON.stringify(users))
    .digest('hex');
  
  // Check if client has cached version
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).send(); // Not Modified
  }
  
  res.set('ETag', etag);
  res.set('Cache-Control', 'public, max-age=300');
  res.json(users);
}));
```

---

### **6.4. Streaming Responses**

```javascript
const fs = require('fs');
const { pipeline } = require('stream');

// Stream large file
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'files', filename);
  
  // Check if file exists
  if (!fs.existsSync(filepath)) {
    throw new NotFoundError('File', filename);
  }
  
  // Set headers
  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${filename}"`
  });
  
  // Stream file to response
  const readStream = fs.createReadStream(filepath);
  
  pipeline(readStream, res, (err) => {
    if (err) {
      console.error('Stream error:', err);
    }
  });
});

// Stream database query results (large dataset)
app.get('/api/export/users', asyncHandler(async (req, res) => {
  res.set({
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename="users.csv"'
  });
  
  res.write('id,name,email\n'); // CSV header
  
  // Stream users from database
  const userStream = User.findAll({ stream: true });
  
  userStream.on('data', (user) => {
    res.write(`${user.id},${user.name},${user.email}\n`);
  });
  
  userStream.on('end', () => {
    res.end();
  });
  
  userStream.on('error', (err) => {
    console.error('Stream error:', err);
    res.end();
  });
}));
```

---

### **6.5. WebSocket Integration**

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// REST API endpoint
app.post('/api/messages', asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);
  
  // Emit to all connected clients
  io.emit('new-message', message);
  
  res.status(201).json(message);
}));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('send-message', (data) => {
    // Broadcast to room
    socket.to(data.roomId).emit('new-message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## 📚 **PHẦN 7: PRODUCTION-READY SETUP**

### **7.1. Environment Configuration**

```javascript
// .env (never commit this file!)
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
JWT_SECRET=super-secret-key-change-in-production
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=https://myapp.com,https://admin.myapp.com
```

```javascript
// config/index.js
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },
  redis: {
    url: process.env.REDIS_URL
  },
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || []
  }
};
```

---

### **7.2. Graceful Shutdown**

```javascript
const express = require('express');
const app = express();

let server;

// Start server
function startServer() {
  server = app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

// Graceful shutdown
function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed');
    
    // Close database connections
    database.close()
      .then(() => console.log('Database connections closed'))
      .catch(err => console.error('Error closing database:', err));
    
    // Close Redis connection
    redisClient.quit()
      .then(() => console.log('Redis connection closed'))
      .catch(err => console.error('Error closing Redis:', err));
    
    console.log('Graceful shutdown complete');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

startServer();
```

---

### **7.3. Health Check Endpoint**

```javascript
app.get('/health', asyncHandler(async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    }
  };
  
  // Check database connection
  try {
    await database.query('SELECT 1');
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'DEGRADED';
  }
  
  // Check Redis connection
  try {
    await redisClient.ping();
    health.redis = 'connected';
  } catch (error) {
    health.redis = 'disconnected';
    health.status = 'DEGRADED';
  }
  
  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
}));

// Readiness probe (for Kubernetes)
app.get('/ready', asyncHandler(async (req, res) => {
  try {
    await database.query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: error.message });
  }
}));

// Liveness probe (for Kubernetes)
app.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});
```

---

### **7.4. Request Logging**

```javascript
const morgan = require('morgan');
const winston = require('winston');

// Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Morgan with Winston
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Custom request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id
    });
  });
  
  next();
});

module.exports = logger;
```

---

## 🎯 **TÓM TẮT NGÀY 3**

### **Key Concepts Learned:**

1. **Express.js Fundamentals:**
   - Request/Response cycle
   - Routing (GET, POST, PUT, PATCH, DELETE)
   - Route parameters, query parameters, body parsing

2. **Middleware Architecture:**
   - Execution order matters
   - Application, router, error-handling middleware
   - Built-in vs third-party vs custom

3. **REST API Design:**
   - RESTful naming (resources, not verbs)
   - HTTP methods semantics
   - Status codes (2xx, 4xx, 5xx)
   - API versioning strategies

4. **Security:**
   - Helmet (security headers)
   - CORS configuration
   - Rate limiting
   - Input validation & sanitization
   - SQL injection prevention

5. **Error Handling:**
   - Custom error classes
   - Centralized error handler
   - Async error wrapper
   - Environment-aware responses

6. **Advanced Features:**
   - File uploads (Multer)
   - Response compression
   - Caching (ETags)
   - Streaming responses
   - WebSocket integration

7. **Production Setup:**
   - Environment configuration
   - Graceful shutdown
   - Health check endpoints
   - Structured logging

# 🎯 GIẢI BÀI TẬP NGÀY 3: Express.js & REST API

---

## 📝 **LEVEL 1: BASIC EXPRESS API**

### **Đề bài nhắc lại:**
Build REST API cho blog system với CRUD operations cho posts.

---

### **✅ GIẢI CHI TIẾT**

**File: `level1/server.js`**

```javascript
/**
 * Level 1: Basic Express REST API
 * Blog system with in-memory storage
 */

const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// In-memory data storage
let posts = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first post',
    author: 'John Doe',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    title: 'Second Post',
    content: 'This is the second post',
    author: 'Jane Smith',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

let nextId = 3;

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/posts - List all posts
 * Query params: ?page=1&limit=10&sort=createdAt&order=desc
 */
app.get('/api/posts', (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Sorting
    const sortBy = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    
    const sortedPosts = [...posts].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1 * order;
      if (a[sortBy] > b[sortBy]) return 1 * order;
      return 0;
    });
    
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total: posts.length,
        totalPages: Math.ceil(posts.length / limit),
        hasNext: endIndex < posts.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    });
  }
});

/**
 * GET /api/posts/:id - Get single post
 */
app.get('/api/posts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID'
      });
    }
    
    const post = posts.find(p => p.id === id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: `Post with id ${id} not found`
      });
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post'
    });
  }
});

/**
 * POST /api/posts - Create new post
 */
app.post('/api/posts', (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    // Validation
    const errors = [];
    
    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    } else if (title.length < 3) {
      errors.push('Title must be at least 3 characters');
    } else if (title.length > 100) {
      errors.push('Title must not exceed 100 characters');
    }
    
    if (!content || content.trim().length === 0) {
      errors.push('Content is required');
    } else if (content.length < 10) {
      errors.push('Content must be at least 10 characters');
    }
    
    if (!author || author.trim().length === 0) {
      errors.push('Author is required');
    } else if (author.length < 2) {
      errors.push('Author name must be at least 2 characters');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    // Create new post
    const newPost = {
      id: nextId++,
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      createdAt: new Date(),
      up

```
---
[<< Ngày 2](./Day02.md) | [Ngày 4 >>](./Day04.md)