import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from 'react-icons/fc'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from './components/AuthLayout'
import { Link } from 'react-router-dom'
import { signup, verifyOTP } from './services/authService'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    learning_goal: '',
  })
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signup(formData)
      setIsOtpSent(true)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await verifyOTP(formData.email, otp)
      navigate('/LoginPage')
    } catch (error) {
      setError(error.message)
    }
  }
  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/auth/google-auth/login";
  }


  return (
    <AuthLayout title="Sign up for MEMINGO">
      <div className="w-full max-w-md mx-auto">
        {!isOtpSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input 
                id="name" 
                type="text" 
                required 
                className="w-full" 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input 
                id="email" 
                type="email" 
                required 
                className="w-full" 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input 
                id="phone" 
                type="tel" 
                required 
                className="w-full" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pr-10"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="learning_goal" className="block text-sm font-medium text-gray-700">
                Learning Goal
              </label>
              <Select onValueChange={(value) => handleSelectChange('learning_goal', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="personal">Personal Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#26647e] focus:ring-[#26647e] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="text-[#26647e] hover:text-[#1e4f62]">Terms of Service</a> and <a href="#" className="text-[#26647e] hover:text-[#1e4f62]">Privacy Policy</a>
              </label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]">
              Sign up
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <Input
                id="otp"
                type="text"
                required
                className="w-full"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit OTP"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]">
              Verify OTP
            </Button>
          </form>
        )}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/LoginPage" className="font-medium text-[#26647e] hover:text-[#1e4f62]">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

