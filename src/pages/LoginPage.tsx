import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/products', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const result = login(email, password);

    if (result.success) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/products';
      navigate(from, { replace: true });
    } else if (result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="login-page"
      className="min-h-[calc(100vh-3rem)] flex flex-col justify-center items-center px-5 py-16"
    >
      <div className="w-full max-w-[360px]">
        <h1 data-testid="login-title" className="text-[32px] leading-tight text-center text-ink">
          Sign in to QA Cart
        </h1>
        <p className="text-[15px] text-ink-2 text-center mt-2">
          Use the test account to explore the store.
        </p>

        {errors.general && (
          <div
            data-testid="login-error-message"
            role="alert"
            className="mt-8 px-4 py-3 rounded-xl bg-danger-soft text-danger text-[14px]"
          >
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate data-testid="login-form" className={`space-y-5 ${errors.general ? 'mt-4' : 'mt-8'}`}>
          <div>
            <label htmlFor="login-email-input" className="block text-[13px] text-ink-2 mb-1.5">
              Email Address
            </label>
            <input
              id="login-email-input"
              data-testid="login-email-input"
              type="email"
              autoComplete="email"
              value={email}
              aria-invalid={Boolean(errors.email)}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
              }}
              placeholder="name@example.com"
              className="field"
            />
            {errors.email && (
              <p data-testid="login-email-error" role="alert" className="mt-1.5 text-[13px] text-danger">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login-password-input" className="block text-[13px] text-ink-2 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                data-testid="login-password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                aria-invalid={Boolean(errors.password)}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
                }}
                placeholder="Password"
                className="field pr-16"
              />
              <button
                type="button"
                data-testid="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 px-3.5 text-[13px] link"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p data-testid="login-password-error" role="alert" className="mt-1.5 text-[13px] text-danger">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="login-submit-button"
            className="btn btn-primary btn-lg mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
