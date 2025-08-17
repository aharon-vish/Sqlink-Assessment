export const validateJobName = (name: string): string | undefined => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return 'Job name is required';
  }
  
  if (trimmedName.length < 3) {
    return 'Job name must be at least 3 characters';
  }
  
  if (trimmedName.length > 100) {
    return 'Job name must be less than 100 characters';
  }
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
    return 'Job name can only contain letters, numbers, spaces, hyphens, and underscores';
  }
  
  return undefined;
};

export const sanitizeJobName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ');
};