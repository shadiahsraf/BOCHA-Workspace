import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Logo } from '@/components/ui/Logo';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const errorFromStore = useAuthStore((s) => s.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setLocalError('No credential received from Google.');
      return;
    }
    setIsSubmitting(true);
    setLocalError(null);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Google sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setLocalError('Google authentication was cancelled or failed.');
  };

  const activeError = localError || errorFromStore;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Logo size="lg" showText={true} />
          </div>
          <p className="text-sm text-text-secondary">
            Sign in to access your personal dashboard, tasks, and notes
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-md border-border/80">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Sign In</CardTitle>
              <CardDescription className="text-xs">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {activeError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-start flex items-center gap-2.5 text-xs text-destructive animate-in fade-in duration-150">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{activeError}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5 text-start">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-text-primary block"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  startAdornment={<Mail className="h-4 w-4 text-text-secondary" />}
                  className="h-10 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 text-start">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-text-primary block"
                  >
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  startAdornment={<Lock className="h-4 w-4 text-text-secondary" />}
                  className="h-10 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-text-secondary select-none">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <span>Remember this device</span>
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-sm font-medium gap-2 shadow-xs"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" aria-hidden={true} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Visual Divider */}
              <div className="relative w-full my-1.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-surface px-2.5 text-text-secondary">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  shape="rectangular"
                  size="large"
                  text="continue_with"
                  width="100%"
                />
              </div>

              <div className="text-center text-xs text-text-secondary pt-1">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="text-brand-rose font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-rose rounded-sm"
                >
                  Create one now
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
