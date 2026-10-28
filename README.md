# Support Desk System

A full-stack customer support desk application for managing support tickets, assigning agents, communicating with customers, tracking activity, and monitoring service performance.

## Overview

This project was built as a practical full-stack engineering assessment.

The system allows a support team to:

- Create and manage customer-support tickets
- Assign tickets to support agents
- Track ticket status and priority
- Add public replies and internal notes
- Search, filter, and sort tickets
- View ticket activity history
- Monitor support metrics from a dashboard
- Authenticate users with JWT-based login
- Enforce basic role-based permissions between Admin and Agent users

The implementation focuses on the required end-to-end ticket workflow rather than optional visual or feature-heavy additions.

---

## Core Features

### Authentication

- JWT-based authentication
- Login/logout flow
- Protected API routes
- Authentication state managed on the frontend with Redux
- User information persisted across page refreshes
- Role-aware frontend behaviour

### User Roles

The application supports two basic roles:

#### Admin

An Admin can:

- View tickets
- Create tickets
- Update ticket information
- Assign tickets to agents
- Change ticket status
- Change ticket priority
- Add public replies
- Add internal notes
- View ticket history
- Access dashboard statistics

#### Agent

An Agent can:

- View assigned/available tickets according to the application rules
- View ticket details
- Update ticket status and priority where permitted
- Add public replies
- Add internal notes
- View ticket activity history

The role distinction is intentionally simple because the assessment only requires a basic permission rule rather than a complex permission-management system.

---

## Ticket Management

Each ticket contains information such as:

- Subject
- Customer name/email
- Description
- Priority
- Status
- Assigned agent
- Created timestamp
- Last updated timestamp

### Supported Statuses

- Open
- In Progress
- Waiting on Customer
- Resolved

### Supported Priorities

- Low
- Medium
- High
- Urgent

### Ticket Operations

Users can:

- Create tickets
- View the ticket list
- Open a ticket detail page
- Edit ticket fields
- Assign a ticket to an agent
- Change status
- Change priority
- Add replies
- Add internal notes
- View chronological activity history

---

## Replies and Internal Notes

The ticket detail page separates communication into two types:

### Public Reply

A public reply represents a response intended for the customer.

It is stored with:

- Content
- Author
- Timestamp
- Public visibility

### Internal Note

An internal note is intended only for the support team.

It is stored separately from public communication and is visually distinguished in the interface to reduce accidental confusion.

Internal notes are not customer-facing.

---

## Search, Filtering and Sorting

The ticket list supports:

- Search by ticket subject
- Search by customer name/email
- Filter by status
- Filter by priority
- Multiple filters at the same time
- Sort by most recently updated
- Sort by priority

---

## Activity History

Important ticket events are recorded, including:

- Ticket creation
- Assignment changes
- Status changes
- Priority changes
- Replies
- Internal notes

The ticket detail page displays these events chronologically.

This provides an audit trail for understanding what happened to a ticket and when.

---

## Business Rules

### Required Fields

A ticket requires:

- Subject
- Customer identifier (name or email)
- Description

Validation is performed on both the frontend and backend where appropriate.

### Overdue Tickets

A ticket is considered overdue when:

- It is not resolved
- Its creation time is more than 24 hours in the past

The dashboard uses this rule to calculate overdue tickets.

### Resolution

A resolved ticket should not remain in:

- Open
- In Progress
- Waiting on Customer
- Overdue

### History

Important changes are recorded as ticket activity events.

### Persistence

Tickets, replies, notes, users, and activity information are persisted in the database.

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- JavaScript
- CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- JavaScript ES Modules

### Authentication

- JSON Web Tokens
- Access-token based authentication
- HTTP-only cookie support where configured
- Authorization header support

---

## Project Structure

```text
support-desk/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── .env
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   │
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Environment Variables

Create a `.env` file inside the backend.

Example:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/support-desk

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:5173
```

Create a `.env` file inside the frontend.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Do not commit real secrets to Git.

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd support-desk
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment variables

Create:

```text
server/.env
```

and add the required MongoDB and JWT configuration.

### 4. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 5. Configure frontend environment variables

Create:

```text
client/.env
```

and configure:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Running the Application

### Start Backend

From `server`:

```bash
npm run dev
```

The API should start on:

```text
http://localhost:5000
```

### Start Frontend

From `client`:

```bash
npm run dev
```

Vite should provide a local URL similar to:

```text
http://localhost:5173
```

Open that URL in the browser.

---

## Authentication Flow

The application uses JWT authentication.

The general flow is:

```text
Login
  ↓
Backend validates credentials
  ↓
JWT access token generated
  ↓
Frontend stores authentication state in Redux
  ↓
Protected API requests include authentication
  ↓
Backend middleware verifies JWT
  ↓
req.user is populated
  ↓
Controller handles the request
```

The backend authentication middleware follows the same general pattern used in the project:

