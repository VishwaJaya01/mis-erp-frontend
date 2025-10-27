import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import logoImage from "../../assets/b832ca2e23521f84cfef298c0f3c475a3cb6def2.png";

interface LoginProps {
  onLogin: (role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setEmailError(false);
    setPasswordError(false);

    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError(true);
      hasError = true;
    }

    if (!password) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      setShowError(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      // Mock: different roles based on email
      if (email.includes("manager") || email.includes("admin")) {
        onLogin("Manager");
      } else if (email.includes("supervisor")) {
        onLogin("Supervisor");
      } else {
        onLogin("Employee");
      }
    }, 1500);
  };

  const handlePasswordRecovery = () => {
    if (validateEmail(recoveryEmail)) {
      toast.success(`Reset link sent to ${recoveryEmail}`);
      setShowRecovery(false);
      setRecoveryEmail("");
    }
  };

  const isFormValid = email && password && validateEmail(email);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="LPG Engineering" className="h-12 w-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Use your work email and password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {showError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Couldn't sign you in</AlertTitle>
                    <AlertDescription>
                      Check your email and password and try again.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@lpgeng.lk"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                      setShowError(false);
                    }}
                    className={emailError ? "border-destructive" : ""}
                  />
                  {emailError && (
                    <p className="text-sm text-destructive">Enter a valid email</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                        setShowError(false);
                      }}
                      className={passwordError ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-destructive">Password is required</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label htmlFor="remember" className="text-sm cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0"
                    onClick={() => setShowRecovery(true)}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button type="button" variant="outline" className="w-full">
                    Sign in with Google
                  </Button>
                  <Button type="button" variant="outline" className="w-full">
                    Sign in with Microsoft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Test Credentials Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Test Credentials</CardTitle>
              <CardDescription className="text-xs">
                Use these emails to test different roles (any password works)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div 
                className="p-2 rounded bg-card hover:bg-accent cursor-pointer transition-colors"
                onClick={() => {
                  setEmail("employee@lpgeng.lk");
                  setPassword("demo123");
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">employee@lpgeng.lk</p>
                    <p className="text-xs text-muted-foreground">Employee Role</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Click to use</Badge>
                </div>
              </div>
              <div 
                className="p-2 rounded bg-card hover:bg-accent cursor-pointer transition-colors"
                onClick={() => {
                  setEmail("supervisor@lpgeng.lk");
                  setPassword("demo123");
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">supervisor@lpgeng.lk</p>
                    <p className="text-xs text-muted-foreground">Supervisor Role</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Click to use</Badge>
                </div>
              </div>
              <div 
                className="p-2 rounded bg-card hover:bg-accent cursor-pointer transition-colors"
                onClick={() => {
                  setEmail("manager@lpgeng.lk");
                  setPassword("demo123");
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">manager@lpgeng.lk</p>
                    <p className="text-xs text-muted-foreground">Manager Role</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Click to use</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Recovery Modal */}
      <Dialog open={showRecovery} onOpenChange={setShowRecovery}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password recovery</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a reset link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email</Label>
              <Input
                id="recovery-email"
                type="email"
                placeholder="name@lpgeng.lk"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecovery(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordRecovery}>Send reset link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
