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

---
[<< Ngày 2](./Day02.md) | [Ngày 4 >>](./Day04.md)