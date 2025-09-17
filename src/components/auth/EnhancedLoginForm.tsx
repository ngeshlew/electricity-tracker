import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Lock,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface EnhancedLoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export const EnhancedLoginForm: React.FC<EnhancedLoginFormProps> = ({
  onSwitchToRegister,
  onForgotPassword
}) => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                <Zap className="size-5" />
              </div>
              <span className="text-xl font-bold">Electricity Tracker</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your electricity tracker account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={onForgotPassword}
                  className="px-0 text-sm"
                  disabled={isLoading}
                >
                  Forgot password?
                </Button>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              {/* Demo Credentials */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground text-center mb-2">
                  Demo Credentials:
                </p>
                <p className="text-xs text-center">
                  Email: <code className="bg-background px-1 rounded">demo@electricitytracker.com</code>
                </p>
                <p className="text-xs text-center">
                  Password: <code className="bg-background px-1 rounded">demo123</code>
                </p>
              </div>
            </form>

            {/* Switch to Register */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button
                variant="link"
                size="sm"
                onClick={onSwitchToRegister}
                className="px-0"
                disabled={isLoading}
              >
                Sign up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
