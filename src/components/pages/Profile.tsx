import { useState, useEffect } from "react";
import { AppShell } from "../layout/AppShell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useRouter } from "../../lib/router";
import { Upload, Monitor, Smartphone, Edit2, X, Check } from "lucide-react";

const mockSessions = [
  { id: "1", device: "Windows · Chrome", location: "Colombo, LK", lastActive: "Active now" },
  { id: "2", device: "iPhone · Safari", location: "Colombo, LK", lastActive: "2 hours ago" },
  { id: "3", device: "MacBook · Chrome", location: "Kandy, LK", lastActive: "Yesterday" },
];

export function Profile() {
  const { userRole } = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("Kasun Perera");
  const [phone, setPhone] = useState("+94 77 123 4567");
  const [originalFullName, setOriginalFullName] = useState("Kasun Perera");
  const [originalPhone, setOriginalPhone] = useState("+94 77 123 4567");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showInDirectory, setShowInDirectory] = useState(true);
  const [contactMethod, setContactMethod] = useState("email");
  const [timeFormat, setTimeFormat] = useState("24");
  const [dateFormat, setDateFormat] = useState("dmy");
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.fullName) {
          setFullName(profile.fullName);
          setOriginalFullName(profile.fullName);
        }
        if (profile.phone) {
          setPhone(profile.phone);
          setOriginalPhone(profile.phone);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, []);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setFullName(originalFullName);
    setPhone(originalPhone);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    
    // Phone validation (Sri Lankan format)
    const phoneRegex = /^\+94\s?7[0-9]\s?[0-9]{3}\s?[0-9]{4}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid Sri Lankan phone number (+94 7X XXX XXXX)");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Save to localStorage
      const profileData = {
        fullName,
        phone,
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      setOriginalFullName(fullName);
      setOriginalPhone(phone);
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Update password error:", error);
      toast.error("Failed to update password. Please try again.");
    }
  };

  const handleSavePreferences = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Preferences saved");
    } catch (error) {
      console.error("Save preferences error:", error);
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  const handleSignOutDevice = async (deviceId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Signed out of device");
    } catch (error) {
      console.error("Sign out device error:", error);
      toast.error("Failed to sign out of device. Please try again.");
    }
  };

  const handleSignOutAll = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setShowSignOutDialog(false);
      toast.success("Signed out of all devices except this one");
    } catch (error) {
      console.error("Sign out all devices error:", error);
      toast.error("Failed to sign out of all devices. Please try again.");
      setShowSignOutDialog(false);
    }
  };

  return (
    <AppShell activePage="profile" breadcrumbs={["Settings", "Profile"]}>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div>
          <h1>My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and account security
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditingProfile && (
                    <Button variant="outline" size="sm" onClick={handleEditProfile}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditingProfile}
                      className={!isEditingProfile ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userRole?.toLowerCase() + "@lpgeng.lk"}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 7X XXX XXXX"
                      disabled={!isEditingProfile}
                      className={!isEditingProfile ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value="Production"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={userRole || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Input
                      id="manager"
                      value="Nuwan Silva"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <>
                    <Separator />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        <Check className="h-4 w-4 mr-2" />
                        Save changes
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Password */}
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password regularly to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {newPassword && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 flex-1 rounded-full ${
                        newPassword.length < 6 ? "bg-destructive" :
                        newPassword.length < 10 ? "bg-orange-500" :
                        "bg-primary"
                      }`} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {newPassword.length < 6 ? "Weak" :
                       newPassword.length < 10 ? "Medium" :
                       "Strong"} - Use at least 8 characters
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleUpdatePassword}>Update password</Button>
                </div>
              </CardContent>
            </Card>

            {/* Sessions & Devices */}
            <Card>
              <CardHeader>
                <CardTitle>Sessions & Devices</CardTitle>
                <CardDescription>Manage your active sessions across devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last active</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {session.device.includes("iPhone") ? (
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Monitor className="h-4 w-4 text-muted-foreground" />
                            )}
                            {session.device}
                          </div>
                        </TableCell>
                        <TableCell>{session.location}</TableCell>
                        <TableCell>{session.lastActive}</TableCell>
                        <TableCell className="text-right">
                          {session.lastActive !== "Active now" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSignOutDevice(session.id)}
                            >
                              Sign out
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => setShowSignOutDialog(true)}
                  >
                    Sign out of all devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Avatar */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>Update your profile photo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                      {fullName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload new photo
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Preferences</CardTitle>
                <CardDescription>Manage visibility and formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show in directory</Label>
                    <p className="text-sm text-muted-foreground">
                      Appear in team search
                    </p>
                  </div>
                  <Switch
                    checked={showInDirectory}
                    onCheckedChange={setShowInDirectory}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Preferred contact method</Label>
                  <RadioGroup value={contactMethod} onValueChange={setContactMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="cursor-pointer">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phoneRadio" />
                      <Label htmlFor="phoneRadio" className="cursor-pointer">Phone</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time format</Label>
                  <Select value={timeFormat} onValueChange={setTimeFormat}>
                    <SelectTrigger id="timeFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24-hour</SelectItem>
                      <SelectItem value="12">12-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences}>Save</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sign Out All Devices Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign you out of all sessions except your current one. 
              You'll need to sign in again on those devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOutAll}>
              Sign out all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
