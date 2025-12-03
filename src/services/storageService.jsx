// LocalStorage key for users data
const USERS_STORAGE_KEY = 'qripocalypse_users_data';

/**
 * Initialize storage by creating initial structure in localStorage if it doesn't exist
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function initStorage() {
  try {
    // Check if data already exists
    const existingData = localStorage.getItem(USERS_STORAGE_KEY);
    
    if (existingData) {
      // Data exists, no need to initialize
      return { success: true };
    }

    // Create initial structure
    const initialData = {
      users: [],
      nextId: 1
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialData));
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to initialize storage: ${error.message}` 
    };
  }
}

/**
 * Read all users from localStorage
 * @returns {Promise<{success: boolean, users?: array, nextId?: number, error?: string}>}
 */
export async function readUsers() {
  try {
    // Initialize storage if it doesn't exist
    const initResult = await initStorage();
    if (!initResult.success) {
      return initResult;
    }

    const storedData = localStorage.getItem(USERS_STORAGE_KEY);
    
    if (!storedData) {
      return {
        success: false,
        error: 'No data found in storage'
      };
    }
    
    try {
      const data = JSON.parse(storedData);
      
      // Validate structure
      if (!data.users || !Array.isArray(data.users)) {
        return {
          success: false,
          error: 'Corrupted data: missing or invalid users array'
        };
      }
      
      if (typeof data.nextId !== 'number') {
        return {
          success: false,
          error: 'Corrupted data: missing or invalid nextId'
        };
      }

      return { 
        success: true, 
        users: data.users,
        nextId: data.nextId
      };
    } catch (parseError) {
      return {
        success: false,
        error: `Corrupted data: ${parseError.message}`
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to read users: ${error.message}` 
    };
  }
}

/**
 * Write users to localStorage
 * @param {Array} users - Array of user objects
 * @param {number} nextId - Next ID to assign
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function writeUsers(users, nextId) {
  try {
    const data = {
      users,
      nextId
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(data));

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to write users: ${error.message}` 
    };
  }
}

/**
 * Find user by email (case-insensitive)
 * @param {string} email - Email to search for
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function findUserByEmail(email) {
  try {
    const result = await readUsers();
    if (!result.success) {
      return result;
    }

    const normalizedEmail = email.toLowerCase();
    const user = result.users.find(
      u => u.email.toLowerCase() === normalizedEmail
    );

    if (user) {
      return { success: true, user };
    } else {
      return { success: true, user: null };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to find user: ${error.message}` 
    };
  }
}

/**
 * Add new user with sequential ID assignment
 * @param {object} userData - User data (username, email, hashedPassword)
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function addUser(userData) {
  try {
    const result = await readUsers();
    if (!result.success) {
      return result;
    }

    const { users, nextId } = result;

    // Create new user with sequential ID and timestamp
    const newUser = {
      id: nextId,
      username: userData.username,
      email: userData.email,
      hashedPassword: userData.hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Add user to array
    users.push(newUser);

    // Write updated users with incremented nextId
    const writeResult = await writeUsers(users, nextId + 1);
    if (!writeResult.success) {
      return writeResult;
    }

    return { success: true, user: newUser };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to add user: ${error.message}` 
    };
  }
}
