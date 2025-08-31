# Personal Finance API Documentation

A robust TypeScript and Express-based API for managing personal finances with AI-powered insights and receipt processing capabilities.

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### 1. Register User
```http
GET /api/auth/register

Response:
{
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
    "email": "john@example.com",
    "password": "password123"
}

Response:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Management

#### 3. Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>

Response:
{
    "id": "68b33fdd626e92ca674c7734",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Transaction Management

#### 4. Get All Transactions
```http
GET /api/transactions
Authorization: Bearer <token>

Response:
[
    {
        "_id": "68b34014626e92ca674c7739",
        "user": "68b33fdd626e92ca674c7734",
        "type": "expense",
        "category": "Food",
        "amount": 50.00,
        "date": "2024-01-01T00:00:00.000Z",
        "description": "Grocery shopping",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
]
```

#### 5. Add Transaction
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "type": "expense",
    "category": "Food",
    "amount": 50.00,
    "date": "2024-01-01T00:00:00.000Z",
    "description": "Grocery shopping"
}

Response:
{
    "_id": "68b34014626e92ca674c7739",
    "user": "68b33fdd626e92ca674c7734",
    "type": "expense",
    "category": "Food",
    "amount": 50.00,
    "date": "2024-01-01T00:00:00.000Z",
    "description": "Grocery shopping",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 6. Update Transaction
```http
PUT /api/transactions/68b34014626e92ca674c7739
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "amount": 75.00,
    "description": "Updated grocery shopping"
}

Response:
{
    "message": "Transaction updated successfully",
    "transaction": {
        "_id": "68b34014626e92ca674c7739",
        "user": "68b33fdd626e92ca674c7734",
        "type": "expense",
        "category": "Food",
        "amount": 75.00,
        "date": "2024-01-01T00:00:00.000Z",
        "description": "Updated grocery shopping",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

#### 7. Delete Transaction
```http
DELETE /api/transactions/68b34014626e92ca674c7739
Authorization: Bearer <token>

Response:
{
    "message": "Transaction deleted successfully"
}
```

### Document Processing

#### 8. Upload Receipt
```http
POST /api/transactions/upload-receipt
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- receipt: <file> (Support for images and PDFs)

Response:
{
    "extractedText": "... extracted content from receipt ...",
    "suggestedCategory": "Food",
    "merchant": "Grocery Store",
    "amount": 75.00
}
```

#### 9. Upload Transaction History
```http
POST /api/transactions/upload-history
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- history: <file> (PDF format)

Response:
{
    "message": "Transaction history processed successfully",
    "transactions": [
        {
            "date": "2024-01-01",
            "description": "Transaction description",
            "amount": 50.00,
            "suggestedCategory": "Food"
        }
    ]
}
```

### Analysis

#### 10. Transaction Analysis (Gemini AI)
```http
GET /api/transactions/analysis
Authorization: Bearer <token>

Response:
{
    "trends": "Your food expenses increased by 20% compared to last month",
    "anomalies": "Unusually high spending on electronics in August",
    "suggestions": "Consider setting a budget for the Food category",
    "categoryBreakdown": {
        "Food": 45,
        "Transport": 30,
        "Entertainment": 25
    }
}
```

## Frontend Implementation Guidelines

### Recommended Features

1. **Dashboard (Home Screen)**
   - Total balance display
   - Monthly income vs expenses chart
   - Recent transactions list
   - Quick expense/income add button
   - Category-wise spending breakdown
   - Savings progress bar

2. **Transactions**
   - List view with infinite scroll
   - Calendar view option
   - Search and filters
   - Swipeable transaction cards
   - Category icons and colors
   - Transaction details modal

3. **Analytics**
   - Monthly trends chart
   - Category distribution pie chart
   - Income sources breakdown
   - Expense patterns analysis
   - Budget vs actual comparison
   - Savings rate tracker

4. **Settings & Profile**
   - User profile management
   - Custom categories setup
   - Budget limits configuration
   - Dark/Light theme toggle
   - Export transactions feature

### UI/UX Recommendations

1. **Color Scheme**
   - Primary: #2563eb (Royal Blue)
   - Success/Income: #10b981 (Emerald)
   - Danger/Expense: #ef4444 (Red)
   - Background: #f8fafc (Light) / #0f172a (Dark)
   - Text: #1e293b (Dark) / #f1f5f9 (Light)

2. **Typography**
   - Headings: Inter or SF Pro Display
   - Body: SF Pro Text or Roboto
   - Monospace (for amounts): JetBrains Mono

3. **Layout Components**
   - Card-based UI with subtle shadows
   - Bottom navigation for mobile
   - Sidebar navigation for desktop
   - Floating action buttons
   - Pull-to-refresh functionality

### Tech Stack Suggestions

1. **Core**
   - React.js with TypeScript
   - React Query for API state
   - Zustand or Redux Toolkit for global state

2. **UI Framework**
   - Tailwind CSS for styling
   - HeadlessUI for accessible components
   - Framer Motion for animations

3. **Charts**
   - Chart.js with react-chartjs-2
   - React-Victory for complex visualizations

4. **Forms & Validation**
   - React Hook Form
   - Zod for schema validation

### Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

Error responses include a message field:
```json
{
  "error": "Error message here"
}
```

## Getting Help

For API questions or issues:
1. Check the error response message
2. Review this documentation
3. Contact the backend team

Happy coding! 🚀

## License

This project is licensed under the MIT License.