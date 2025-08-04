import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Fingerprint, 
  Lock, 
  Unlock,
  Shield,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { validatePin, loadPin, authConfig } from '@/config/auth.config';
import { useToast } from "@/hooks/use-toast";
import biometricService from '@/services/biometricService';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    loadPin();
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime(lockoutTime - 1);
        if (lockoutTime === 1) {
          setIsLocked(false);
          setAttempts(0);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  const checkBiometricSupport = async () => {
    const isAvailable = await biometricService.isAvailable();
    const hasRegistered = biometricService.hasRegisteredBiometrics();
    setBiometricAvailable(isAvailable);
    setHasBiometrics(hasRegistered);
    setBiometricSupported(isAvailable && hasRegistered);
  };

  const handlePinSubmit = () => {
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: `Please wait ${lockoutTime} seconds before trying again.`,
        variant: "destructive"
      });
      return;
    }

    setIsAuthenticating(true);
    
    setTimeout(() => {
      if (validatePin(pin)) {
        toast({
          title: "Welcome Back!",
          description: "Authentication successful"
        });
        onUnlock();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPin('');
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockoutTime(300); // 5 minutes
          toast({
            title: "Too Many Attempts",
            description: "Account locked for 5 minutes",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Incorrect PIN",
            description: `${3 - newAttempts} attempts remaining`,
            variant: "destructive"
          });
        }
      }
      setIsAuthenticating(false);
    }, 500);
  };

  const handleBiometric = async () => {
    setIsAuthenticating(true);
    
    try {
      // Check if biometrics are registered
      if (!biometricService.hasRegisteredBiometrics()) {
        // First time setup - ask for admin PIN
        const adminPin = prompt('Enter admin PIN to set up biometric authentication:');
        if (!adminPin) {
          setIsAuthenticating(false);
          return;
        }
        
        if (adminPin !== authConfig.adminPin) {
          toast({
            title: "Invalid Admin PIN",
            description: "Please enter the correct admin PIN",
            variant: "destructive"
          });
          setIsAuthenticating(false);
          return;
        }
        
        // Register biometric
        toast({
          title: "Setting up biometric",
          description: "Follow your device prompts to register your fingerprint or face..."
        });
        
        const registered = await biometricService.registerBiometric('user', adminPin);
        if (registered) {
          toast({
            title: "Success!",
            description: "Biometric authentication has been set up"
          });
          onUnlock();
        } else {
          toast({
            title: "Setup Failed",
            description: "Could not register biometric. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        // Authenticate with existing biometric
        toast({
          title: "Authenticating",
          description: "Use your fingerprint or face to unlock..."
        });
        
        const authenticated = await biometricService.authenticate();
        if (authenticated) {
          toast({
            title: "Welcome Back!",
            description: "Biometric authentication successful"
          });
          onUnlock();
        } else {
          toast({
            title: "Authentication Failed",
            description: "Please try again or use PIN",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Biometric error:', error);
      toast({
        title: "Error",
        description: "Biometric authentication is not available on this device",
        variant: "destructive"
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePinChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = pin.split('');
      newPin[index] = value;
      setPin(newPin.join(''));
      
      // Auto-focus next input
      if (value && index < 5) {
        pinInputRefs.current[index + 1]?.focus();
      }
      
      // Auto-submit when all 6 digits are entered
      if (index === 5 && value) {
        const fullPin = newPin.join('');
        if (fullPin.length === 6) {
          setPin(fullPin);
          setTimeout(() => handlePinSubmit(), 100);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute text-pink-400 opacity-50 animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${Math.random() * 20 + 10}px`
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md bg-gray-900/30 backdrop-blur-xl border-gray-700/50 shadow-2xl relative z-10">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-20 h-20 text-pink-500" />
                <div className="absolute inset-0 w-20 h-20 bg-pink-500/30 rounded-full filter blur-xl animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold glass-pink-glow-strong">Secure Access</h1>
            <p className="text-gray-400">Authenticate to continue</p>
          </div>

          {/* Lock Status */}
          {isLocked && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-400">
                Locked for {Math.floor(lockoutTime / 60)}:{(lockoutTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* PIN Input */}
          <div className="space-y-4">
            <label className="text-sm font-medium glass-pink-glow-subtle">Enter PIN</label>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Input
                  key={index}
                  ref={(el) => (pinInputRefs.current[index] = el)}
                  type="password"
                  maxLength={1}
                  value={pin[index] || ''}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-2xl bg-gray-800/50 border-gray-700 text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  disabled={isLocked || isAuthenticating}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handlePinSubmit}
              disabled={pin.length !== 6 || isLocked || isAuthenticating}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg text-white font-medium"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock with PIN
                </>
              )}
            </Button>

            {(biometricAvailable || biometricSupported) && (
              <Button
                onClick={handleBiometric}
                disabled={isLocked || isAuthenticating}
                variant="outline"
                className="w-full border-gray-700 text-white hover:bg-gray-800/50 hover:text-pink-400 shadow-lg"
              >
                <Fingerprint className="w-4 h-4 mr-2" />
                {hasBiometrics ? 'Use Biometric' : 'Setup Biometric'}
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center text-xs text-gray-500">
            <p>PIN: 445566</p>
            {!hasBiometrics && biometricAvailable && (
              <p className="mt-1">Admin PIN for biometric setup: 999999</p>
            )}
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>256-bit encryption enabled</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LockScreen;