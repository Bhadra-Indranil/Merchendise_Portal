export function required(value: string, fieldName: string): string | null {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function positiveNumber(value: number, fieldName: string): string | null {
  if (isNaN(value) || value <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
}

export function email(value: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
}