// Biometric Authentication Service
// Uses Web Crypto API and Credential Management API for device-level security
// Note: This is not true WebAuthn (which requires a server), but provides device-level biometric security

interface BiometricCredential {
  id: string;
  publicKey: string;
  createdAt: string;
  deviceName: string;
  type: 'platform' | 'cross-platform'; // platform = Touch/Face ID, cross-platform = Yubikey
  nickname?: string; // User-friendly name for the key
}

class BiometricService {
  private readonly STORAGE_KEY = 'biometric_credentials';
  private readonly CREDENTIAL_KEY = 'app_credential';

  // Check if biometric authentication is available
  async isAvailable(): Promise<boolean> {
    // Check for PublicKeyCredential support (WebAuthn)
    if (!window.PublicKeyCredential) {
      return false;
    }

    // Check if platform authenticator is available (Touch ID, Face ID, Windows Hello)
    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  // Check if user has registered biometrics
  hasRegisteredBiometrics(): boolean {
    const credentials = this.getStoredCredentials();
    return credentials.length > 0;
  }

  // Register new biometric credential
  async registerBiometric(userId: string, adminPin: string): Promise<boolean> {
    try {
      // Verify admin PIN first
      if (adminPin !== '445566') {
        throw new Error('Invalid admin PIN');
      }

      // Check if biometrics are available
      const available = await this.isAvailable();
      if (!available) {
        throw new Error('Biometric authentication not available on this device');
      }

      // Create a simple challenge (in production, this should come from a server)
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create public key credential options
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "AI & API Manager",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userId,
          displayName: "User",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "none"
      };

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      // Store credential metadata (not the actual biometric data)
      const credentialData: BiometricCredential = {
        id: credential.id,
        publicKey: this.arrayBufferToBase64(credential.rawId),
        createdAt: new Date().toISOString(),
        deviceName: this.getDeviceName(),
        type: 'platform',
        nickname: `${this.getDeviceName()} Biometric`
      };

      this.storeCredential(credentialData);
      return true;
    } catch (error) {
      console.error('Biometric registration failed:', error);
      return false;
    }
  }

  // Authenticate with biometric
  async authenticate(): Promise<boolean> {
    try {
      const credentials = this.getStoredCredentials();
      if (credentials.length === 0) {
        throw new Error('No biometric credentials registered');
      }

      // Create a simple challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Get the stored credential
      const storedCredential = credentials[0];
      const credentialId = this.base64ToArrayBuffer(storedCredential.publicKey);

      // Create authentication options
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{
          id: credentialId,
          type: 'public-key',
          transports: ['internal']
        }],
        userVerification: "required",
        timeout: 60000
      };

      // Request authentication
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (!assertion) {
        return false;
      }

      // In a real implementation, we would verify this on a server
      // For client-side only, we just check if the credential was provided
      return assertion.id === storedCredential.id;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }

  // Get all registered credentials
  getAllCredentials(): BiometricCredential[] {
    return this.getStoredCredentials();
  }

  // Remove a specific credential by ID
  removeCredential(credentialId: string): boolean {
    const credentials = this.getStoredCredentials();
    const filtered = credentials.filter(c => c.id !== credentialId);
    if (filtered.length < credentials.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  // Remove all biometric registrations
  removeBiometric(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Register a Yubikey or external security key
  async registerSecurityKey(adminPin: string, nickname?: string): Promise<boolean> {
    try {
      // Verify admin PIN first
      if (adminPin !== '445566') {
        throw new Error('Invalid admin PIN');
      }

      // Create a challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create public key credential options for external authenticator
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "AI & API Manager",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode('user'),
          name: 'user',
          displayName: "User",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "cross-platform", // External authenticator like Yubikey
          userVerification: "preferred"
        },
        timeout: 60000,
        attestation: "none"
      };

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create security key credential');
      }

      // Store credential metadata
      const credentialData: BiometricCredential = {
        id: credential.id,
        publicKey: this.arrayBufferToBase64(credential.rawId),
        createdAt: new Date().toISOString(),
        deviceName: 'Security Key',
        type: 'cross-platform',
        nickname: nickname || `Security Key ${this.getAllCredentials().filter(c => c.type === 'cross-platform').length + 1}`
      };

      this.storeCredential(credentialData);
      return true;
    } catch (error) {
      console.error('Security key registration failed:', error);
      return false;
    }
  }

  // Update credential nickname
  updateCredentialNickname(credentialId: string, nickname: string): boolean {
    const credentials = this.getStoredCredentials();
    const credential = credentials.find(c => c.id === credentialId);
    if (credential) {
      credential.nickname = nickname;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
      return true;
    }
    return false;
  }

  // Store PIN using encrypted localStorage
  async storePinCredential(pin: string): Promise<void> {
    // Store encrypted PIN in localStorage
    await this.encryptAndStore('user_pin', pin);
  }

  // Retrieve stored PIN (if available)
  async getStoredPin(): Promise<string | null> {
    // Retrieve from encrypted localStorage
    return this.decryptAndRetrieve('user_pin');
  }

  // Helper methods
  private getStoredCredentials(): BiometricCredential[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private storeCredential(credential: BiometricCredential): void {
    const credentials = this.getStoredCredentials();
    credentials.push(credential);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private getDeviceName(): string {
    const userAgent = navigator.userAgent;
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Android/.test(userAgent)) return 'Android Device';
    if (/Windows/.test(userAgent)) return 'Windows PC';
    if (/Mac/.test(userAgent)) return 'Mac';
    return 'Unknown Device';
  }

  // Simple encryption for localStorage (better than plain text)
  private async encryptAndStore(key: string, value: string): Promise<void> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(value);
      
      // Generate a key for encryption
      const cryptoKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      // Encrypt the data
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
      );
      
      // Export the key
      const exportedKey = await window.crypto.subtle.exportKey('raw', cryptoKey);
      
      // Store encrypted data and key
      const stored = {
        encrypted: this.arrayBufferToBase64(encrypted),
        key: this.arrayBufferToBase64(exportedKey),
        iv: this.arrayBufferToBase64(iv)
      };
      
      localStorage.setItem(`encrypted_${key}`, JSON.stringify(stored));
    } catch (error) {
      console.error('Encryption failed:', error);
      // Fallback to base64 encoding
      localStorage.setItem(`encrypted_${key}`, btoa(value));
    }
  }

  private async decryptAndRetrieve(key: string): Promise<string | null> {
    try {
      const storedStr = localStorage.getItem(`encrypted_${key}`);
      if (!storedStr) return null;
      
      // Try to parse as encrypted data
      try {
        const stored = JSON.parse(storedStr);
        
        // Import the key
        const keyData = this.base64ToArrayBuffer(stored.key);
        const cryptoKey = await window.crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM', length: 256 },
          true,
          ['decrypt']
        );
        
        // Decrypt the data
        const encrypted = this.base64ToArrayBuffer(stored.encrypted);
        const iv = this.base64ToArrayBuffer(stored.iv);
        
        const decrypted = await window.crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          cryptoKey,
          encrypted
        );
        
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
      } catch (e) {
        // Fallback for base64 encoded data
        return atob(storedStr);
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
}

export default new BiometricService();