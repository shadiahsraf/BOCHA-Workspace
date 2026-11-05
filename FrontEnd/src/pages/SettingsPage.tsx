import { useState, type FormEvent } from 'react';
import axios from 'axios';
import {
  User,
  Palette,
  Lock,
  Sun,
  Moon,
  Laptop,
  Globe,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
} from 'lucide-react';
import { useAuthStore, type UserProfile } from '@/stores/authStore';
import { userService } from '@/services/userService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data !== null) {
      if ('detail' in data && typeof data.detail === 'string') {
        return data.detail;
      }
      const values = Object.values(data);
      if (values.length > 0) {
        const first = values[0];
        if (Array.isArray(first)) return first.join(' ');
        if (typeof first === 'string') return first;
      }
    }
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  // Tab 1: Profile State
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Tab 2: Appearance State
  const currentTheme = user?.preferredTheme || 'system';
  const currentLocale = user?.preferredLanguage || 'en';
  const [appearanceLoading, setAppearanceLoading] = useState(false);
  const [appearanceSuccess, setAppearanceSuccess] = useState<string | null>(null);
  const [appearanceError, setAppearanceError] = useState<string | null>(null);

  // Tab 3: Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const userInitials =
    user?.username
      ? user.username.slice(0, 2).toUpperCase()
      : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : 'U';

  // Handle Profile Update
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!username.trim() || !email.trim()) {
      setProfileError('Both username and email are required.');
      return;
    }

    setProfileLoading(true);
    try {
      const updated = await userService.updateProfile({
        username: username.trim(),
        email: email.trim(),
      });
      updateUser(updated);
      setProfileSuccess('Profile updated successfully.');
    } catch (err: unknown) {
      setProfileError(extractErrorMessage(err, 'Failed to update profile.'));
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Theme Change
  const handleThemeChange = async (theme: UserProfile['preferredTheme']) => {
    setAppearanceSuccess(null);
    setAppearanceError(null);
    setAppearanceLoading(true);

    try {
      const updated = await userService.updateProfile({ preferredTheme: theme });
      updateUser(updated);
      setAppearanceSuccess(`Theme preference updated to ${theme}.`);
    } catch (err: unknown) {
      setAppearanceError(extractErrorMessage(err, 'Failed to update theme preference.'));
    } finally {
      setAppearanceLoading(false);
    }
  };

  // Handle Language Change
  const handleLanguageChange = async (locale: UserProfile['preferredLanguage']) => {
    setAppearanceSuccess(null);
    setAppearanceError(null);
    setAppearanceLoading(true);

    try {
      const updated = await userService.updateProfile({ preferredLanguage: locale });
      updateUser(updated);
      setAppearanceSuccess(
        locale === 'ar' ? 'تم تحديث اللغة إلى العربية بنجاح.' : 'Language preference updated to English.'
      );
    } catch (err: unknown) {
      setAppearanceError(extractErrorMessage(err, 'Failed to update language preference.'));
    } finally {
      setAppearanceLoading(false);
    }
  };

  // Handle Password Change
  const handleSecuritySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSecuritySuccess(null);
    setSecurityError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setSecurityError('All password fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      setSecurityError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError('New passwords do not match.');
      return;
    }

    setSecurityLoading(true);
    try {
      const response = await userService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSecuritySuccess(response.detail || 'Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setSecurityError(extractErrorMessage(err, 'Failed to change password.'));
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account profile, visual appearance, and security credentials.
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* ======================================================================= */}
        {/* Tab 1: Profile */}
        {/* ======================================================================= */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Update your public username and registered email address.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-6">
                {profileSuccess && (
                  <Alert variant="success" role="status">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{profileSuccess}</AlertDescription>
                  </Alert>
                )}

                {profileError && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}

                {/* Avatar Preview */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-border">
                    <AvatarFallback className="text-lg font-bold bg-primary-soft text-text-primary dark:text-primary">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">
                      {user?.username || 'LifeOS User'}
                    </h4>
                    <p className="text-xs text-text-secondary">{user?.email || 'user@lifeos.app'}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="settings-username" className="text-sm font-medium text-text-primary">
                      Username
                    </label>
                    <Input
                      id="settings-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. johndoe"
                      required
                      disabled={profileLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="settings-email" className="text-sm font-medium text-text-primary">
                      Email Address
                    </label>
                    <Input
                      id="settings-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@lifeos.app"
                      required
                      disabled={profileLoading}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end border-t border-border pt-4">
                <Button type="submit" variant="primary" disabled={profileLoading} className="gap-2">
                  {profileLoading ? (
                    <>
                      <Spinner aria-hidden={true} className="h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* ======================================================================= */}
        {/* Tab 2: Appearance */}
        {/* ======================================================================= */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Preferences</CardTitle>
              <CardDescription>
                Customize theme mode and interface language. Changes apply immediately to your current session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {appearanceSuccess && (
                <Alert variant="success" role="status">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Preferences Saved</AlertTitle>
                  <AlertDescription>{appearanceSuccess}</AlertDescription>
                </Alert>
              )}

              {appearanceError && (
                <Alert variant="destructive" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{appearanceError}</AlertDescription>
                </Alert>
              )}

              {/* Theme Selection */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">Color Theme</h4>
                  <p className="text-xs text-text-secondary">
                    Select your preferred interface color mode.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleThemeChange('light')}
                    disabled={appearanceLoading}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      currentTheme === 'light'
                        ? 'border-primary bg-primary-soft text-text-primary shadow-xs font-semibold'
                        : 'border-border bg-surface hover:border-primary/50 text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-sm">Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('dark')}
                    disabled={appearanceLoading}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      currentTheme === 'dark'
                        ? 'border-primary bg-primary-soft text-text-primary shadow-xs font-semibold'
                        : 'border-border bg-surface hover:border-primary/50 text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-sm">Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange('system')}
                    disabled={appearanceLoading}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      currentTheme === 'system'
                        ? 'border-primary bg-primary-soft text-text-primary shadow-xs font-semibold'
                        : 'border-border bg-surface hover:border-primary/50 text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Laptop className="h-6 w-6" />
                    <span className="text-sm">System</span>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">Language & Direction</h4>
                  <p className="text-xs text-text-secondary">
                    Choose interface language and layout reading direction (LTR/RTL).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en')}
                    disabled={appearanceLoading}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border transition-all text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      currentLocale === 'en'
                        ? 'border-primary bg-primary-soft text-text-primary shadow-xs font-semibold'
                        : 'border-border bg-surface hover:border-primary/50 text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Globe className="h-5 w-5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium">English</div>
                      <div className="text-xs text-text-secondary">Left-to-Right (LTR)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLanguageChange('ar')}
                    disabled={appearanceLoading}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border transition-all text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      currentLocale === 'ar'
                        ? 'border-primary bg-primary-soft text-text-primary shadow-xs font-semibold'
                        : 'border-border bg-surface hover:border-primary/50 text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Globe className="h-5 w-5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium">العربية</div>
                      <div className="text-xs text-text-secondary">Right-to-Left (RTL)</div>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================================================================= */}
        {/* Tab 3: Security */}
        {/* ======================================================================= */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is protected with a secure password at least 8 characters long.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSecuritySubmit}>
              <CardContent className="space-y-4 max-w-md">
                {securitySuccess && (
                  <Alert variant="success" role="status">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{securitySuccess}</AlertDescription>
                  </Alert>
                )}

                {securityError && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{securityError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label htmlFor="settings-old-pass" className="text-sm font-medium text-text-primary">
                    Current Password
                  </label>
                  <Input
                    id="settings-old-pass"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    disabled={securityLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="settings-new-pass" className="text-sm font-medium text-text-primary">
                    New Password
                  </label>
                  <Input
                    id="settings-new-pass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    disabled={securityLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="settings-confirm-pass" className="text-sm font-medium text-text-primary">
                    Confirm New Password
                  </label>
                  <Input
                    id="settings-confirm-pass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    disabled={securityLoading}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-end border-t border-border pt-4">
                <Button type="submit" variant="primary" disabled={securityLoading} className="gap-2">
                  {securityLoading ? (
                    <>
                      <Spinner aria-hidden={true} className="h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
