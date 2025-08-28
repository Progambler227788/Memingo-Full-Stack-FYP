import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import AuthLayout from './components/AuthLayout'
import { verifyOTP, resendOTP } from './services/authService'

export default function OTPVerification() {
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const emailFromState = location.state?.email
    if (emailFromState) {
      setEmail(emailFromState)
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await verifyOTP(email, otp)
      navigate('/LoginPage', { state: { message: 'Account verified successfully. Please log in.' } })
    } catch (error) {
      setError(error.message || 'An error occurred during OTP verification')
    }
  }

  const handleResendCode = async () => {
    setError('')
    setMessage('')
    try {
      await resendOTP(email)
      setMessage('A new verification code has been sent to your email.')
    } catch (error) {
      setError(error.message || 'An error occurred while resending the code')
    }
  }

  return (
    <AuthLayout title="Verify Your Account">
      <Card className="p-6 w-full max-w-md mx-auto">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            We've sent a verification code to your email. Please enter it below to complete your registration.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input 
              id="email" 
              type="email" 
              required 
              className="w-full" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <Input 
              id="otp" 
              type="text" 
              required 
              className="w-full" 
              placeholder="Enter your 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <Button type="submit" className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]">
            Verify
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button 
            className="text-sm text-[#26647e] hover:text-[#1e4f62]"
            onClick={handleResendCode}
          >
            Resend code
          </button>
        </div>
      </Card>
    </AuthLayout>
  )
}

