# Design Document: User Authentication

## Overview

This design implements a JSON file-based authentication system for the QRipocalypse application. The system will handle user registration and login by storing credentials securely in a `users.json` file within the `data` directory. The implementation will integrate with the existing React components (`login.jsx` and `register.jsx`) and replace the simulated authentication with real credential verification.

The authentication flow consists of:

1. **Registration**: Capture user details, hash password, validate uniqueness, store in JSON, auto-login
2. **Login**: Retrieve user data from JSON, verify hashed password, generate session token
3. **Storage**: Maintain persistent user data in structured JSON format with atomic writes

**Design Rationale**: A JSON file-based approach was chosen for simplicity and ease of deployment without requiring a database server. This is suitable for the application's current scale and provides a clear upgrade path to a database solution if needed in the future.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  React UI       │
│  (login.jsx,    │
│   register.jsx) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Service   │
│  - register()   │
│  - login()      │
│  - hashPassword │
│  - verifyHash   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Storage Layer  │
│  - readUsers()  │
│  - writeUsers() │
│  - initStorage()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  data/users.json│
└─────────────────┘
```

### Component Interaction Flow

**Registration Flow:**

```
User Input → Validate Input → Check Duplicate Email → Hash Password →
Generate User ID → Store User → Generate Token → Return Success + Auto-login
```

**Login Flow:**

```
User Input → Retrieve User by Email → Verify Hashed Password →
Update Last Login → Generate Token → Return Success + User Data
```

**Design Decision**: The authentication service acts as a facade, coordinating between validation, storage, and cryptographic operations. This separation allows each component to be tested independently and makes it easier to swap implementations (e.g., moving to a database).

## Components and Interfaces

### 1. Authentication Service (`src/services/authService.js`)

Primary service handling all authentication logic.

**Interface:**

```javascript
// Register a new user
async function register(username, email, password, confirmPassword)
  Returns: { success: boolean, token?: string, error?: string, user?: object }

  Validates:
  - Password and confirmPassword match
  - Email format is valid
  - Email is unique
  - Username is not empty

  On success:
  - Hashes password
  - Creates user record
  - Generates session token
  - Returns user data (without password)

// Login existing user
async function login(email, password)
  Returns: { success: boolean, token?: string, error?: string, user?: object }

  Validates:
  - Email exists
  - Password matches hash

  On success:
  - Updates lastLogin timestamp
  - Generates session token
  - Returns user data (without password)

// Hash password using bcrypt or similar
function hashPassword(password)
  Returns: string (hashed password)

  Uses cryptographic hashing with salt

// Verify password against hash
function verifyPassword(password, hashedPassword)
  Returns: boolean

  Compares password with stored hash

// Generate session token
function generateToken(userId, email)
  Returns: string (JWT or unique token)

  Includes user identification information
```

**Design Decision**: The service uses async/await for all operations to support asynchronous file I/O and future database migration. Password hashing uses bcrypt for security with automatic salting.

### 2. Storage Service (`src/services/storageService.js`)

Handles all file system operations for user data.

**Interface:**

```javascript
// Initialize storage (create users.json if not exists)
async function initStorage()
  Returns: { success: boolean, error?: string }

  Creates data directory and users.json with initial structure:
  { users: [], nextId: 1 }

// Read all users from JSON
async function readUsers()
  Returns: { success: boolean, users?: array, error?: string }

  Parses JSON and returns user array
  Handles corrupted file errors gracefully

// Write users to JSON
async function writeUsers(users)
  Returns: { success: boolean, error?: string }

  Writes atomically to prevent corruption
  Maintains nextId counter

// Find user by email
async function findUserByEmail(email)
  Returns: { success: boolean, user?: object, error?: string }

  Case-insensitive email search

// Add new user
async function addUser(userData)
  Returns: { success: boolean, user?: object, error?: string }

  Assigns sequential ID
  Adds timestamp
  Increments nextId counter
