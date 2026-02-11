import { Route, Navigate } from 'react-router-dom';
import { SignIn } from '@/app/components/auth/SignIn';
import { SignUp } from '@/app/components/auth/SignUp';
import { ForgotPassword } from '@/app/components/auth/ForgotPassword';

interface AuthRoutesProps {
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onSwitchToSignUp: () => void;
  onSwitchToSignIn: () => void;
  onForgotPassword: () => void;
}

export function AuthRoutes({
  isAuthenticated,
  onSignIn,
  onSignUp,
  onSwitchToSignUp,
  onSwitchToSignIn,
  onForgotPassword,
}: AuthRoutesProps) {
  return (
    <>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignIn
              onSignIn={onSignIn}
              onSwitchToSignUp={onSwitchToSignUp}
              onForgotPassword={onForgotPassword}
            />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignUp onSignUp={onSignUp} onSwitchToSignIn={onSwitchToSignIn} />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPassword onBackToSignIn={onSwitchToSignIn} />
          )
        }
      />
    </>
  );
}
