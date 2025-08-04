import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Fingerprint,
  Key,
  Shield,
  Trash2,
  Plus,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Smartphone,
  UsbIcon,
  Lock,
  Unlock,
  Github,
  Heart
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import biometricService from '@/services/biometricService';
import { authConfig, updatePin } from '@/config/auth.config';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [keyNickname, setKeyNickname] = useState('');
  const [editingCredential, setEditingCredential] = useState<string | null>(null);
  const [editNickname, setEditNickname] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    loadCredentials();
    checkBiometricAvailability();
  }, []);

  const loadCredentials = () => {
    const allCreds = biometricService.getAllCredentials();
    setCredentials(allCreds);
  };

  const checkBiometricAvailability = async () => {
    const available = await biometricService.isAvailable();
    setBiometricAvailable(available);
  };

  const handleChangePIN = () => {
    // Validate current PIN
    if (currentPin !== authConfig.pin) {
      toast({
        title: "Error",
        description: "Current PIN is incorrect",
        variant: "destructive"
      });
      return;
    }

    // Validate new PIN
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      toast({
        title: "Error",
        description: "New PIN must be 6 digits",
        variant: "destructive"
      });
      return;
    }

    // Confirm PIN match
    if (newPin !== confirmPin) {
      toast({
        title: "Error",
        description: "PINs do not match",
        variant: "destructive"
      });
      return;
    }

    // Update PIN
    updatePin(newPin);
    toast({
      title: "Success",
      description: "PIN has been updated successfully"
    });
    
    // Reset form
    setIsChangingPin(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const handleAddBiometric = async () => {
    if (adminPinInput !== authConfig.adminPin) {
      toast({
        title: "Error",
        description: "Invalid admin PIN",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Setting up biometric",
      description: "Follow your device prompts..."
    });

    const success = await biometricService.registerBiometric('user', adminPinInput);
    if (success) {
      toast({
        title: "Success",
        description: "Biometric authentication added"
      });
      loadCredentials();
      setAdminPinInput('');
      setIsAddingKey(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to add biometric",
        variant: "destructive"
      });
    }
  };

  const handleAddSecurityKey = async () => {
    if (adminPinInput !== authConfig.adminPin) {
      toast({
        title: "Error",
        description: "Invalid admin PIN",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Insert your security key",
      description: "Follow the prompts to register your Yubikey or security key..."
    });

    const success = await biometricService.registerSecurityKey(adminPinInput, keyNickname);
    if (success) {
      toast({
        title: "Success",
        description: "Security key added successfully"
      });
      loadCredentials();
      setAdminPinInput('');
      setKeyNickname('');
      setIsAddingKey(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to add security key",
        variant: "destructive"
      });
    }
  };

  const handleRemoveCredential = (credentialId: string) => {
    if (credentials.length === 1 && !isChangingPin) {
      toast({
        title: "Warning",
        description: "You must have at least one authentication method",
        variant: "destructive"
      });
      return;
    }

    const success = biometricService.removeCredential(credentialId);
    if (success) {
      toast({
        title: "Success",
        description: "Security key removed"
      });
      loadCredentials();
    }
  };

  const handleUpdateNickname = (credentialId: string) => {
    if (!editNickname.trim()) {
      toast({
        title: "Error",
        description: "Nickname cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const success = biometricService.updateCredentialNickname(credentialId, editNickname);
    if (success) {
      toast({
        title: "Success",
        description: "Nickname updated"
      });
      loadCredentials();
      setEditingCredential(null);
      setEditNickname('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/myvault-logo.png" 
              alt="My Vault Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg"
            />
            <h1 className="text-3xl md:text-4xl font-bold glass-pink-glow-strong">
              Security Settings
            </h1>
          </div>
          <p className="text-gray-400">
            Manage your authentication methods and security keys
          </p>
        </header>

        {/* PIN Management */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-pink-500" />
              <span className="glass-pink-glow">PIN Management</span>
            </CardTitle>
            <CardDescription>
              Change your 6-digit PIN code
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isChangingPin ? (
              <Button
                onClick={() => setIsChangingPin(true)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                <Key className="w-4 h-4 mr-2" />
                Change PIN
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm glass-pink-glow-subtle">Current PIN</label>
                  <Input
                    type="password"
                    placeholder="Enter current PIN"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    maxLength={6}
                    className="bg-gray-800/50 border-gray-700 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm glass-pink-glow-subtle">New PIN</label>
                  <Input
                    type="password"
                    placeholder="Enter new 6-digit PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    maxLength={6}
                    className="bg-gray-800/50 border-gray-700 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm glass-pink-glow-subtle">Confirm New PIN</label>
                  <Input
                    type="password"
                    placeholder="Confirm new PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    maxLength={6}
                    className="bg-gray-800/50 border-gray-700 text-white mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleChangePIN}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save PIN
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsChangingPin(false);
                      setCurrentPin('');
                      setNewPin('');
                      setConfirmPin('');
                    }}
                    className="border-gray-700 text-white hover:bg-gray-800/50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Keys Management */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-pink-500" />
              <span className="glass-pink-glow">Security Keys & Biometrics</span>
            </CardTitle>
            <CardDescription>
              Manage your biometric authentication and security keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* List of registered credentials */}
            {credentials.length > 0 ? (
              <div className="space-y-3">
                {credentials.map((cred) => (
                  <div
                    key={cred.id}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      {cred.type === 'platform' ? (
                        <Smartphone className="w-5 h-5 text-blue-400" />
                      ) : (
                        <UsbIcon className="w-5 h-5 text-green-400" />
                      )}
                      <div>
                        {editingCredential === cred.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editNickname}
                              onChange={(e) => setEditNickname(e.target.value)}
                              className="bg-gray-800/50 border-gray-700 text-white h-8 w-48"
                              placeholder="Enter nickname"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateNickname(cred.id)}
                              className="bg-green-600 hover:bg-green-700 h-8"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCredential(null);
                                setEditNickname('');
                              }}
                              className="text-gray-400 hover:text-white h-8"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-white">
                              {cred.nickname || cred.deviceName}
                            </p>
                            <p className="text-xs text-gray-400">
                              Added: {new Date(cred.createdAt).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={cred.type === 'platform' ? 'default' : 'secondary'}>
                        {cred.type === 'platform' ? 'Biometric' : 'Security Key'}
                      </Badge>
                      {editingCredential !== cred.id && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCredential(cred.id);
                              setEditNickname(cred.nickname || '');
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveCredential(cred.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No security keys registered</p>
              </div>
            )}

            {/* Add new credential */}
            {!isAddingKey ? (
              <div className="flex gap-2 pt-4 border-t border-gray-700">
                {biometricAvailable && !credentials.some(c => c.type === 'platform') && (
                  <Button
                    onClick={() => setIsAddingKey(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Add Biometric
                  </Button>
                )}
                <Button
                  onClick={() => setIsAddingKey(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Security Key
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-400 font-medium">Admin PIN Required</p>
                      <p className="text-yellow-300/80">Enter admin PIN to add security keys</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm glass-pink-glow-subtle">Admin PIN</label>
                  <Input
                    type="password"
                    placeholder="Enter admin PIN"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    maxLength={6}
                    className="bg-gray-800/50 border-gray-700 text-white mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm glass-pink-glow-subtle">Nickname (optional)</label>
                  <Input
                    placeholder="e.g., YubiKey 5C, Work Laptop"
                    value={keyNickname}
                    onChange={(e) => setKeyNickname(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white mt-1"
                  />
                </div>
                
                <div className="flex gap-2">
                  {biometricAvailable && !credentials.some(c => c.type === 'platform') && (
                    <Button
                      onClick={handleAddBiometric}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Fingerprint className="w-4 h-4 mr-2" />
                      Setup Biometric
                    </Button>
                  )}
                  <Button
                    onClick={handleAddSecurityKey}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UsbIcon className="w-4 h-4 mr-2" />
                    Add YubiKey
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingKey(false);
                      setAdminPinInput('');
                      setKeyNickname('');
                    }}
                    className="border-gray-700 text-white hover:bg-gray-800/50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-pink-500" />
              <span className="glass-pink-glow">Security Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">PIN Authentication</span>
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Biometric Authentication</span>
                <Badge className={credentials.some(c => c.type === 'platform') ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                  {credentials.some(c => c.type === 'platform') ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Not Set
                    </>
                  )}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Security Keys</span>
                <Badge className={credentials.some(c => c.type === 'cross-platform') ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                  {credentials.filter(c => c.type === 'cross-platform').length > 0 ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {credentials.filter(c => c.type === 'cross-platform').length} Active
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Not Set
                    </>
                  )}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Session Timeout</span>
                <Badge className="bg-blue-500/20 text-blue-400">
                  30 minutes
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/myvault-logo.png" alt="My Vault" className="h-8 w-8" />
              <span className="text-gray-400 text-sm">
                My Vault © {new Date().getFullYear()}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/webdevtodayjason/MyVault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">View on GitHub</span>
              </a>
              
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> for developers
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Settings;