export interface ValidationResult {
  isValid: boolean
  message: string
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { isValid: false, message: "Email is required" }
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" }
  }

  return { isValid: true, message: "" }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Password is required" }
  }

  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasUpperCase) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" }
  }

  if (!hasLowerCase) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" }
  }

  if (!hasNumbers) {
    return { isValid: false, message: "Password must contain at least one number" }
  }

  if (!hasSpecialChar) {
    return { isValid: false, message: "Password must contain at least one special character" }
  }

  return { isValid: true, message: "" }
}

export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, message: "Name is required" }
  }

  if (name.length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters long" }
  }

  const hasNumbers = /\d/.test(name)
  if (hasNumbers) {
    return { isValid: false, message: "Name should not contain numbers" }
  }

  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(name)
  if (hasSpecialChars) {
    return { isValid: false, message: "Name should not contain special characters" }
  }

  return { isValid: true, message: "" }
}

export const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0

  if (password.length >= 8) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/\d/.test(password)) strength += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1

  const strengthMap = {
    0: { label: "Very Weak", color: "bg-red-500" },
    1: { label: "Weak", color: "bg-red-400" },
    2: { label: "Fair", color: "bg-yellow-500" },
    3: { label: "Good", color: "bg-blue-500" },
    4: { label: "Strong", color: "bg-green-500" },
    5: { label: "Very Strong", color: "bg-green-600" },
  }

  return {
    strength: (strength / 5) * 100,
    label: strengthMap[strength as keyof typeof strengthMap].label,
    color: strengthMap[strength as keyof typeof strengthMap].color,
  }
}
