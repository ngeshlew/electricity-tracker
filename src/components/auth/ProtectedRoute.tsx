import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true
}) => {
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [requireAuth, isAuthenticated]);

  // No-op handlers retained for future use

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  if (requireAuth && !isAuthenticated) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        initialMode="login"
      />
    );
  }

  return <>{children}</>;
};
