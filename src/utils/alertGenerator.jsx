/**
 * AlertGenerator Utility
 * Detects code issues in project files and generates alerts
 */

/**
 * Generate alerts for all projects
 * @param {array} projects - Array of project objects
 * @returns {array} Array of alert objects
 */
export const generateAlertsForProjects = (projects) => {
  if (!projects || projects.length === 0) {
    return [];
  }

  const alerts = [];
  let alertId = 1;

  projects.forEach(project => {
    if (project.files && Array.isArray(project.files)) {
      project.files.forEach(file => {
        const fileAlerts = analyzeFile(file, project);
        fileAlerts.forEach(alert => {
          alerts.push({
            ...alert,
            id: alertId++,
            projectId: project.id,
            projectName: project.name,
            timestamp: new Date().toISOString()
          });
        });
      });
    }
  });

  return alerts;
};

/**
 * Analyze a single file for code issues
 * @param {object} file - File object with name, path, content
 * @param {object} project - Project object
 * @returns {array} Array of alert objects
 */
export const analyzeFile = (file, project) => {
  if (!file || !file.content) {
    return [];
  }

  const alerts = [];
  const content = file.content;
  const lines = content.split('\n');

  // Detect various patterns
  const cursedPatterns = detectCursedPatterns(content, lines);
  const deadVariables = detectDeadVariables(content, lines);
  const suspiciousLogic = detectSuspiciousLogic(content, lines);
  const missingErrorHandling = detectMissingErrorHandling(content, lines);
  const securityIssues = detectSecurityIssues(content, lines);
  const deprecatedPatterns = detectDeprecatedPatterns(content, lines);

  // Combine all detected issues
  [...cursedPatterns, ...deadVariables, ...suspiciousLogic, ...missingErrorHandling, ...securityIssues, ...deprecatedPatterns]
    .forEach(issue => {
      alerts.push({
        type: issue.type,
        file: file.name,
        filePath: file.path || file.name,
        message: issue.message,
        severity: issue.severity,
        ghost: getGhostIcon(issue.type),
        suggestion: issue.suggestion,
        lineNumber: issue.lineNumber
      });
    });

  return alerts;
};

/**
 * Detect cursed loop patterns
 */
const detectCursedPatterns = (content, lines) => {
  const issues = [];

  // Detect while(true) without break
  lines.forEach((line, index) => {
    if (line.includes('while(true)') || line.includes('while (true)')) {
      // Check if there's a break in the next few lines
      const nextLines = lines.slice(index, index + 10).join('\n');
      if (!nextLines.includes('break') && !nextLines.includes('return')) {
        issues.push({
          type: 'curse',
          message: 'Infinite loop detected without break statement',
          severity: 'high',
          suggestion: 'Add a break condition or use a bounded loop',
          lineNumber: index + 1
        });
      }
    }

    // Detect for loops without proper termination
    if (line.match(/for\s*\(\s*;\s*;\s*\)/)) {
      issues.push({
        type: 'curse',
        message: 'Infinite for loop with no conditions',
        severity: 'high',
        suggestion: 'Add proper loop conditions',
        lineNumber: index + 1
      });
    }
  });

  return issues;
};

/**
 * Detect dead/unused variables
 */
const detectDeadVariables = (content, lines) => {
  const issues = [];

  lines.forEach((line, index) => {
    // Detect variable declarations
    const varMatch = line.match(/(?:const|let|var)\s+(\w+)\s*=/);
    if (varMatch) {
      const varName = varMatch[1];
      
      // Check if variable is used later in the code
      const restOfCode = lines.slice(index + 1).join('\n');
      const usagePattern = new RegExp(`\\b${varName}\\b`, 'g');
      const matches = restOfCode.match(usagePattern);
      
      // If variable appears less than 2 times after declaration, it might be unused
      if (!matches || matches.length < 1) {
        issues.push({
          type: 'dead',
          message: `Variable '${varName}' declared but never used`,
          severity: 'medium',
          suggestion: 'Remove unused variable or use it in your code',
          lineNumber: index + 1
        });
      }
    }
  });

  return issues.slice(0, 3); // Limit to avoid too many alerts
};

/**
 * Detect suspicious logic patterns
 */
const detectSuspiciousLogic = (content, lines) => {
  const issues = [];

  lines.forEach((line, index) => {
    // Detect magic numbers
    const magicNumberMatch = line.match(/[^a-zA-Z_]\d{3,}[^a-zA-Z_]/);
    if (magicNumberMatch && !line.includes('//') && !line.includes('/*')) {
      issues.push({
        type: 'suspicious',
        message: 'Magic number detected - consider using a named constant',
        severity: 'low',
        suggestion: 'Replace with a descriptive constant name',
        lineNumber: index + 1
      });
    }

    // Detect complex conditionals (multiple && or ||)
    const complexCondition = (line.match(/&&/g) || []).length + (line.match(/\|\|/g) || []).length;
    if (complexCondition >= 3) {
      issues.push({
        type: 'suspicious',
        message: 'Complex conditional logic detected',
        severity: 'medium',
        suggestion: 'Consider breaking into smaller functions or using early returns',
        lineNumber: index + 1
      });
    }

    // Detect == instead of ===
    if (line.includes('==') && !line.includes('===') && !line.includes('!==')) {
      issues.push({
        type: 'suspicious',
        message: 'Loose equality (==) detected',
        severity: 'low',
        suggestion: 'Use strict equality (===) instead',
        lineNumber: index + 1
      });
    }
  });

  return issues.slice(0, 3); // Limit to avoid too many alerts
};