```js
const token =
  req.cookies?.accessToken ||
  req.header("Authorization")?.replace("Bearer ", "");
```

The JWT is verified using the configured access-token secret, and the corresponding user is loaded from MongoDB.

---

## API Structure

The API is organized around resources rather than putting all application logic into a single route.

Typical route groups include:

```text
/api/auth
/api/users
/api/tickets
/api/dashboard
```

### Authentication

Typical operations:

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Tickets

Typical operations:

```text
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PATCH  /api/tickets/:id
DELETE /api/tickets/:id
```

Additional ticket operations handle:

```text
Assignment
Replies
Internal notes
Status changes
Priority changes
```

The exact endpoint paths should be checked against the implementation in `server/src/routes`.

---

## Frontend Architecture

The frontend is divided into reusable responsibilities rather than putting the complete application inside a single component.

### Components

Reusable UI elements such as:

- Navbar
- Sidebar
- Ticket cards
- Ticket table
- Status badge
- Priority badge
- Forms
- Modals
- Loading states
- Error states

### Pages

Page-level components handle application screens such as:

- Login
- Dashboard
- Tickets
- Ticket details
- Create ticket
- Profile/agent-related screens

### Redux

Redux Toolkit is used for application state.

Typical state responsibilities include:

```text
Authentication
Current user
Tickets
Selected ticket
Dashboard statistics
Loading states
API errors
```

The purpose of Redux is to avoid passing authentication and ticket state through many unrelated component layers.

---

## Testing the Application

The application should be tested from the frontend as well as through direct API requests.

### 1. Login Test

Open the frontend and log in using a valid account.

Verify:

- Invalid credentials show an error
- Valid credentials redirect to the application
- Protected pages cannot be accessed while logged out
- User information is available after login
- Refreshing the page does not incorrectly log the user out when the configured authentication mechanism supports session restoration

---

### 2. Create Ticket Test

From the frontend:

1. Open the ticket creation page.
2. Enter a subject.
3. Enter customer name/email.
4. Enter description.
5. Select priority.
6. Submit.

Verify:

- Required fields are validated
- Ticket is created successfully
- Ticket appears in the ticket list
- Ticket has the correct initial status
- Creation time is stored

---

### 3. Assign Agent Test

Login as an Admin.

Open a ticket and assign an available Agent.

Verify:

- Agent appears in the assignment selector
- Ticket shows the assigned agent
- Assignment persists after refresh
- Assignment appears in activity history

Then login as the Agent and verify the ticket is visible according to the application's agent-access rules.

---

### 4. Status Test

Change a ticket through:

```text
Open
↓
In Progress
↓
Waiting on Customer
↓
Resolved
```

Verify:

- Status changes are saved
- UI updates immediately after successful API response
- Activity history records the status change
- Resolved tickets are not treated as overdue

---

### 5. Priority Test

Change priority between:

```text
Low
Medium
High
Urgent
```

Verify:

- Priority persists after refresh
- Ticket list reflects the new priority
- Activity history records the change

---

### 6. Public Reply Test

Open a ticket and add a public reply.

Verify:

- Reply is displayed in the ticket conversation
- Author is displayed
- Timestamp is displayed
- It is visually different from internal notes where applicable
- The reply is persisted after refreshing the page

A public reply is customer-facing. It is not the same thing as an internal note.

---

### 7. Internal Note Test

Add an internal note to a ticket.

Verify:

- It appears in the ticket activity/conversation view
- It is clearly labelled as an internal note
- Author and timestamp are displayed
- It remains distinct from public replies

---

### 8. Search Test

Search using:

- Ticket subject
- Customer name
- Customer email

Verify that matching tickets are returned and unrelated tickets are excluded.

---

### 9. Filter Test

Test:

```text
Status
Priority
```

Then combine them.

For example:

```text
Status = Open
Priority = Urgent
```

Verify that the result satisfies both filters.

---

### 10. Sorting Test

Test:

```text
Recently Updated
Priority
```

Verify that the displayed ordering changes correctly.

---

### 11. Dashboard Test

Verify that dashboard statistics are calculated from stored tickets rather than hardcoded values.

Check:

- Total tickets
- Open tickets
- In-progress tickets
- Resolved tickets
- Urgent tickets
- Overdue tickets

Create or update tickets and return to the dashboard to confirm the numbers change accordingly.

---

### 12. Overdue Ticket Test

The business rule defines an overdue ticket as a ticket that:

```text
is not Resolved
AND
was created more than 24 hours ago
```

To test this properly, create or modify test data so that a non-resolved ticket has a creation time older than 24 hours.

Verify:

- It appears in overdue statistics
- Resolving the ticket removes it from overdue statistics

---

### 13. Permission Test

Test the application using both roles.

#### Admin

Verify that an Admin can perform administrative actions such as assigning tickets.

#### Agent

Verify that an Agent cannot perform actions restricted to Admins.

