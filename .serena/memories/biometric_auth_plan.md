# Biometric Authentication Implementation Plan

## Current Situation
- React app with client-side only (no backend server)
- Need biometric authentication with PIN fallback
- Admin PIN: 445566 for initial setup

## Implementation Strategy

### Phase 1: Device-Level Security (Client-Side)
Since WebAuthn requires a server, we'll implement:
1. **Web Crypto API** for device-level biometric prompt
2. **Credential Management API** for password/PIN storage
3. **localStorage encryption** for credential metadata

### Phase 2: Authentication Flow
1. First-time users enter admin PIN (445566)
2. Option to register biometric (device-level)
3. Store encrypted credentials locally
4. Biometric prompt on subsequent logins

### Phase 3: Components to Build
- BiometricService: Handle device authentication
- SecuritySettings: Manage PIN and biometric registration
- Enhanced LockScreen: Support real biometric prompts
- Logout functionality in Dashboard

### Security Notes
- This is device-level security, not true WebAuthn
- Biometric data never leaves the device
- PIN is encrypted using Web Crypto API
- Session management with automatic timeout