```

**Design Decision**: The storage layer abstracts file operations, making it easy to replace with a database adapter later. Atomic writes prevent data corruption during concurrent operations.

### 3. Updated React Components

**Login Component (`src/login.jsx`):**

- Replace simulated login with `authService.login()`
- Display specific error messages from service
- Handle loading states during async operations
- Store token in localStorage on success
- Pass token to onLogin callback

**Register Component (`src/register.jsx`):**

- Replace simulated registration with `authService.register()`
- Validate password match client-side before submission
- Display specific error messages from service
- Handle loading states during async operations
- Auto-login on successful registration (token stored in localStorage)

**Design Decision**: Minimal changes to existing UI components preserve the user experience while adding real authentication. Client-side validation provides immediate feedback before server-side validation.

## Data Models

### User Object Structure

```javascript
{
  id: number,              // Unique sequential ID (1, 2, 3, ...)
  username: string,        // User's display name
  email: string,          // Unique email address (used for login, case-insensitive)
  hashedPassword: string, // Bcrypt hashed password (never plain text)
  createdAt: string,      // ISO 8601 timestamp
  lastLogin: string       // ISO 8601 timestamp (updated on each login)
}
```

### JSON Storage Structure (`data/users.json`)

```json
{
  "users": [
    {
      "id": 1,
      "username": "Ancient_Coder",
      "email": "coder@qripocalypse.com",
      "hashedPassword": "$2b$10$...",
      "createdAt": "2025-12-03T10:30:00.000Z",
      "lastLogin": "2025-12-03T10:30:00.000Z"
    }
  ],
  "nextId": 2
}
```

**Design Decision**: Sequential IDs simplify implementation and provide predictable ordering. The nextId counter ensures uniqueness even if users are deleted. ISO 8601 timestamps provide standardized date handling.

### Authentication Response Object

```javascript
{
  success: boolean,       // Indicates operation success/failure
  token?: string,         // Session token (JWT format, present on success)
  user?: {               // User data (present on success, excludes password)
    id: number,
    username: string,
    email: string,
    createdAt: string,
    lastLogin: string
  },
  error?: string         // Error message (present on failure)
}
```

**Design Decision**: Consistent response format across all authentication operations simplifies error handling and success processing in the UI.

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated:

- Properties 2.5 and 3.3 both verify password exclusion from responses - combined into Property 5
- Properties 3.2 and 3.4 both verify no plain text storage - combined into Property 6
- Properties 1.3 and 5.1 both verify token generation - combined into Property 3

### Registration Properties

**Property 1: Valid registration creates user with hashed password**
_For any_ valid username, email, and matching password pair, registering should create a user record where the stored password is a hash (different from the input password) and the user can be retrieved by email.
**Validates: Requirements 1.1, 3.1**

**Property 2: Duplicate email rejection**
_For any_ existing user email, attempting to register a new user with the same email (regardless of case) should fail with a duplicate email error, and the user count should remain unchanged.
**Validates: Requirements 1.2**

**Property 3: Successful registration returns token and auto-authenticates**
_For any_ valid registration, the response should include success: true, a non-empty session token, and user data excluding the password.
**Validates: Requirements 1.3, 5.1, 5.2**

**Property 4: Password mismatch rejection**
_For any_ password and different confirm password, registration should fail before any storage operations occur, and no user record should be created.
**Validates: Requirements 1.4**

**Property 5: Unique ID and timestamp assignment**
_For any_ sequence of user registrations, each user should receive a unique sequential ID (strictly increasing) and a valid ISO 8601 timestamp in the createdAt field.
**Validates: Requirements 1.5, 4.5**

### Login Properties

**Property 6: Valid login generates token**
_For any_ registered user, logging in with the correct email and password should return success: true, a session token, and user data excluding the password.
**Validates: Requirements 2.1, 2.5, 3.3**

**Property 7: Invalid password rejection**
_For any_ registered user, attempting to login with an incorrect password should return success: false with an error message, and no token should be generated.
**Validates: Requirements 2.2**

**Property 8: Non-existent email rejection**
_For any_ email that does not exist in the system, login attempts should return success: false with an error message.
**Validates: Requirements 2.3**

**Property 9: Login updates timestamp**
_For any_ registered user, successfully logging in should update the lastLogin field to the current timestamp, which should be later than the previous lastLogin value.
**Validates: Requirements 2.4**

### Security Properties

**Property 10: No plain text password storage**
_For any_ user in the system, reading the users.json file should show that all password fields are hashed (contain bcrypt hash format), and no plain text passwords should ever be written to disk.
**Validates: Requirements 3.2, 3.4**

### Persistence Properties

**Property 11: Registration persistence round-trip**
_For any_ registered user, the user data written to users.json should be retrievable by reading the file, and the retrieved data should match the original (excluding password comparison, which should verify via hash).
**Validates: Requirements 4.2, 4.3**

**Property 12: ID uniqueness and sequence**
_For any_ set of users in the system, all user IDs should be unique, sequential (no gaps in the sequence), and the nextId counter should equal the highest ID plus one.
**Validates: Requirements 4.5**

### Response Format Properties

**Property 13: Failure response format**
_For any_ authentication failure (registration or login), the response should have success: false, an error field with a non-empty descriptive message, and no token or user fields.
**Validates: Requirements 6.1**

**Property 14: Success response format**
_For any_ successful authentication (registration or login), the response should have success: true, a non-empty token field, a user object with id/username/email/createdAt fields, and no error field.
**Validates: Requirements 6.2, 7.4**

**Property 15: Invalid email rejection**
_For any_ string that does not match valid email format (missing @, invalid domain, etc.), registration or login should fail with a validation error before attempting storage operations.
**Validates: Requirements 6.4**

**Property 16: Validation error specificity**
_For any_ validation failure (invalid email, password mismatch, missing fields), the error message should specifically indicate which validation failed.
**Validates: Requirements 6.5**

## Error Handling

### Error Categories

1. **Validation Errors**

   - Invalid email format
   - Password mismatch
   - Empty required fields
   - Response: `{ success: false, error: "Specific validation message" }`

2. **Authentication Errors**

   - Duplicate email on registration
   - Invalid credentials on login
   - Non-existent user
   - Response: `{ success: false, error: "Authentication failure message" }`

3. **Storage Errors**

   - File system access denied
   - Corrupted JSON data
   - Disk full
   - Response: `{ success: false, error: "Storage operation failed" }`

4. **System Errors**
   - Unexpected exceptions
   - Hashing failures
   - Response: `{ success: false, error: "System error occurred" }`

### Error Handling Strategy

**Validation Layer**: Validate all inputs before processing. Return specific error messages for each validation failure. Prevent invalid data from reaching storage layer.

**Storage Layer**: Wrap all file operations in try-catch blocks. Handle corrupted JSON gracefully by returning errors rather than crashing. Use atomic writes to prevent partial updates.

**Authentication Layer**: Catch all errors from lower layers and transform them into consistent response format. Log errors for debugging while returning user-friendly messages.

**Design Decision**: Fail fast with specific error messages helps users correct issues quickly. Consistent error response format simplifies UI error handling.

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

**Authentication Service Tests:**

- Registration with valid inputs creates user
- Registration with duplicate email fails
- Login with valid credentials succeeds
- Login with invalid password fails
- Login with non-existent email fails
- Password hashing produces different output than input
- Password verification correctly matches hashes
- Token generation produces non-empty strings

**Storage Service Tests:**

- initStorage creates file if not exists
- initStorage doesn't overwrite existing file
- readUsers returns empty array for new file
- writeUsers persists data correctly
- findUserByEmail returns correct user
- findUserByEmail is case-insensitive
- addUser assigns sequential IDs
- Corrupted JSON returns error

**Integration Tests:**

- Full registration flow from UI to storage
- Full login flow from UI to storage
- Session token storage in localStorage
- Error message display in UI

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs using a library like **fast-check** (for JavaScript/Node.js).

**Configuration**: Each property test should run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging**: Each property-based test must include a comment explicitly referencing the correctness property from this design document using the format: `// Feature: user-authentication, Property {number}: {property_text}`