/**
 * Detect missing error handling
 */
const detectMissingErrorHandling = (content, lines) => {
  const issues = [];

  lines.forEach((line, index) => {
    // Detect async functions without try-catch
    if (line.includes('async ') && line.includes('function')) {
      const nextLines = lines.slice(index, index + 20).join('\n');
      if (!nextLines.includes('try') && !nextLines.includes('catch')) {
        issues.push({
          type: 'suspicious',
          message: 'Async function without error handling',
          severity: 'medium',
          suggestion: 'Add try-catch block to handle potential errors',
          lineNumber: index + 1
        });
      }
    }

    // Detect fetch/axios without catch
    if ((line.includes('fetch(') || line.includes('axios.')) && !line.includes('.catch')) {
      const nextLines = lines.slice(index, index + 5).join('\n');
      if (!nextLines.includes('.catch') && !nextLines.includes('try')) {
        issues.push({
          type: 'suspicious',
          message: 'Network request without error handling',
          severity: 'high',
          suggestion: 'Add .catch() or wrap in try-catch',
          lineNumber: index + 1
        });
      }
    }
  });

  return issues.slice(0, 2); // Limit to avoid too many alerts
};

/**
 * Detect security issues
 */
const detectSecurityIssues = (content, lines) => {
  const issues = [];

  lines.forEach((line, index) => {
    // Detect eval usage
    if (line.includes('eval(')) {
      issues.push({
        type: 'security',
        message: 'Dangerous eval() usage detected',
        severity: 'high',
        suggestion: 'Avoid eval() - use safer alternatives',
        lineNumber: index + 1
      });
    }

    // Detect innerHTML usage
    if (line.includes('innerHTML')) {
      issues.push({
        type: 'security',
        message: 'Potential XSS vulnerability with innerHTML',
        severity: 'medium',
        suggestion: 'Use textContent or sanitize input',
        lineNumber: index + 1
      });
    }

    // Detect hardcoded credentials patterns
    if (line.match(/password\s*=\s*['"][^'"]+['"]/i) || 
        line.match(/api[_-]?key\s*=\s*['"][^'"]+['"]/i)) {
      issues.push({
        type: 'security',
        message: 'Potential hardcoded credentials detected',
        severity: 'high',
        suggestion: 'Use environment variables for sensitive data',
        lineNumber: index + 1
      });
    }
  });

  return issues.slice(0, 2); // Limit to avoid too many alerts
};

/**
 * Detect deprecated patterns and APIs
 */
const detectDeprecatedPatterns = (content, lines) => {
  const issues = [];

  lines.forEach((line, index) => {
    // Detect var usage (deprecated in favor of let/const)
    if (line.match(/\bvar\s+\w+/)) {
      issues.push({
        type: 'deprecated',
        message: 'Use of "var" is deprecated',
        severity: 'low',
        suggestion: 'Use "let" or "const" instead',
        lineNumber: index + 1
      });
    }

    // Detect componentWillMount and other deprecated React lifecycle methods
    if (line.includes('componentWillMount') || 
        line.includes('componentWillReceiveProps') || 
        line.includes('componentWillUpdate')) {
      issues.push({
        type: 'deprecated',
        message: 'Deprecated React lifecycle method detected',
        severity: 'medium',
        suggestion: 'Use modern lifecycle methods or hooks',
        lineNumber: index + 1
      });
    }

    // Detect String.prototype.substr (deprecated)
    if (line.includes('.substr(')) {
      issues.push({
        type: 'deprecated',
        message: 'String.substr() is deprecated',
        severity: 'low',
        suggestion: 'Use String.substring() or String.slice() instead',
        lineNumber: index + 1
      });
    }

    // Detect moment.js (often considered deprecated in favor of date-fns or dayjs)
    if (line.includes('moment(') && !line.includes('//')) {
      issues.push({
        type: 'deprecated',
        message: 'moment.js is in maintenance mode',
        severity: 'low',
        suggestion: 'Consider using date-fns or dayjs for new projects',
        lineNumber: index + 1
      });
    }
  });

  return issues.slice(0, 2); // Limit to avoid too many alerts
};

/**
 * Get severity level for a pattern
 * @param {string} pattern - Pattern type
 * @returns {string} 'high' | 'medium' | 'low'
 */
export const getSeverityLevel = (pattern) => {
  const severityMap = {
    curse: 'high',
    dead: 'medium',
    suspicious: 'medium',
    security: 'high',
    deprecated: 'low'
  };
  return severityMap[pattern] || 'medium';
};

/**
 * Get ghost icon for alert type
 */
const getGhostIcon = (type) => {
  const icons = {
    curse: '🔮',
    dead: '💀',
    suspicious: '👁️',
    security: '🚨',
    deprecated: '⚠️'
  };
  return icons[type] || '👻';
};
