import { findUserByEmail, addUser, readUsers, writeUsers } from './storageService.jsx';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Hash a password using Web Crypto API (browser-compatible)
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} Hashed password in format: salt:hash
 */
export async function hashPassword(password) {
  try {
    // Generate a random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Convert password to bytes
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    
    // Import the password as a key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    // Derive a key using PBKDF2
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    // Convert to hex strings
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${saltHex}:${hashHex}`;
  } catch (error) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
}

/**
 * Verify a password against a stored hash
 * @param {string} password - Plain text password to verify
 * @param {string} hashedPassword - Stored hashed password in format: salt:hash
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
export async function verifyPassword(password, hashedPassword) {
  try {
    // Split the stored hash into salt and hash
    const [saltHex, storedHashHex] = hashedPassword.split(':');
    
    // Convert salt from hex to bytes
    const salt = new Uint8Array(saltHex.match(/.{2}/g).map(byte => parseInt(byte, 16)));
    
    // Convert password to bytes
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    
    // Import the password as a key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    // Derive a key using PBKDF2 with the same salt
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    // Convert to hex string
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Compare hashes
    return hashHex === storedHashHex;
  } catch (error) {
    throw new Error(`Failed to verify password: ${error.message}`);
  }
}

/**
 * Generate a simple JWT-like session token (browser-compatible)
 * @param {number} userId - User's unique ID
 * @param {string} email - User's email address
 * @returns {string} Base64-encoded token
 */
export function generateToken(userId, email) {
  try {
    const payload = {
      userId,
      email,
      iat: Date.now(),
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };

    // Create a simple base64-encoded token
    // Note: This is not cryptographically signed, suitable for client-side storage only
    const tokenString = JSON.stringify(payload);
    const token = btoa(tokenString);
    
    return token;
  } catch (error) {
    throw new Error(`Failed to generate token: ${error.message}`);
  }
}

/**
 * Register a new user
 * @param {string} username - User's display name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise<{success: boolean, token?: string, user?: object, error?: string}>}
 */
export async function register(username, email, password, confirmPassword) {
  try {
    // Validate required fields
    if (!username || !email || !password || !confirmPassword) {
      return {
        success: false,
        error: 'All fields are required'
      };
    }

    // Validate username is not empty (after trimming)
    if (username.trim().length === 0) {
      return {
        success: false,
        error: 'Username cannot be empty'
      };
    }

    // Validate password and confirmPassword match
    if (password !== confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match'
      };
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Check for duplicate email
    const existingUserResult = await findUserByEmail(email);
    if (!existingUserResult.success) {
      return {
        success: false,
        error: existingUserResult.error
      };
    }

    if (existingUserResult.user) {
      return {
        success: false,
        error: 'Email already exists'
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user record
    const userData = {
      username: username.trim(),
      email: email.toLowerCase(),
      hashedPassword
    };

    // Store user via addUser
    const addUserResult = await addUser(userData);
    if (!addUserResult.success) {
      return {
        success: false,
        error: addUserResult.error
      };
    }

    const newUser = addUserResult.user;

    // Generate session token
    const token = generateToken(newUser.id, newUser.email);

    // Return success response with token and user data (excluding password)
    return {
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
        lastLogin: newUser.lastLogin
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Registration failed: ${error.message}`
    };
  }
}

/**
 * Login existing user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, token?: string, user?: object, error?: string}>}
 */
export async function login(email, password) {
  try {
    // Validate required fields
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Retrieve user by email
    const userResult = await findUserByEmail(email);
    if (!userResult.success) {
      return {
        success: false,
        error: userResult.error
      };
    }

    // Return error if user not found
    if (!userResult.user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    const user = userResult.user;

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.hashedPassword);
    
    // Return error if password incorrect
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Update lastLogin timestamp
    const readResult = await readUsers();
    if (!readResult.success) {
      return {
        success: false,
        error: readResult.error
      };
    }

    const { users, nextId } = readResult;
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found in storage'
      };
    }

    // Update the lastLogin timestamp
    users[userIndex].lastLogin = new Date().toISOString();

    // Write updated users back to storage
    const writeResult = await writeUsers(users, nextId);
    if (!writeResult.success) {
      return {
        success: false,
        error: writeResult.error
      };
    }

    // Get the updated user
    const updatedUser = users[userIndex];

    // Generate session token
    const token = generateToken(updatedUser.id, updatedUser.email);

    // Return success response with token and user data (excluding password)
    return {
      success: true,
      token,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Login failed: ${error.message}`
    };
  }
}
