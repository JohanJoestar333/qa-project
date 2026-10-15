export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isValidEmailFormat = (email: string): boolean => EMAIL_PATTERN.test(email.trim());

export const validateLoginForm = (email: string, password: string): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmailFormat(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};
