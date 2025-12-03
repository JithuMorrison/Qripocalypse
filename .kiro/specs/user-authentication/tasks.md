# Implementation Plan

- [ ] 1. Set up project structure and dependencies

  - Create `src/services` directory for authentication and storage services
  - Install bcryptjs for password hashing
  - Install jsonwebtoken for token generation
  - Install fast-check for property-based testing
  - _Requirements: 3.1, 5.1_

- [ ] 2. Implement Storage Service

  - Create `src/services/storageService.js` with file operations
  - Implement `initStorage()` to create users.json with initial structure
  - Implement `readUsers()` to parse and return user array
  - Implement `writeUsers()` with atomic write operations
  - Implement `findUserByEmail()` with case-insensitive search
  - Implement `addUser()` with sequential ID assignment
  - Handle corrupted JSON gracefully with error responses
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]\* 2.1 Write property test for storage persistence

  - **Property 11: Registration persistence round-trip**
  - **Validates: Requirements 4.2, 4.3**

- [ ]\* 2.2 Write property test for ID uniqueness

  - **Property 12: ID uniqueness and sequence**
  - **Validates: Requirements 4.5**

- [ ]\* 2.3 Write unit tests for storage service

  - Test initStorage creates file if not exists
  - Test readUsers returns empty array for new file
  - Test writeUsers persists data correctly
  - Test findUserByEmail is case-insensitive
  - Test addUser assigns sequential IDs
  - Test corrupted JSON returns error
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 3. Implement Authentication Service core functions

  - Create `src/services/authService.js`
  - Implement `hashPassword()` using bcryptjs with salt
  - Implement `verifyPassword()` to compare password with hash
  - Implement `generateToken()` using JWT with user ID and email
  - _Requirements: 3.1, 3.2, 5.1, 5.2_

- [ ]\* 3.1 Write property test for password hashing

  - **Property 1: Valid registration creates user with hashed password**
  - **Validates: Requirements 1.1, 3.1**

- [ ]\* 3.2 Write property test for no plain text storage

  - **Property 10: No plain text password storage**
  - **Validates: Requirements 3.2, 3.4**

- [ ]\* 3.3 Write unit tests for core authentication functions

  - Test hashPassword produces different output than input
  - Test verifyPassword correctly matches hashes
  - Test generateToken produces non-empty strings
  - _Requirements: 3.1, 3.2, 5.1_

- [ ] 4. Implement user registration

  - Implement `register(username, email, password, confirmPassword)` function
  - Validate password and confirmPassword match
  - Validate email format using regex
  - Check for duplicate email using findUserByEmail
  - Hash password before storage
  - Create user record with sequential ID and timestamp
  - Store user via addUser
  - Generate session token
  - Return success response with token and user data (excluding password)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]\* 4.1 Write property test for duplicate email rejection

  - **Property 2: Duplicate email rejection**
  - **Validates: Requirements 1.2**

- [ ]\* 4.2 Write property test for registration token generation

  - **Property 3: Successful registration returns token and auto-authenticates**
  - **Validates: Requirements 1.3, 5.1, 5.2**

- [ ]\* 4.3 Write property test for password mismatch

  - **Property 4: Password mismatch rejection**
  - **Validates: Requirements 1.4**

- [ ]\* 4.4 Write property test for ID and timestamp assignment

  - **Property 5: Unique ID and timestamp assignment**
  - **Validates: Requirements 1.5, 4.5**

- [ ]\* 4.5 Write property test for invalid email rejection

  - **Property 15: Invalid email rejection**
  - **Validates: Requirements 6.4**

- [ ]\* 4.6 Write unit tests for registration

  - Test registration with valid inputs creates user
  - Test registration with duplicate email fails
  - _Requirements: 1.1, 1.2_

- [ ] 5. Implement user login

  - Implement `login(email, password)` function
  - Retrieve user by email using findUserByEmail
  - Return error if user not found
  - Verify password using verifyPassword
  - Return error if password incorrect
  - Update lastLogin timestamp
  - Generate session token
  - Return success response with token and user data (excluding password)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]\* 5.1 Write property test for valid login

  - **Property 6: Valid login generates token**
  - **Validates: Requirements 2.1, 2.5, 3.3**

- [ ]\* 5.2 Write property test for invalid password

  - **Property 7: Invalid password rejection**
  - **Validates: Requirements 2.2**

- [ ]\* 5.3 Write property test for non-existent email

  - **Property 8: Non-existent email rejection**
  - **Validates: Requirements 2.3**

- [ ]\* 5.4 Write property test for timestamp update

  - **Property 9: Login updates timestamp**
  - **Validates: Requirements 2.4**

- [ ]\* 5.5 Write unit tests for login

  - Test login with valid credentials succeeds
  - Test login with invalid password fails
  - Test login with non-existent email fails
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 6. Implement error handling and validation

  - Add email format validation function
  - Add input validation for empty fields
  - Implement consistent error response format
  - Add specific error messages for each validation failure
  - Wrap storage operations in try-catch blocks
  - Handle file system errors gracefully
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]\* 6.1 Write property test for failure response format

  - **Property 13: Failure response format**
  - **Validates: Requirements 6.1**

- [ ]\* 6.2 Write property test for success response format

  - **Property 14: Success response format**
  - **Validates: Requirements 6.2, 7.4**

- [ ]\* 6.3 Write property test for validation error specificity

  - **Property 16: Validation error specificity**
  - **Validates: Requirements 6.5**

- [ ] 7. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Integrate with Login component

  - Import authService in `src/login.jsx`
  - Replace simulated login with `authService.login(email, password)`
  - Handle loading state during async operation
  - Display error messages from service response
  - Store token in localStorage on success
  - Call onLogin callback with token
  - _Requirements: 7.1, 7.3, 7.4_

- [ ]\* 8.1 Write integration test for login flow

  - Test full login flow from UI to storage
  - Test error message display in UI
  - Test token storage in localStorage
  - _Requirements: 7.1, 7.4_

- [ ] 9. Integrate with Register component

  - Import authService in `src/register.jsx`
  - Replace simulated registration with `authService.register(username, email, password, confirmPassword)`
  - Add client-side password match validation
  - Handle loading state during async operation
  - Display error messages from service response
  - Store token in localStorage on success
  - Call onLogin callback with token for auto-login
  - _Requirements: 7.2, 7.3, 7.4_

- [ ]\* 9.1 Write integration test for registration flow

  - Test full registration flow from UI to storage
  - Test auto-login after registration
  - Test error message display in UI
  - _Requirements: 7.2, 7.4_

- [ ] 10. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