**Property Test Coverage:**

- Property 1: Generate random valid usernames, emails, passwords → verify user creation with hash
- Property 2: Create user, generate random new username/password with same email → verify rejection
- Property 3: Generate random valid registration data → verify token and user data in response
- Property 4: Generate random password pairs that don't match → verify rejection
- Property 5: Generate sequence of random users → verify sequential IDs and valid timestamps
- Property 6: Create random user, login with correct credentials → verify token and user data
- Property 7: Create random user, generate random wrong password → verify rejection
- Property 8: Generate random non-existent email → verify rejection
- Property 9: Create random user, login twice → verify lastLogin updated
- Property 10: Create random users → verify all passwords in file are hashed
- Property 11: Create random user → verify round-trip read/write preserves data
- Property 12: Create random number of users → verify ID uniqueness and sequence
- Property 13: Generate random invalid inputs → verify failure response format
- Property 14: Generate random valid inputs → verify success response format
- Property 15: Generate random invalid email formats → verify rejection
- Property 16: Generate random validation failures → verify specific error messages

**Smart Generators**: Property tests should use intelligent generators that:

- Generate valid email formats (with @ and domain)
- Generate invalid email formats (missing @, invalid characters)
- Generate passwords of varying lengths
- Generate matching and non-matching password pairs
- Generate sequential user data to test ID assignment

**Design Decision**: Property-based testing complements unit tests by exploring a much larger input space, catching edge cases that might be missed in hand-written examples. The combination provides comprehensive coverage: unit tests verify specific scenarios, property tests verify general correctness.

### Test Execution Strategy

1. **Implementation-first approach**: Implement each feature before writing corresponding tests
2. **Test early**: Write property tests close to implementation to catch bugs quickly
3. **No mocking for core logic**: Test actual file operations and hashing to ensure real-world correctness
4. **Isolated test environment**: Use temporary test directories for file operations to avoid conflicts

**Testing Library**: fast-check for property-based testing, Jest or Vitest for unit testing framework.
