import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from 'react-icons/fc'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from './components/AuthLayout'
import { Link } from "react-router-dom"
import { login, resendOTP } from './services/authService'
import { Loader2 } from "lucide-react"   // import spinner


// talhaatif11@gmail.com dummy user for login and same password for login
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)   // loader state

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)  // start loader
    setError('')
    try {
      const response = await login({ email, password })
      localStorage.setItem('token', response.access_token)
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      navigate('/LanguageSelectionScreen')
    } catch (error) {
      setError(error.message || 'An error occurred during login')
    }
    finally{
        setLoading(false) // stop loader
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/auth/google-auth/login";
  }

  const handleVerifyAccount = async () => {
    try {
      await resendOTP(email)
      navigate('/OTPVerification', { state: { email } })
    } catch (error) {
      setError(error.message || 'An error occurred while sending verification code')
    }
  }

  return (
    <AuthLayout title="Log in to MEMINGO">
      <style>
        {`
          .login-form {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
          }

          .input-wrapper {
            position: relative;
          }

          .input-wrapper input {
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.375rem;
            border: 1px solid #e5e7eb;
            transition: all 0.2s;
          }

          .input-wrapper input:focus {
            border-color: #26647e;
            box-shadow: 0 0 0 2px rgba(38, 100, 126, 0.2);
          }

          .password-toggle {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
          }

          .remember-forgot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .divider {
            display: flex;
            align-items: center;
            margin: 1.5rem 0;
          }

          .divider::before,
          .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid #e5e7eb;
          }

          .divider-text {
            padding: 0 1rem;
            color: #6b7280;
            font-size: 0.875rem;
          }

          .error-message {
            background-color: #fee2e2;
            border: 1px solid #fecaca;
            color: #ef4444;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            animation: shake 0.5s ease-in-out;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          .google-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            background: white;
            color: #374151;
            font-weight: 500;
            transition: all 0.2s;
          }

          .google-button:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }

          @media (max-width: 640px) {
            .remember-forgot {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }
          }
        `}
      </style>

      <div className="login-form">
      {error && (
          <div className="error-message" role="alert">
            {error}
            {error === "Please verify your account first" && (
              <Button
                onClick={handleVerifyAccount}
                className="ml-2 bg-[#26647e] text-white hover:bg-[#1e4f62]"
              >
                Verify Account
              </Button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#26647e] focus:ring-[#26647e] border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <Link 
              to="/PasswordResetPage" 
              className="text-sm font-medium text-[#26647e] hover:text-[#1e4f62]"
            >
              Forgot your password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]"
          >
           {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-5 w-5 text-white" />
              Logging in...
            </div>
          ) : (
            "Log in"
          )}
          </Button>
        </form>

        <div className="divider">
          <span className="divider-text">Or continue with</span>
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link 
            to="/SignupPage" 
            className="font-medium text-[#26647e] hover:text-[#1e4f62]"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
