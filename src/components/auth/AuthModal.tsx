import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  const handleClose = () => {
    setMode(initialMode);
    onClose();
  };

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToRegister={() => handleModeChange('register')}
            onForgotPassword={() => handleModeChange('forgot-password')}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onSwitchToLogin={() => handleModeChange('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBackToLogin={() => handleModeChange('login')}
          />
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign in to your account';
      case 'register':
        return 'Create your account';
      case 'forgot-password':
        return 'Reset your password';
      default:
        return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login':
        return 'Enter your credentials to access your electricity tracker dashboard.';
      case 'register':
        return 'Create a new account to start tracking your electricity consumption.';
      case 'forgot-password':
        return 'Enter your email address and we\'ll send you a link to reset your password.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};
