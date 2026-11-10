import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Logo } from '@/components/ui/Logo';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const errorFromStore = useAuthStore((s) => s.error);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'ar'>('en');
  const [preferredTheme, setPreferredTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password || !passwordConfirm) {
      setLocalError('Please fill out all required fields.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== passwordConfirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: email.trim(),
        username: username.trim() || undefined,
        password,
        password_confirm: passwordConfirm,
        preferred_language: preferredLanguage,
        preferred_theme: preferredTheme,
      });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async (token: string) => {
    setLocalError(null);
    await loginWithGoogle(token);
    navigate('/', { replace: true });
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
            Join BOCHA Workspace to manage your priorities, projects, and personal notes
          </p>
        </div>

        {/* Register Card */}
        <Card className="shadow-md border-border/80">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Sign Up</CardTitle>
              <CardDescription className="text-xs">
                Create your workspace account
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
                  htmlFor="reg-email"
                  className="text-xs font-medium text-text-primary block"
                >
                  Email Address *
                </label>
                <Input
                  id="reg-email"
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

              {/* Username Field */}
              <div className="space-y-1.5 text-start">
                <label
                  htmlFor="reg-username"
                  className="text-xs font-medium text-text-primary block"
                >
                  Username (optional)
                </label>
                <Input
                  id="reg-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alex"
                  startAdornment={<User className="h-4 w-4 text-text-secondary" />}
                  className="h-10 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 text-start">
                <label
                  htmlFor="reg-password"
                  className="text-xs font-medium text-text-primary block"
                >
                  Password (min 8 characters) *
                </label>
                <Input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  startAdornment={<Lock className="h-4 w-4 text-text-secondary" />}
                  className="h-10 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5 text-start">
                <label
                  htmlFor="reg-password-confirm"
                  className="text-xs font-medium text-text-primary block"
                >
                  Confirm Password *
                </label>
                <Input
                  id="reg-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  startAdornment={<Lock className="h-4 w-4 text-text-secondary" />}
                  className="h-10 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Preferences Selection */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5 text-start">
                  <label htmlFor="pref-lang" className="text-xs font-medium text-text-secondary block">
                    Language
                  </label>
                  <select
                    id="pref-lang"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as 'en' | 'ar')}
                    className="w-full h-9 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={isSubmitting}
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-start">
                  <label htmlFor="pref-theme" className="text-xs font-medium text-text-secondary block">
                    Theme
                  </label>
                  <select
                    id="pref-theme"
                    value={preferredTheme}
                    onChange={(e) => setPreferredTheme(e.target.value as 'light' | 'dark' | 'system')}
                    className="w-full h-9 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={isSubmitting}
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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

              {/* Google OAuth Custom Button */}
              <GoogleAuthButton
                mode="signup"
                isLoading={isSubmitting}
                onSuccess={handleGoogleSignUp}
                onError={(err) => setLocalError(err)}
              />

              <div className="text-center text-xs text-text-secondary pt-1">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-brand-rose font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-rose rounded-sm"
                >
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
