"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { CheckCircle, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react"
import { validateEmail, validatePassword, validateName, getPasswordStrength } from "@/lib/validation"

export default function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [nameValidation, setNameValidation] = useState({ isValid: true, message: "" })
  const [emailValidation, setEmailValidation] = useState({ isValid: true, message: "" })
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, message: "" })
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState({ isValid: true, message: "" })
  const [emailExists, setEmailExists] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (fullName) {
      setNameValidation(validateName(fullName))
    }
  }, [fullName])

  useEffect(() => {
    if (email) {
      const validation = validateEmail(email)
      setEmailValidation(validation)

      // Check if email exists
      if (validation.isValid) {
        checkEmailExists(email)
      }
    }
  }, [email])

  useEffect(() => {
    if (password) {
      setPasswordValidation(validatePassword(password))
    }
  }, [password])

  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordValidation({ isValid: false, message: "Passwords do not match" })
      } else {
        setConfirmPasswordValidation({ isValid: true, message: "Passwords match" })
      }
    }
  }, [password, confirmPassword])

  const checkEmailExists = async (emailToCheck: string) => {
    try {
      const { data, error } = await supabase.from("auth.users").select("email").eq("email", emailToCheck).single()

      if (data) {
        setEmailExists(true)
        setEmailValidation({ isValid: false, message: "This email is already registered" })
      } else {
        setEmailExists(false)
      }
    } catch (err) {
      // Email doesn't exist, which is good
      setEmailExists(false)
    }
  }

  const passwordStrength = getPasswordStrength(password)

  const isFormValid = () => {
    return (
      nameValidation.isValid &&
      emailValidation.isValid &&
      !emailExists &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid &&
      fullName &&
      email &&
      password &&
      confirmPassword
    )
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Final validation check
    if (!isFormValid()) {
      setError("Please fix all validation errors before submitting")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/checker`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // If email confirmation is disabled, redirect immediately
        if (data.user && !data.user.email_confirmed_at) {
          setTimeout(() => {
            router.push("/login")
          }, 3000)
        } else {
          router.push("/checker")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <Check className="h-16 w-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
              <p className="text-muted-foreground mb-6">
                Welcome to GrammarPro! Please check your email to verify your account, or you'll be redirected to login
                shortly.
              </p>
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">GrammarPro</span>
          </Link>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Join thousands of professionals who trust GrammarPro</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={`w-full pr-10 ${!nameValidation.isValid && fullName ? "border-red-500" : nameValidation.isValid && fullName ? "border-green-500" : ""}`}
                  />
                  {fullName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {nameValidation.isValid ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {!nameValidation.isValid && fullName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {nameValidation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full pr-10 ${!emailValidation.isValid && email ? "border-red-500" : emailValidation.isValid && email && !emailExists ? "border-green-500" : ""}`}
                  />
                  {email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValidation.isValid && !emailExists ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {!emailValidation.isValid && email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {emailValidation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pr-10 ${!passwordValidation.isValid && password ? "border-red-500" : passwordValidation.isValid && password ? "border-green-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password Strength:</span>
                      <span
                        className={`font-medium ${passwordStrength.strength >= 80 ? "text-green-600" : passwordStrength.strength >= 60 ? "text-blue-600" : passwordStrength.strength >= 40 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <Progress value={passwordStrength.strength} className="h-2" />
                  </div>
                )}

                {!passwordValidation.isValid && password && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordValidation.message}
                  </p>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Password must contain:</p>
                  <ul className="space-y-1 ml-4">
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                      {/[A-Z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-green-600" : ""}`}>
                      {/[a-z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      One lowercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/\d/.test(password) ? "text-green-600" : ""}`}>
                      {/\d/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      One number
                    </li>
                    <li
                      className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : ""}`}
                    >
                      {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      One special character
                    </li>
                    <li className={`flex items-center gap-2 ${password.length >= 8 ? "text-green-600" : ""}`}>
                      {password.length >= 8 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      At least 8 characters
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pr-10 ${!confirmPasswordValidation.isValid && confirmPassword ? "border-red-500" : confirmPasswordValidation.isValid && confirmPassword ? "border-green-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  {confirmPassword && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      {confirmPasswordValidation.isValid ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {confirmPassword && (
                  <p
                    className={`text-xs flex items-center gap-1 ${confirmPasswordValidation.isValid ? "text-green-600" : "text-red-500"}`}
                  >
                    {confirmPasswordValidation.isValid ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {confirmPasswordValidation.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading || !isFormValid()}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
