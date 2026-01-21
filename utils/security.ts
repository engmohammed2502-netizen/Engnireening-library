
/**
 * Basic XSS Protection: Sanitizes input strings
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Mock SQL Injection check
 */
export const isPotentiallyMalicious = (input: string): boolean => {
  const sqlPatterns = [/SELECT/i, /DROP/i, /DELETE/i, /UPDATE/i, /OR 1=1/i, /--/];
  return sqlPatterns.some(pattern => pattern.test(input));
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
