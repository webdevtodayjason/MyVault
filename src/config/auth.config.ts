// Authentication Configuration
// WARNING: This is for demo purposes. In production, use proper encryption and secure storage

export const authConfig = {
  // Default PIN - should be changed by user
  pin: "445566",
  
  // Admin PIN for initial biometric setup
  adminPin: "445566",
  
  // Enable biometric authentication
  biometricEnabled: true,
  
  // Session timeout in minutes
  sessionTimeout: 30,
  
  // Maximum PIN attempts before lockout
  maxAttempts: 3,
  
  // Lockout duration in minutes
  lockoutDuration: 5
};

// Helper to validate PIN
export const validatePin = (inputPin: string): boolean => {
  return inputPin === authConfig.pin;
};

// Store PIN in localStorage (encrypted in production)
export const updatePin = (newPin: string): void => {
  authConfig.pin = newPin;
  localStorage.setItem('auth_pin', btoa(newPin)); // Basic encoding for demo
};

// Load PIN from localStorage
export const loadPin = (): void => {
  const storedPin = localStorage.getItem('auth_pin');
  if (storedPin) {
    authConfig.pin = atob(storedPin);
  }
};