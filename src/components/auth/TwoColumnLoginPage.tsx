import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { useAuthStore } from '../../store/useAuthStore';

interface TwoColumnLoginPageProps {
  onForgotPassword: () => void;
}

export const TwoColumnLoginPage: React.FC<TwoColumnLoginPageProps> = ({
  onForgotPassword
}) => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to dashboard on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData.email, formData.password);
      // Navigation will happen via useEffect when isAuthenticated becomes true
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Column - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Icon name="lightning-energy" className="size-4" />
            </div>
            Electricity Tracker
          </a>
        </div>
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Card>
              <CardHeader className="space-y-1">
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
                      <Icon name="mail-email-message-inbox" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      <Icon name="lock-privacy" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                          <Icon name="eye-password-off" className="h-4 w-4" />
                        ) : (
                          <Icon name="eye-password" className="h-4 w-4" />
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
                      <Icon name="alert-error" className="h-4 w-4" />
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
                        <Icon name="loading-spinner" className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Column - Cover Image */}
      <div 
        className="relative hidden lg:block bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/background-image.png)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4 relative z-10">
            <div className="bg-primary/10 rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center">
              <Icon name="lightning-energy" className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Track Your Energy Usage
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              Monitor your electricity consumption, analyze patterns, and optimize your energy usage with AI-powered insights.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              <div className="bg-background/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                📊 Real-time Analytics
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                🤖 AI Insights
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                📱 Mobile App
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
