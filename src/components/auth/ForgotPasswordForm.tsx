import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBackToLogin
}) => {
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch {
      // Error is handled by the store
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) clearError();
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={onBackToLogin}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
          
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
            variant="ghost"
            className="w-full"
          >
            Try different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          We'll send you a link to reset your password
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onBackToLogin}
          className="w-full"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Button>
      </div>
    </form>
  );
};