Do not rely only on hiding a button in React. The backend must also enforce the permission because frontend restrictions can be bypassed.

---

## Recommended Manual Test Flow

For the fastest end-to-end assessment demonstration:

```text
1. Login as Admin
        ↓
2. Create a ticket
        ↓
3. Assign an Agent
        ↓
4. Change priority to Urgent
        ↓
5. Change status to In Progress
        ↓
6. Add a public reply
        ↓
7. Add an internal note
        ↓
8. Open activity history
        ↓
9. Search for the ticket
        ↓
10. Filter by status/priority
        ↓
11. Check dashboard statistics
        ↓
12. Login as Agent
        ↓
13. Open assigned ticket
        ↓
14. Add a reply/note
        ↓
15. Resolve the ticket
        ↓
16. Return to dashboard
```

This demonstrates most of the required workflow in a single run.

---

## API Testing

The backend can also be tested independently using Postman, Thunder Client, or another API client.

A useful testing order is:

```text
1. Register/create users
2. Login
3. Obtain authentication token/session
4. Create ticket
5. List tickets
6. Get ticket by ID
7. Assign agent
8. Update status
9. Update priority
10. Add public reply
11. Add internal note
12. Get ticket history
13. Get dashboard statistics
```

When testing protected endpoints manually, provide the access token using either the configured cookie mechanism or:

```http
Authorization: Bearer <access-token>
```

---

## Error Handling

The application should handle common failures gracefully.

Examples include:

- Invalid login credentials
- Missing required fields
- Invalid ticket ID
- Ticket not found
- Unauthorized request
- Forbidden role/action
- Duplicate email
- Database failure
- Invalid request body
- Missing authentication token

The frontend should display a useful error state instead of silently failing.

---

## Data Integrity

The backend is responsible for maintaining valid relationships between:

```text
User
 ↓
Ticket
 ↓
Replies
 ↓
Internal Notes
 ↓
Activity History
```

A ticket should not reference a non-existent assigned agent.

Ticket-related records should not be left orphaned when the application performs deletion or uses a deletion policy.

---

## Security Notes

- Passwords are hashed using bcrypt.
- JWT secrets are stored in environment variables.
- Authentication is enforced on protected backend routes.
- Role permissions are enforced server-side.
- Secrets and credentials should not be committed to Git.
- User input should be validated before being persisted.
- The frontend should never be treated as the security boundary.

---

## Development Principles

The project follows a few basic engineering principles:

- Keep controllers focused on request handling.
- Keep database models responsible for persistence rules.
- Keep reusable business logic in services/utils where appropriate.
- Keep authentication in middleware.
- Keep frontend state management in Redux slices.
- Reuse UI components instead of duplicating large blocks of JSX.
- Validate important data on the backend even when frontend validation exists.
- Handle loading, empty, success, and error states explicitly.

---

## Optional Features

The assessment lists several optional stretch goals. They should only be implemented after the required ticket workflow is complete.

Possible additions include:

- Pagination
- Configurable SLA targets
- SLA breach indicators
- Additional automated tests
- More granular role permissions
- Improved analytics
- Demo account setup

The core requirements should remain the priority.

---

## Assessment Coverage

The implementation is designed around the assessment's primary evaluation areas:

| Evaluation Area | Implementation |
|---|---|
| Functional correctness | End-to-end ticket workflow |
| Backend and data modelling | Express + MongoDB + Mongoose |
| Problem solving | Validation, business rules, error handling |
| Frontend and usability | React interface with loading/error/empty states |
| Code quality | Modular controllers, routes, models and components |
| Testing and reliability | API and frontend test workflow |
| Authentication | JWT-based login and protected routes |

---

## Submission Checklist

Before submitting the project, verify:

- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] MongoDB connection works
- [ ] `.env` is configured locally
- [ ] `.env` is not committed
- [ ] Login works
- [ ] Protected routes work
- [ ] Admin/Agent permissions work
- [ ] Tickets can be created
- [ ] Tickets can be edited
- [ ] Tickets can be assigned
- [ ] Status changes work
- [ ] Priority changes work
- [ ] Public replies work
- [ ] Internal notes work
- [ ] Activity history works
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Dashboard values are calculated from database data
- [ ] Overdue calculation works
- [ ] Error states are handled
- [ ] README contains setup instructions
- [ ] No secrets are committed
- [ ] Project can be demonstrated from the frontend

---

## Demo Accounts

If demo accounts are included, document them here.

```text
Admin:
Email: admin@support.com
Password: admin123

Agent:
Email: Kuldeep@gmail.com
Password: Kuldeep@2026
```

Do not commit real production credentials to the repository.

---

## Notes

This README describes the intended architecture and testing workflow for the Support Desk System. Endpoint names, folder names, and environment-variable names should match the final submitted implementation.

The assessment prioritizes a complete, reliable core ticket workflow over optional features or excessive visual polish.
