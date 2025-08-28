import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import AuthLayout from './components/AuthLayout';
import api from '@/util/api' // axios instance for API calls
import { ArrowLeft } from "lucide-react";


const RequestResetForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await api.post("/auth/reset-password", { email });
      setMessage({ type: 'success', text: response.data.message });
    }
    catch (error) {
      setMessage({ type: 'error', text: 'Failed to send reset link. Please try again.' });
      console.error('Error sending reset link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Send Reset Link
      </Button>
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

const ResetPasswordForm = ({ token }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await api.post("auth/reset-password/confirm", { token, new_password: password });
      setMessage({ type: 'success', text: response.data.message });
      setTimeout(() => navigate('/login'), 3000);
    }
    catch (error) {
      console.error('Error resetting password:', error);
      setMessage({ type: 'error', text: 'Failed to reset password. Please try again.' });
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Reset Password
      </Button>
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

const TokenInputForm = ({ onSubmit }) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await onSubmit(token);
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid or expired token. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="token" className="block text-sm font-medium text-gray-700">Reset Token</label>
        <Input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Verify Token
      </Button>
      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default function PasswordResetPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState(null);
  const [resetStage, setResetStage] = useState('request');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      setResetToken(token);
      setResetStage('reset');
    }
  }, [location]);

  const handleTokenSubmit = (token) => {
    setResetToken(token);
    setResetStage('reset');
  };

  const getTitle = () => {
    switch (resetStage) {
      case 'request':
        return 'Forgot Your Password?';
      case 'token':
        return 'Enter Reset Token';
      case 'reset':
        return 'Reset Your Password';
      default:
        return 'Password Reset';
    }
  };

  return (
    <AuthLayout title={getTitle()}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            {resetStage === 'request' && 'Enter your email to receive a password reset link.'}
            {resetStage === 'token' && 'Enter the reset token you received.'}
            {resetStage === 'reset' && 'Enter your new password below.'}
          </p>
        </div>
        {resetStage === 'request' && <RequestResetForm />}
        {resetStage === 'token' && <TokenInputForm onSubmit={handleTokenSubmit} />}
        {resetStage === 'reset' && <ResetPasswordForm token={resetToken} />}
        <div className="mt-6 text-center">

          <Button
            variant="link"
            className="group text-[#26647E] hover:text-[#1e4f62] bg-transparent border-none focus:outline-none ring-0 focus:ring-0 flex items-center gap-1 transition-all duration-300 font-medium"
            onClick={() => navigate('/loginPage')}>

            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            <span className="underline underline-offset-4 decoration-transparent group-hover:decoration-[#1e4f62] transition-all duration-300">
              Back to Login
            </span>
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}

